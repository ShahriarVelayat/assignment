import { ApiProperty } from '@nestjs/swagger';
import { ArrayResponse } from '../../job/interfaces/query.req';

export class CompanyLocationDetail {
  @ApiProperty({ description: '' })
  id: number;
  @ApiProperty({ description: '' })
  city: string;
  @ApiProperty({ description: '' })
  state: string;
  @ApiProperty({ description: '' })
  country: string;
}

export class GetLocationsResDto implements ArrayResponse {
  @ApiProperty()
  totalItems: number;

  @ApiProperty({ type: [CompanyLocationDetail] })
  items: CompanyLocationDetail[];

  @ApiProperty({ default: 10 })
  limit: number;

  @ApiProperty({ default: 0 })
  pageIndex: number;
}
