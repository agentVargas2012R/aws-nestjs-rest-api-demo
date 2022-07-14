import {DynamoDBClient, ScanCommand, ScanCommandInput,QueryCommand, QueryCommandInput,
DeleteItemCommand, DeleteItemCommandInput, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'
import {AppUtil} from './app-util';
import {LogInvocation} from './log-decorator';

export class DBUtil {

    dynamoDB: DynamoDBClient;
    constructor(dynamoDB: DynamoDBClient) {
        this.dynamoDB = new DynamoDBClient(dynamoDB);
    }

    public async scan() {
         const params: ScanCommandInput = {
            TableName: process.env.tableName
        }
        const command = new ScanCommand(params);
        const result = await this.dynamoDB.send(command);
        return result?.Items;
    }

    public async query(title: string, time: string) {
        let key: string = await AppUtil.getPK(title);
        const params: QueryCommandInput = {
            TableName: process.env.tableName,
            KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':pk': {"S": key },
                ':sk': {"S": time }
            }

        };
        const command = new QueryCommand(params);
        const result = await this.dynamoDB.send(command);
        return result?.Items;
    }

    public async delete(pk: string, company: string, postedDate: string) {
            const params = {
                TableName: process.env.tableName,
                Key: {
                  "pk": {"S": pk},
                  "sk": {"S": `${postedDate}#${company.toLowerCase()}`},
                }
            }

            await this.dynamoDB.send(new DeleteItemCommand(params));
    }

    public async put(job: any, sk: string) {
        try {
           const params: PutItemCommandInput = {
              TableName: process.env.tableName,
              Item: {
                  "pk": {"S": job.pk},
                  "sk": {"S": sk},
                  "name": {"S": job.name},
                  "company": {"S": job.company},
                  "geoLocation": {"S": job.geoLocation},
                  "fullTime": {"S": "true"},
                  "description": {"S": job.description},
                  "payRange": {"S": job.payRange},
                  "postedDate": {"S":  job.postedDate}
               }
          }
          console.log("PutItemCommandInput: ");
          console.log(params);

          const command = new PutItemCommand(params);
          let result = await this.dynamoDB.send(command);
       } catch(e) {
           console.log(e);
       }
    }
}