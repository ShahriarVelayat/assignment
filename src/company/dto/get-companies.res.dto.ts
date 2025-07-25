import { ApiProperty } from '@nestjs/swagger';
import { ArrayResponse } from '../../job/interfaces/query.req';

export class CompanyDetail {
  @ApiProperty({ description: '' })
  id: number;
  @ApiProperty({ description: '' })
  name: string;
  @ApiProperty({ description: '' })
  website: string;
  @ApiProperty({ description: '' })
  industry: string;
}

export class GetCompaniesResDto implements ArrayResponse {
  @ApiProperty()
  totalItems: number;

  @ApiProperty({ type: [CompanyDetail] })
  items: CompanyDetail[];

  @ApiProperty({ default: 10 })
  limit: number;

  @ApiProperty({ default: 0 })
  pageIndex: number;
}
