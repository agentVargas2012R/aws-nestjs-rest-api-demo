import {Job} from '../jobs/jobs';
import {LogInvocation} from './log-decorator';

export class AppUtil {

    @LogInvocation
    public static getPK(key: string) {
         return key.toLowerCase().split(" ").join("_");
    }
    @LogInvocation
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