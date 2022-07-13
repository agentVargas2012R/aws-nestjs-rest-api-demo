import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { Express } from 'express';
import { Server } from 'http';
import { Context } from 'aws-lambda';
import * as awsServerlessExpress  from 'aws-serverless-express';
import * as express from 'express';
import { AppModule } from "./app.module";
import {configureOpenSpec} from "./main";
import helmet from 'helmet';

let cachedServer: Server;

async function createExpressApp (expressApp: Express): Promise<INestApplication> {
    const app = await NestFactory.create(
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
    configureOpenSpec(app);
    await app.init();
    return awsServerlessExpress.createServer(expressApp);
}

export async function handler(event:any, context: Context): Promise<awsServerlessExpress.Response> {

    if( !cachedServer ) {
        const server = await bootstrapLambda();
        cachedServer = server;
    }

    console.log("Event:");
    console.log(event);
    console.log("Context:");
    console.log(context);

    return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE').promise;
}
