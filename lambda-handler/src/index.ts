import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { Express } from 'express';
import { Server } from 'http';
import { Context } from 'aws-lambda';
import * as awsServerlessExpress  from 'aws-serverless-express';
import * as express from 'express';
import { AppModule } from "./app.module";
import {configureOpenSpec} from "./main";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import helmet from 'helmet';

let cachedServer: Server;

async function createExpressApp (expressApp: Express): Promise<NestExpressApplication> {

    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(expressApp)
    )

    app.use(helmet({
         contentSecurityPolicy: false,
    }));

    return app;
}

async function bootstrapLambda(){
    const expressApp = express();
    const app = await createExpressApp(expressApp);
    const config = new DocumentBuilder()
      .setTitle("Jobs Demo API Spec")
      .setDescription('A Demo Job Board')
      .setVersion("1.0")
      .addTag("Jobs")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
    //app.use(app.useStaticAssets("api"));

    return awsServerlessExpress.createServer(expressApp);
}

export async function handler(event:any, context: Context): Promise<awsServerlessExpress.Response> {

//      console.log("Before: " + event.path);
//      if(event.path === '/api') event.path = '/api/';
//      event.path = event.path.includes('swagger-ui') ? `/api${event.path}` : event.path;
//      console.log("After: " + event.path);

    if( !cachedServer ) {
        const server = await bootstrapLambda();
        cachedServer = server;
    }

    console.log("Event:");
    console.log(event);

    console.log("Context:");
    console.log(context);


    return await awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE').promise;
}
