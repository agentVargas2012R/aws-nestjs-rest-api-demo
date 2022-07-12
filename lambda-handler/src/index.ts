import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { Express } from 'express';
import { Server } from 'http';
import { Context } from 'aws-lambda';
import { createServer, proxy, Response }  from 'aws-serverless-express';
import * as express from 'express';
import { AppModule } from "./app.module";
import {configureOpenSpec} from "./main";

let cachedServer: Server;

async function createExpressApp (expressApp: Express): Promise<INestApplication> {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp)
    )
    return app;
}

async function bootstrapLambda(){
    const expressApp = express();
    const app = await createExpressApp(expressApp);
    configureOpenSpec(app);
    await app.init();

    return createServer(expressApp);
}

export async function handler(event:any, context: Context): Promise<Response> {

    if( !cachedServer ) {
        const server = await bootstrapLambda();
        cachedServer = server;
    }

    console.log("Event:");
    console.log(event);
    console.log("Context:");
    console.log(context);

    return proxy(cachedServer, event, context, 'PROMISE').promise;
}
