import { Injectable } from '@nestjs/common';
import { QueryUtil } from '../utils/query.util';
import { GetCompaniesReqDto } from './dto/get-companies.req.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { CompanyDetail, GetCompaniesResDto } from './dto/get-companies.res.dto';

@Injectable()
export class CompanyService {
  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {}

  async getCompanies(body: GetCompaniesReqDto) {
    const query = new QueryUtil(this.companyRepository, {
      search: body.search,
      searchIn: [],
      limit: body.limit,
      pageIndex: body.pageIndex,
      sortBy: body.sortBy,
      order: body.order,
      filter: body
    });
    const result = await query.find();

    let response = new GetCompaniesResDto();

    response.limit = result.limit;
    response.pageIndex = result.pageIndex;
    response.totalItems = result.totalItems;
    response.items = [];

    for (const item of result.items) {
      let temp = new CompanyDetail();
      temp.id = item.id;
      temp.name = item.name;
      temp.industry = item.industry;
      temp.website = item.website;

      response.items.push(temp);
    }
    return response;
  }
}
