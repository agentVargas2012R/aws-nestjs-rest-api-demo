import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty} from 'class-validator';

export class Job {

      @ApiProperty({
          description: 'The id of the job.',
          example: '3bccafbb-61e1-4f21-86b0-081f482c4ae1'
        })
        pk: string;

        @ApiProperty({
          description: 'The name of the job.',
          example: 'Senior Java Developer'
        })
        name: string;

        @ApiProperty({
          description: 'The company where the job is listed.',
          example: 'Spotify'
        })
        company: string;

        @ApiProperty({
          description: "The General Location of the listing.",
          example: "United States"
        })
        geoLocation: string;

        @ApiProperty({
          description: "Indicates if the job is full-time or part-time."
        })
        fullTime: boolean;

        @ApiProperty({
          description: "The job description. Typicaly, a large field."
        })
        description: string;

        @ApiProperty({
          description: "The pay range for the site.",
          example: "$120,000 - $175,000"
        })
        payRange: string;

        @ApiProperty({
            description: "The posted date of the job.",
            example: "2022-07-17"
        })
        postedDate: string;
}

export class JobApiResponse {
    @ApiProperty({
        description: "Indicates the type of success.",
        example: "Record 12345 was successfully updated."
    })
    description: string;

    @ApiProperty({
        description: "The status of the request",
        example: 200
    })
    status: number;
}

export class JobApiRequest {
    @ApiProperty({
        description: "The id for when this job was submitted.",
        example: "12345"
    })
    @IsNotEmpty()
    id: string;

    @ApiProperty({
        description: "The company for when the job was submitted.",
        example: "ACME Corp."
    })
    @IsNotEmpty()
    company: string;

    @ApiProperty({
        description: "The posted date this job was submitted.",
        example: "07-17-2022"
    })
    postedDate: string;
}