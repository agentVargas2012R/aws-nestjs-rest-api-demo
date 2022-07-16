cd ../

sam build -t ../cognito.yaml

sam deploy -t ./.aws-sam/build/template.yaml --stack-name=intllpnt-iapps-dev-cognito --s3-bucket aws-sam-cli-managed-default-samclisourcebucket-keboggyh76p6 --capabilities CAPABILITY_NAMED_IAM --tags Application="Internal Apps"
