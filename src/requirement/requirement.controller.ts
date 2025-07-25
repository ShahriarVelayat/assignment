import { Controller, Get, Query } from '@nestjs/common';
import { GetRequirementsReqDto } from './dto/get-requirements.req.dto';
import { RequirementService } from './requirement.service';

@Controller()
export class RequirementController {
  constructor(private requirementService: RequirementService) {}

  @Get('api/job-requirements')
  async getRequirements(@Query() query: GetRequirementsReqDto) {
    return await this.requirementService.getRequirements(query);
  }
}
