import {Job} from '../jobs/jobs';
import {LogInvocation} from './log-decorator';

export class AppUtil {

    @LogInvocation
    public static async getPK(key: string) {
         return await key.toLowerCase().split(" ").join("_");
    }
    @LogInvocation
    public static async getSK(job: Job) {
        return await job.postedDate + "#" + job.company.toLowerCase();
    }
    public static buildApiResponse(message: string){
        return {
            status: 200,
            description: message
        }
    }
}