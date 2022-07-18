cd ../lambda*
export local=true;
export tableName=intllpnt-iapps-local-infra-table;
export endpoint=http://localhost:8000;
export account=`aws sts get-caller-identity --query Account`
export accountId=`sed -e 's/^"//' -e 's/"$//' <<< "$account"`
export queueUrl=https://sqs.us-east-1.amazonaws.com/$accountId/intllpnt-iapps-dev-infra-sqs;
export topicArn=arn:aws:sns:us-east-1:$accountId:intllpnt-iapps-dev-infra-sns;
printenv;
npm run start:local