import * as AWS from 'aws-sdk';
export class SQSUtil {

    sqs: AWS.SQS;
    constructor() {
        AWS.config.update({region: "us-east-1"});
        this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    }

    public async sendMessage(payload: any) {
        const params = {
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

        const result =  await this.sqs.sendMessage(params).promise();
        console.log(result);
        return result;
    }
}