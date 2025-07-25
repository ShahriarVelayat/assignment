import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export class QueryReq {
  @ApiProperty({ description: 'search string', required: false })
  @IsOptional()
  search?: string = '';

  @ApiProperty({ required: false, default: 10, description: 'items per page', example: 10 })
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({ required: false, default: 0, description: 'page number', example: 0 })
  @IsOptional()
  pageIndex?: number = 0;

  @ApiProperty({
    required: false,
    default: 'id',
    description: 'sort by field',
    example: 'id'
  })
  @IsOptional()
  sortBy?: string = 'id';

  @ApiProperty({
    required: false,
    default: SortOrder.DESC,
    description: 'order field',
    example: SortOrder.DESC
  })
  @IsOptional()
  order?: SortOrder = SortOrder.DESC;
}

export interface ArrayResponse {
  items: any[];
  totalItems: number;
  limit: number;
  pageIndex: number;
}
