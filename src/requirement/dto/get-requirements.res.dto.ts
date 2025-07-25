import { ArrayResponse } from '../../job/interfaces/query.req';
import { ApiProperty } from '@nestjs/swagger';

export class RequirementDetail {
  @ApiProperty({ description: '' })
  id: number;
  @ApiProperty({ description: '' })
  name: string;
  @ApiProperty({ description: '' })
  experience_level: number;
}

export class GetRequirementsResDto implements ArrayResponse {
  @ApiProperty()
  totalItems: number;

  @ApiProperty({ type: [RequirementDetail] })
  items: RequirementDetail[];

  @ApiProperty({ default: 10 })
  limit: number;

  @ApiProperty({ default: 0 })
  pageIndex: number;
}
