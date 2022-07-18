export interface Job {
        pk: string;
        name: string;
        company: string;
        geoLocation: string;
        fullTime: boolean;
        state?: string;
        description: string;
        payRange: string;
        postedDate: string;
}
