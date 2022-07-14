import {SQSClient, SendMessageCommand, SendMessageCommandInput } from '@aws-sdk/client-sqs';
export class SQSUtil {

    sqs: SQSClient;
    constructor() {
        this.sqs = new SQSClient({apiVersion: '2012-11-05'});
    }

    public async sendMessage(payload: any) {
        const params: SendMessageCommandInput = {
            DelaySeconds: 10,
            MessageAttributes: {
                "EventType": {
                    DataType: "String",
                    StringValue: "intellipoint-iapps-message"
                }
            },
            MessageBody: JSON.stringify(payload),
            QueueUrl: process.env.queueUrl
        }

        const result =  await this.sqs.send(new SendMessageCommand(params));
        console.log(result);
        return result;
    }
}