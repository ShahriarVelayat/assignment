import { Controller, Get, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { GetCompaniesReqDto } from './dto/get-companies.req.dto';

@Controller('')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get('api/job-companies')
  async getCompanies(@Query() query: GetCompaniesReqDto) {
    return await this.companyService.getCompanies(query);
  }
}
