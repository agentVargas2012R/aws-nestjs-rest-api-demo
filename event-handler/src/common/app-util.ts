import {Job} from '../models/jobs';
import {LogInvocation} from './log-decorator';
import { DateTime } from "luxon";

export class AppUtil {

    @LogInvocation
    public static async getPK(key: string) {
         return await key.toLowerCase().split(" ").join("_");
    }
    @LogInvocation
    public static async getSK(job: Job) {
        return await job.postedDate + "#" + await AppUtil.getPK(job.state) + "#" + await AppUtil.getPK(job.company);
    }
    @LogInvocation
    public static async createBatchWriteRequest(tableName: string, items: any[]) {
        let RequestItems: any = {};
        RequestItems[tableName] = [];

        let params = { RequestItems };
        params.RequestItems[tableName] = items;

        console.log(params);
        return params;
    }

    public static calculateDate(datePosted){
        let dayPosted = datePosted.split(" ").find((word) => {
            if(word.match(/\d+/g)) {
                return word;
            }
        });

        if(!dayPosted || dayPosted.includes("+")) return 'NA';

        return DateTime.now().setZone('America/New_York').minus({days:dayPosted}).startOf('day').toMillis();
    }
}