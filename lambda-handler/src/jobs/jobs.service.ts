import { Injectable } from '@nestjs/common';
import { Job } from './jobs';
import { JOBS } from './jobs.mock';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk'
import {AppUtil} from '../common/app-util';
import {DBUtil} from '../common/db-util';

@Injectable()
export class JobsService {

    private jobs: Job[] = JOBS;
    private dbUtil: DBUtil;

    constructor() {
        if(process.env.local) console.log("\nBootstrapping Local DynamoDB Endpoint\n");
        const dynamoDB = process.env.local ?
            new AWS.DynamoDB.DocumentClient({
                region: "us-east-1",
                endpoint: process.env.endpoint
            })
            : new AWS.DynamoDB.DocumentClient();
        this.dbUtil = new DBUtil(dynamoDB);
    }

    public async getJobs(): Promise<Job[]> {
        const result = await this.dbUtil.scan();
        return result.map((job) => {
            return {
                pk: job.pk,
                name: job.name,
                description: job.description,
                company: job.company,
                geoLocation: job.geoLocation,
                payRange: job.payRange,
                postedDate: job.postedDate
            }
        }) as Job[];
    }

    public async getJobsByTitle(title: string) {
            const result = await this.dbUtil.query(title);
            return result.map((job) => {
                return {
                    pk: job.pk,
                    name: job.name,
                    description: job.description,
                    company: job.company,
                    geoLocation: job.geoLocation,
                    payRange: job.payRange,
                    postedDate: job.postedDate
                }
            }) as Job[];
    }

    public async postJob(job: Job): Promise<Job> {
        job.postedDate = `${new Date().getTime()}`;
        job.pk = AppUtil.getPK(job.name);
        let sk =  AppUtil.getSK(job);
        await this.dbUtil.put(job, sk);
        return job;
    }

    public async putJob(job: Job): Promise<void> {
       let sk = AppUtil.getSK(job);
       await this.dbUtil.put(job, sk);
    }

    public async deleteJob(pk: string, company: string, postedDate: string): Promise<void> {
        await this.dbUtil.delete(pk, company, postedDate);
    }
}
