import * as AWS from 'aws-sdk';

export class SNSUtil {
    sns: AWS.SNS;
    constructor() {
        AWS.config.update({region: "us-east-1"});
        this.sns = new AWS.SNS({apiVersion: '2010-03-31'});
    }

    public async sendMessage(payload: any) {
        const params = {
            TopicArn: process.env.topicArn,
            MessageAttributes: {
                EventType: {
                    DataType: "String",
                    StringValue: "intellipoint-iapps-message"
                }
            },
            Message: JSON.stringify(payload)
        }

        const result = await this.sns.publish(params).promise();
        console.log(result);
    }
}