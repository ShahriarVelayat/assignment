import { Injectable } from '@nestjs/common';
import { QueryUtil } from '../utils/query.util';
import { GetLocationsReqDto } from './dto/get-locations.req.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { CompanyLocationDetail, GetLocationsResDto } from './dto/get-locations.res.dto';

@Injectable()
export class LocationService {
  constructor(@InjectRepository(Location) private locationRepository: Repository<Location>) {}

  async getLocations(body: GetLocationsReqDto) {
    const query = new QueryUtil(this.locationRepository, {
      search: body.search,
      searchIn: [],
      limit: body.limit,
      pageIndex: body.pageIndex,
      sortBy: body.sortBy,
      order: body.order,
      filter: body
    });
    const result = await query.find();

    let response = new GetLocationsResDto();

    response.limit = result.limit;
    response.pageIndex = result.pageIndex;
    response.totalItems = result.totalItems;
    response.items = [];

    for (const item of result.items) {
      let temp = new CompanyLocationDetail();
      temp.id = item.id;
      temp.city = item.city;
      temp.state = item.state;
      temp.country = item.country;

      response.items.push(temp);
    }
    return response;
  }
}
