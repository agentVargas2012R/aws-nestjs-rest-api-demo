import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { Express } from 'express';
import { Server } from 'http';
import { Context } from 'aws-lambda';
import {createServer, proxy, Response}  from 'aws-serverless-express';
import * as express from 'express';


import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export async function configureOpenSpec(app: any){
    const config = new DocumentBuilder()
      .setTitle("Jobs Demo API Spec")
      .setDescription('A Demo Job Board')
      .setVersion("1.0")
      .addTag("Jobs")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('info', app, document);
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    configureOpenSpec(app);
    await app.listen(3000);
}

if(process.env.local) bootstrap();


