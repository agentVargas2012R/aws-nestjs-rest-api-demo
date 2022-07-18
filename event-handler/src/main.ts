import axios from 'axios';
import cheerio from "cheerio";
import {DynamoDBClient, BatchWriteItemCommand} from '@aws-sdk/client-dynamodb';
import {AppUtil} from './common/app-util';
import {Job} from './models/jobs';

export class Main {

  dbClient: DynamoDBClient;
  states = ['FL', 'CA', "NY", "TX"];
  constructor() {

    if(process.env.local) console.log("\nBootstrapping Local DynamoDB Endpoint\n");
    this.dbClient = process.env.local ?
        new DynamoDBClient({
            region: "us-east-1",
            endpoint: process.env.endpoint
        })
        : new DynamoDBClient({region: "us-east-1"});
  }

  public async launch() {
        let site = process.env.site;
        for(let state of this.states) {
             const url = site + "&l=" + state;
             const document = await this.access(url);
             const jobs = await this.transform(document);
             await this.persist(jobs, state);
             console.log(jobs);
         }
  }

  public async persist(jobs: any[], state):Promise<void> {

       const putItemRequests: Job[] = [];
       for(let job of jobs) {
           job.state = state;
           const Item = {
                 "pk": {"S": await AppUtil.getPK(job.name)},
                 "sk": {"S": await AppUtil.getSK(job)},
                 "name": {"S": `${job.name}`},
                 "company": {"S": `${job.company}`},
                 "geoLocation": {"S": `${job.companyLocation}`},
                 "state": {"S": `${job.state}`},
                 "fullTime": {"S": `${job.fullTime === true}`},
                 "description": {"S": `${job.description}`},
                 "payRange": {"S": `${job.payRange}`},
                 "postedDate": {"S":  `${job.postedDate}`}
           }

           let PutRequest: any = {};
           PutRequest = { "PutRequest": {"Item" : Item} } ;

           putItemRequests.push(PutRequest);
       }

       const params = await AppUtil.createBatchWriteRequest(process.env.tableName, putItemRequests);
       const command = new BatchWriteItemCommand(params);
       const response = await this.dbClient.send(command);
       console.log(response);
  }

  public async access(site: string): Promise<any> {
        try {
            const { data, status } = await axios.get<any>(
              site
            );
            return await cheerio.load(data);
        }catch (error) {
             if (axios.isAxiosError(error)) {
               console.log('error message: ', error.message);
               console.log(error.message);
             } else {
               console.log('unexpected error: ', error);
             }
       }
  }

  public async transform($): Promise<any> {
      const featuredJobs = $(".resultContent");

      let jobs: Job[] = [];

      for(let i =0; i < featuredJobs.length; i++ ) {

          let title = $($(featuredJobs[i]).find(".jobTitle")[0]).text();
          if(!title.startsWith(".css")) {
              const job: Job = {
                   pk: await AppUtil.getPK($($(featuredJobs[i]).find(".jobTitle")[0]).text()),
                   name: $($(featuredJobs[i]).find(".jobTitle")[0]).text(),
                   company:  $($(featuredJobs[i]).find(".companyName")[0]).text(),
                   geoLocation: $($(featuredJobs[i]).find(".companyLocation")).text(),
                   state: 'NA',
                   payRange: '',
                   description: $($(featuredJobs[i]).find(".job-snippet")[0]).text(),
                   fullTime: true,
                   postedDate: 'NA'
              };

              const metaDataContainer = $($(featuredJobs[i]).find(".heading6")[1]).html();
              let estimatedSalary = $($(metaDataContainer).find(".estimated-salary")[0]).text().trim();
              const salary = estimatedSalary ? estimatedSalary : "Not Available";

              let jobType = $($(metaDataContainer).find(".attribute_snippet")[0]).text();
              if(jobType == "Part-time") {
                  job.fullTime = false
              }
              job.payRange = salary;

              jobs.push(job);
         }

      }

      let jobCardShelfContainer = $(".jobCardShelfContainer")
      for(let i =0; i < jobCardShelfContainer.length - 1; i++ ) {
               let description = $($(jobCardShelfContainer[i]).find(".job-snippet")[0]).text();
               jobs[i].description = (description) ? description :  "";
               let date = $($(jobCardShelfContainer[i]).find(".date")[0]).text();
               jobs[i].postedDate = date ? AppUtil.calculateDate(date): jobs[i].postedDate;
      }

      return jobs;
    }

}

new Main().launch();
