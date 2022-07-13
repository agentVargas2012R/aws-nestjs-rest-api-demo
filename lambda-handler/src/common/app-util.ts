import {Job} from '../jobs/jobs';

export class AppUtil {
    public static getPK(key: string) {
         console.log(key);
         const result = key.toLowerCase().split(" ").join("_");
         console.log(result);
         return result;
    }
    public static getSK(job: Job) {
        return job.postedDate + "#" + job.company.toLowerCase();
    }
    public static buildApiResponse(message: string){
        return {
            status: 200,
            description: message
        }
    }
}