sam deploy --template-file ./.aws-sam/build/template.yaml --stack-name=intllpnt-iapps-dev-jobs --s3-bucket aws-sam-cli-managed-default-samclisourcebucket-keboggyh76p6 --capabilities CAPABILITY_NAMED_IAM --tags Application="Internal Apps" Environment="dev" buildInfo=`date +%s` --region us-east-1 --no-fail-on-empty-changeset --parameter-overrides deployEnv=dev infraStack=intllpnt-iapps-dev-infra