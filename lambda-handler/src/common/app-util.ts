import {Job} from '../jobs/jobs';
import {LogInvocation} from './log-decorator';

export class AppUtil {

    @LogInvocation
    public static async getPK(key: string) {
         return await key.toLowerCase().split(" ").join("_");
    }
    @LogInvocation
    public static async getSK(job: Job) {
        return await job.postedDate + "#" + await AppUtil.getPK(job.state) + "#" + await AppUtil.getPK(job.company);
    }
    public static buildApiResponse(message: string){
        console.log("testing iterative");
        return {
            status: 200,
            description: message
        }
    }
}