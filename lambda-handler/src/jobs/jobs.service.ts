import { Injectable } from '@nestjs/common';
import { Job } from './jobs';
import { JOBS } from './jobs.mock';
import { v4 as uuidv4 } from 'uuid';
import {DynamoDBClient} from '@aws-sdk/client-dynamoDB';
import {AppUtil} from '../common/app-util';
import {DBUtil} from '../common/db-util';
import {SQSUtil} from '../common/sqs-util';
import {SNSUtil} from '../common/sns-util';
import {LogInvocation} from '../common/log-decorator';

@Injectable()
export class JobsService {

    private jobs: Job[] = JOBS;
    private dbUtil: DBUtil;
    private sqsUtil: SQSUtil;
    private snsUtil: SNSUtil;

    constructor() {
        if(process.env.local) console.log("\nBootstrapping Local DynamoDB Endpoint\n");
        const dynamoDB = process.env.local ?
            new DynamoDBClient({
                region: "us-east-1",
                endpoint: process.env.endpoint
            })
            : new DynamoDBClient({region: "us-east-1"});
        this.dbUtil = new DBUtil(dynamoDB);
        this.sqsUtil = new SQSUtil();
        this.snsUtil = new SNSUtil();
    }

    public async getJobs(): Promise<Job[]> {
        const result = await this.dbUtil.scan();
        return result.map((job) => {
            return {
                pk: job.pk.S,
                sk: job.sk.S,
                name: job.name.S,
                description: job.description.S,
                company: job.company.S,
                fullTime: job.fullTime.S === "true",
                geoLocation: job.geoLocation.S,
                payRange: job.payRange.S,
                postedDate: job.postedDate.S
            }
        }) as Job[];
    }

    public async getJobsByTitle(title: string, time: string) {
            const result = await this.dbUtil.query(title, time);
            return result.map((job) => {
                return {
                    pk: job.pk.S,
                    name: job.name.S,
                    description: job.description.S,
                    company: job.company.S,
                    geoLocation: job.geoLocation.S,
                    fullTime: job.fullTime.S === "true",
                    payRange: job.payRange.S,
                    postedDate: job.postedDate.S
                }
            }) as Job[];
    }

    public async postJob(job: Job): Promise<Job> {
        job.postedDate = `${new Date().getTime()}`;
        job.pk = await AppUtil.getPK(job.name);
        let sk = await AppUtil.getSK(job);
        await this.dbUtil.put(job, sk);
        await this.snsUtil.sendMessage(job);
        return job;
    }

    @LogInvocation
    public async putJob(job: Job): Promise<void> {
       let sk = await AppUtil.getSK(job);
       await this.dbUtil.put(job, sk);
       await this.snsUtil.sendMessage(job);
    }

    public async deleteJob(pk: string, company: string, postedDate: string): Promise<void> {
        await this.dbUtil.delete(pk, company, postedDate);
        await this.snsUtil.sendMessage({
            pk,
            company,
            postedDate,
            message: "Record has been deleted"
        });
    }
}
