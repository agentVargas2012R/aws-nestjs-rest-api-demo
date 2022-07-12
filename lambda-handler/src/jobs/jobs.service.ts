import { Injectable } from '@nestjs/common';
import { Job } from './jobs';
import { JOBS } from './jobs.mock';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JobsService {

    private jobs: Job[] = JOBS;

    public async getJobs(): Promise<Job[]> {
        console.log("GET:");
        console.log(this.jobs);
        return await this.jobs;
    }

    public async postJob(job: Job): Promise<Job> {
        job.id = `${uuidv4()}`;
        this.jobs.push(job);
        return job;
    }

    public async putJob(job: Job): Promise<void> {
        let updatedJobId = this.jobs.findIndex((existingJob) => {
            if(existingJob.id === job.id) return existingJob;
        });

        if(updatedJobId) Object.assign(this.jobs[updatedJobId], job);

        console.log("PUT");
        console.log(this.jobs);
    }

    public async deleteJob(id: String): Promise<void> {
        let idx = this.jobs.findIndex((job) => {
            return job.id === id;
        });

        if(idx) this.jobs.splice(idx, 1);

         console.log("DELETE");
         console.log(this.jobs);
    }
}
