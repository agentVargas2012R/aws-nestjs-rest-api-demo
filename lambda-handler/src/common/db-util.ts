import * as AWS from 'aws-sdk'
import {AppUtil} from './app-util';
export class DBUtil {

    dynamoDB: AWS.DynamoDB.DocumentClient;
    constructor(dynamoDB: AWS.DynamoDB.DocumentClient) {
        this.dynamoDB = dynamoDB;
    }

    public async scan() {
         const params = {
            TableName: process.env.tableName
        }
        const result = await this.dynamoDB.scan(params).promise();
        return result?.Items;
    }

    public async query(title: string) {
        let key: string = AppUtil.getPK(title);
        const params = {
            TableName: process.env.tableName,
            KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':pk': key,
                ':sk': '2022-07-15'
            }

        };
        const result = await this.dynamoDB.query(params).promise();
        return result?.Items;
    }

    public async delete(pk: string, company: string, postedDate: string) {
            const params = {
                TableName: process.env.tableName,
                Key: {
                    pk: pk,
                    sk: `${postedDate}#${company.toLowerCase()}`
                }
            }
            await this.dynamoDB.delete(params).promise();
    }

    public async put(job: any, sk: string) {
        try {
           let result = await this.dynamoDB.put({
               TableName: process.env.tableName,
               Item: {
                sk,
                ...job
               }
           }).promise();
       } catch(e) {
           console.log(e);
       }
    }
}