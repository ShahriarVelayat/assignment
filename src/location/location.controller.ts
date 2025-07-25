import { Controller, Get, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { GetLocationsReqDto } from './dto/get-locations.req.dto';

@Controller('')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('api/job-locations')
  async getLocations(@Query() query: GetLocationsReqDto) {
    return await this.locationService.getLocations(query);
  }
}
