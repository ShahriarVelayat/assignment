import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Requirement } from './requirement.entity';
import { GetRequirementsReqDto } from './dto/get-requirements.req.dto';
import { QueryUtil } from '../utils/query.util';
import { GetRequirementsResDto, RequirementDetail } from './dto/get-requirements.res.dto';

@Injectable()
export class RequirementService {
  constructor(@InjectRepository(Requirement) private requirementRepository: Repository<Requirement>) {}

  async getRequirements(body: GetRequirementsReqDto) {
    const query = new QueryUtil(this.requirementRepository, {
      search: body.search,
      searchIn: [],
      limit: body.limit,
      pageIndex: body.pageIndex,
      sortBy: body.sortBy,
      order: body.order,
      filter: body
    });
    const result = await query.find();

    let response = new GetRequirementsResDto();

    response.limit = result.limit;
    response.pageIndex = result.pageIndex;
    response.totalItems = result.totalItems;
    response.items = [];

    for (const item of result.items) {
      let temp = new RequirementDetail();
      temp.id = item.id;
      temp.experience_level = item.experience_level;
      temp.name = item.name;

      response.items.push(temp);
    }
    return response;
  }
}
