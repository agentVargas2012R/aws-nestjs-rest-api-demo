import {ApiProperty} from '@nestjs/swagger';

export class Job {

      @ApiProperty({
          description: 'The id of the job.',
          example: '3bccafbb-61e1-4f21-86b0-081f482c4ae1'
        })
        id: string;

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
        description: "The record id for the request",
        example: "12345"
    })
    id: string;
}