## aws-nestjs-restapi-demo

#### A sample reference implementation of an AWS Microservce developed with a serverless and automated approach.

## Requirements

* Docker installed
* AWS CLI is already configured and working properly.
* AWS SAM CLI is installed.
* A solid understanding of IAM.
* Node is installed.
* Clone this project.

## Setup Process

Here is how you can get the project up and running relatively quickly.

## Local Quick Start

### Setting up dynamoDB locally

1. Navigate the local-setup folder
```aidl
aws-nestjs-restapi-demo
    | - lambda-handler
    | - scripts 
            | - local-setup 
```

2. Install dynamodb local

```aidl
./install-dynamodb-local.sh
```

3. Create the dynamodb table
```aidl
./create-table.sh
```

4. Populate the table with some sample data
```aidl
./put-item.sh
```

### Running The Microservice
1. Navigate the project structure and locate the lambda-handler folder:

```aidl
aws-nestjs-restapi-demo
    | - lambda-handler
    | - scripts
```

2. Run the installation command:

```aidl
npm install
```

3. Navigate back to the scripts directory and start the app using this:

```aidl
./run.sh
```

### Deploying to AWS

Ensure you are a valid aws user/assumed role that has the 
appropriate IAM permissions or you will run into problems deploying.

### 1.) Deploying the infrastructure with AWS SAM
1. Navigate to the scripts/infra directory.
```aidl
aws-nestjs-restapi-demo
    | - lambda-handler
    | - scripts
            |- infra
```

2. Run the build script
```aidl
./build.sh
```
3. Deploy the infrastructure
```aidl
./deploy.sh
```

### 2.) Deploying the Lambda Layer
1. Navigate to the scripts/ directory.
```aidl
aws-nestjs-restapi-demo
    | - lambda-handler
    | - scripts
```

2. Build the layer
```aidl
./layer.sh
```

### 3.) Deploying the Application
1. Navigate the scripts directory

2. Build the project

```aidl
./project.sh
```

3. Build the sam template
```aidl
./build.sh
```

4. Deploy the project
```aidl
./deploy.sh
```

Note - for this to work, you must have a user or assumed role configured with AWS API, Cognito, Lmbda, SNS, SQS and SES permissions.

## Tech Stack

#### This implementation is composed of various AWS Services and Frameworks. Most notably are the following:
* TypeScript
* NestJS
* AWS Lambda
* AWS Layers
* AWS API Gateway
* AWS SAM Templates 
* AWS DynamoDB
* AWS SNS
* AWS SQS
* AWS Cognito
* AWS SES

### A high-level walk through of each element listed here is as follows...

### TypeScript

This implementation uses TypeScript. TypeScript proves
to be an amazing language that gives us some control
over what can be some wild javascript unpredictability 
with variables. For small systems, it may not be that big of a deal.

However, the focus is to know what we are dealing with when looking
at a thousand lines of code. We want to know that if we declare
duck, it is really a duck and not something else that
overwrote it only to find out that it's a giraffe.

### NestJS 

The NestJS framework is used in this stack is being used to serve the content and interface with the AWS ecosystem. The framework is setup as a microservice and handles all the HTTP Verb requests sent to the API Gateway. 

This rest service contains a Swagger OpenSpec 3.0 specification endpoint when hitting the api-json endpoint.

Locally, the NestJS application will boot up using the default approach, however, on the AWS environment, it will bootstrap using the ExpressAdapter utilizing aws-serverless-express and passing the loaded application to the aws lambda-handler. 
The determination of which to use is configured through the run.sh script.

### REST Endpoint Specification

To get an idea of the exposed endpoints available, see the following OpenSpec 3.0:
```aidl
http://localhost:3000/api
```

For a detailed walk through of NestJS, see the readme file in the lambda-handler for documentation.

### AWS API Gateway

The API Gateway is exposed as an internal endpoint which is configured as a proxy passthrough. 
Since this is a rest-api, it also serves content. Note that this endpoint is only available on the real AWS environment. 
This makes the endpoint callable and available to the public. 

The endpoint is instrumented in the infra.yaml stack. 

### AWS Lambda

The NestJS application sits inside an exposed AWS Lambda function. 
The function is responsible for interfacing with all the other AWS native services. 
The NestJS is able to interact with these services through the use of environment variables 
injected onto the runtime application. This also happens through the use of build deployment scripts.

### DynamoDB

The AWS Service is used to house NoSQL data. 
The implementation attempts to apply the advanced single-table pattern for data access.
It makes use of composite sorting keys and primary keys. 
The combination of these allow for crud operations while supporting the ability to store multiple entities in a single table.


### AWS SNS

The SNS Service is used for publication of events that take place. 
In this microservice, the NestJS publishes events to a SNS topic to make use 
of the pub/sub pattern. That is to notify any consumers or subscribers that 
are interested in receiving notifications, events and so on will have the ability
to receive such information. 


### AWS SQS

This is staged to be used in the event-handler project. 

### AWS Cognito

This is used to house and help with authorization and authentication. The authentication
happens through an aws-cognito api gateway integration. The two work together to 
determine if a user should be allowed to access a resource. 

#### Note - for this to work as originally intended, you will need to have a valid AWS Certificate 
for your domain as cognito requires it in order to utilize the built-in UI console. This is still in development but will be in the next iteration of this project.

### AWS SES

This service is used to serve email templates to the subscribed users. 

#### Note - SES requires you to register MX and SPF records to your Route53. This was not done with Cloudformation Templates for this project.

# Architecture

The goal of this implementation is to create a clean, maintainable and robust application 
that can scale infintely while having minimal downtime and be HA compliant. 

## Serverless

### Highly Scalable, Available and Redundant
With Minimal Administration, the was the intention of using serverless architecture. Namely, API Gateway, 
Lambda, DynamoDB, SNS and SQS. Each of these are managed by AWS and can
scale with little to no management. 

### Single-Table NoSQL Data Access Approach
The single table pattern makes use of utillizing the Primary Key in combination 
with the sorting key. In this implementation, we utilize a job name with an epoch timestamp.
This allows us to make use of querying data by name and dates. Utilizing composite keys, 
we can not only search for date and time but also company.

The sorting looks like this:

```aidl
PK: `${name}`
SK: `${timestamp}#${company}`
```

This implies that a unique record will consist of the name, company and time the job was posted.
This allows the ability to traverse multiple timelines within a single table without 
relying on GSI or LSI. That said, those could also be added to support other queries.

The advantage of this approach is if we wanted to introduce a new entity, we are able to do so
without adding a new table. This means we can have a one-stop-shop for our data storage.

### Frameworks 

The cloud community is very divded on whether we should be using framework or not. At the end of the day, 
I'm usually not the one who makes that call...this means I need to know both ways to meet deadlines. 
For a reference implementation that deliberately avoids frameworks, see the event-handler project. 
This was built with home-grown frameworks that accomplish a similar approach.

#### The argument for them:

Using a framework like NestJS is awesome in my opinion. It is an excellent way to 
use an ecosystem of tools and utilities that take care of many concerns the average developer
doesn't have to think or know about. Frameworks deal with challenging problems 
that many developers take for granted. While frameworks can bloat your lambda function
which is especially true for node, aws provides lambda layers. This implementation
utilizes those to solve the adage of NestJS sizes.

For an idea of the cost of space for each technology, check out the metrics npm task
```aidl
npm run metrics
```

This will give you a read out of each npm library and what consumes it.

### AWS SDK

This implementation makes use of AWS SDK V3. This is a major, and I mean, MAJOR
improvement in many ways to importing everything as * into your application.
As a fun test you can prove to yourself how much space it takes up, run your
app with the import * as AWS from 'aws-sdk'. 

The main advantage of v3 is that we can have more granular control over what
services we want to integrate with and deal with. Additionally, the 
implentation of these is clean and uses the command pattern approach. 
That means interacting with each service essentially follows the same pattern... 
for the most part. This brought the storage constraints down to 1/4 the original size.

To reduce build time and create a consistent runtime environment similar to docker, 
this implementation makes use of aws lambda layers.

### AWS Lambda Layers

Abstracting the AWS Lambda Layers allows us to create a consistent, repeatable
runtime environment for our applications to execute in. Because of this, 
we can separate out all the potential bundled dependencies in our nodejs
application and put them into there own container. 

It means that we can perform the build cycle much faster than if we put everything in a single lambda.

Plus, this implies that when using layers, aws will load the layer first which will
include our bundled dependencies before loading our main lambda function. 
This means we can create our package.json without explicitly calling these out
on the aws environment because they will be natively available to the lambda function.

By locking these to specific versions, we have a frozen runtime environment
which is shielded from breaking changes...a considerable issue in node.

### AWS SAM Templates

The following templates exist in the application:
* cognito.yaml
* infra.yaml
* layer.yaml
* template.yaml 

### The reason for the separation of templates is as follows:

In order to prevent accidental deletions of resources that do not change over time and
to increase over all build time, I wanted to separate out the infrastructure
from the application code. If you think about it, we don't really need to change
a user dynamoDB table that often when compared to an API Gateway or Lambda function.
The same holds true of SNS or SQS. Once these integrations are completed, generally speaking,
they don't really change much. That's where the infa stak comes into play.

### infra.yaml

The infra stack is a collection of AWS Resources that seldom change once they're stood up.
This is pretty much a one and done. We don't want to build a dyanmodb table on every 
deployment nor do we want that as a deployment step in our process. 

Deployments are expensive and we want to make use of those seconds because over 
a year they add up to days.

### cognito.yaml

Out of all the resources I just mentioned, the two that probably will change the least in my
opinion is going to be the Cognito. Sure, cognito itself may change, or the integration IDP
may change or something along that nature but from an integration standpoint, not much.

That is why these two are in there own template. They are like AWS Glacier. 

### layer.yaml

The separation of aws lambda layers is to avoid having to build these with each
deployment and inadvertently creating new versions of the lambda layer. I want 
to manage the lambda layers frugally. We shouldn't have many different versions
of the same runtime, only the required one. 

To avoid this, the lambda layer is separated into its own template so that
it can be built on its own terms. This also means that it seldomly changes but
because we need to version manage it a bit different, it should live here.

### template.yaml

This template consist of the changing resources and is the main template as
the name implies. This contains the API Gateway, Lambda and Role appropriate
for the lambda function to carry out its execution.

### Convention Over Configuration

#### Stack Naming Convention
The naming pattern for the stacks following the scheme:

````aidl
${organization}-${applicationType}-${environment}-${AWS resourceType}
````

where:

* organization - represents the company.
* applicationType - represents a department or application type.
* environment - represents the environment that the function is targeted for.
* resourceType - represents what aws service it is.

Here is an example:

A lambda function will have the following stack-name:
```aidl
acme-financeApp-dev-lambda
```

The naming convention is chosen to clearly convey what the intention of this lambda function is.
It also convey's where it belongs, what environment it uses and what type of aws service it represents.

### Application Organization

If you are familiar with NestJS, this is one of the general concerns
it addresses as an opionated framework. I agree with most
of these opinions given my general background as a java developer.

In short, this is a pod-style layout. Each entity or component
of the system contains controllers, services, models and
test cases. 

For my example, this can be found here:

```aidl
lambda-handlßer
        |- src
            |- jobs
                - jobs.controller.ts
                - jobs.module.ts
                - jobs.ts
                - jobs.service
```
By naming convention of each extension, it's clear 
that each file is responsible for the overall behavior 
while decoupling each from each other. 

In addition, general utilities that are used across
components have been abstracted to a common directory
For this application, since we are utilizing the aws 
ecosystem with AWSK SDK V3, this folder is dedicated
to common functions and wrappers needed across the app.

These are developed utilizing abstraction and providing
an additional layer to avoid the intricacies of using
the sdk client libraries. Also, it handles and deals
with the pk and sk formation. 

```aidl
lambda-hanlder
        |- src
            |- common
                - app-util.ts
                - db-util.ts
                - sns-util.ts
                - sqs-util.ts
```

# Business Function

I was talking to a close colleague of mine the other day, his name is
Deepak. As I was attempting to use Google Assistant, it accidently 
texted my other friend, who's name was also Deepak. I decided that
given the name's popularity, that this application would be called Deepak
in honor of them ;)

That's how we devs roll, no meetings on names, no PMO or marketing team on 
the name of the app...nah...the app is Deepak. 

## Application: Deepak 

Deepak is a job board powered by AWS. Deepak tracks job postings. In addition, the system
notifies when new jobs become available. It interfaces
with external sites and api's to data-mine the boards to discover what
jobs are available. Deepak never sleeps and he is always
looking for a new opportunity.

Deepak is open to extension. It is very much a real system. 
You could easily create a workflow where we process data, 
capture metrics based on our data and interface with third-party
companies. ALl of this would be relatively simple.

# System Design

The system architecture and design is exposed as the following two systems.
The scope of this project is outlined in the red.

![The Deepak System](./Deepak.png, "Data Mining Job Board System"")

As you might expect, this is a traditional AWS microservice with one caveat,
it interfaces with an SNS topic. This implies that
the application is open to extension through that topic.

If we wanted to extend the systems to others internal/external,
other systems would subscribe to this topic and receive
incoming events. This allows us to follow the fire-and-forget
design pattern. 

Doing so decouples the microservices from one another. 
Also, we can have multiple consumers receive the same event
without changing code. They would simply subscribe to our topic.


