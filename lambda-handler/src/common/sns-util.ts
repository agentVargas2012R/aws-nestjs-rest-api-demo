import {SNSClient, PublishCommand, PublishCommandInput} from'@aws-sdk/client-sns';

export class SNSUtil {
    sns: SNSClient;
    constructor() {
        this.sns = new SNSClient({apiVersion: '2010-03-31'});
    }

    public async sendMessage(payload: any) {
        const params: PublishCommandInput = {
            TopicArn: process.env.topicArn,
            MessageAttributes: {
                EventType: {
                    DataType: "String",
                    StringValue: "intellipoint-iapps-message"
                }
            },
            Message: JSON.stringify(payload)
        }

let command: any;
try {command = new PublishCommand(params)} catch(err) {
    console.log("Couldnt create publish command")
}

        const result = await this.sns.send(command);
        console.log(result);
    }
}