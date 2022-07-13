import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job, JobApiRequest, JobApiResponse } from './jobs';

import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('jobs')
export class JobsController {
    constructor(private jobsService: JobsService) {}

    @Get()
    @ApiOperation({ summary: 'Get a list of all current available positions.', })
    @ApiResponse({ status: 200, description: 'The foound record', type: Job })
    public getJobs(): Promise<Job[]>{
        return this.jobsService.getJobs();
    }

    @Get()
    @ApiOperation({ summary: 'Get a list of all current available positions that match a job title description.', })
    @ApiResponse({ status: 200, description: 'The foound record', type: Job })
    public getJobsByTitle(@Param() title: string): Promise<Job[]>{
        return this.jobsService.getJobsByTitle(title);
    }

    @Post()
    @ApiOperation({ 'summary': 'Post a new available position.'})
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    public postJob(@Body()job: Job): Promise<Job> {
        return this.jobsService.postJob(job);
    }

    @Put(':id')
    @ApiOperation({ 'summary': 'Update an existing position.'})
    @ApiResponse({ status: 200, description: 'The record has been updated.'})
    public async putJob(@Body() job: Job): Promise<JobApiResponse> {
        this.jobsService.putJob(job);
        return {
            status: 200,
            description: 'The record has been updated.'
        }

    }

    @Delete(':id/:company/:postedDate')
    @ApiOperation({ 'summary': 'Close an available position.'})
    @ApiResponse({ status: 200, description: 'Record successfully deleted.'})
    public async deleteJob(@Param() param: JobApiRequest): Promise<JobApiResponse> {
        this.jobsService.deleteJob(param.id, param.company, param.postedDate);
        return {
            status: 200,
            description: 'Record ' + param.id + ' was successfully deleted.'
        };
    }
}