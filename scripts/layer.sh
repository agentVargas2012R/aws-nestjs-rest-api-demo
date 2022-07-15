cd ../aws-nodejs14x-nestjs-layer
rm -Rf node_modules
npm install
cd ../scripts

sam build -t ../layer.yaml
sam deploy --template-file ./.aws-sam/build/template.yaml --stack-name=intllpnt-iapps-dev-runtime --s3-bucket aws-sam-cli-managed-default-samclisourcebucket-keboggyh76p6 --capabilities CAPABILITY_NAMED_IAM --tags Application="Internal Apps Standardized Runtime" Environment="dev" buildInfo=`date +%s` --region us-east-1 --no-fail-on-empty-changeset --parameter-overrides deployEnv=dev infraStack=intllpnt-iapps-dev-infra