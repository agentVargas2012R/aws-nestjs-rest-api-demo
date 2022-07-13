import {Job} from '../jobs/jobs';

export class AppUtil {
    public static getPK(key: string) {
         return key.toLowerCase().replace(" ", "_");
    }
    public static getSK(job: Job) {
        return job.postedDate + "#" + job.company;
    }
}