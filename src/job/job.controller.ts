import { Controller, Get, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { GetJobsReqDto } from './dto/get-jobs.req.dto';

@Controller('')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('api/job-offers')
  async getJobs(@Query() query: GetJobsReqDto) {
    return await this.jobService.getJobs(query);
  }
}
