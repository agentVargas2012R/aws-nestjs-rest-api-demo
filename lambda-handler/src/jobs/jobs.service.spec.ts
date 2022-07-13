import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { AppUtil } from '../common/app-util';

describe('JobsService', () => {
  let service: JobsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [JobsService],
//     }).compile();
//
//     service = module.get<JobsService>(JobsService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

    it("should format the PK correctly", () => {
        const test = "Senior Software Developer Engineer";
        const result = AppUtil.getPK(test);
        expect(result).toBe("senior_software_developer_engineer");
    });

});
