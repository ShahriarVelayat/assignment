import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { QueryReq } from '../interfaces/query.req';

export class GetJobsReqDto extends QueryReq {
  @ApiProperty({ description: 'min salary filter', example: 10000, required: false })
  @IsOptional()
  @IsNumber()
  salary_min?: string;

  @ApiProperty({ description: 'max salary filter', example: 200000, required: false })
  @IsOptional()
  @IsNumber()
  salary_max?: string;

  @ApiProperty({ description: 'city name', example: 'San Francisco', required: false })
  @IsOptional()
  @IsString()
  location_city?: string;

  @ApiProperty({ description: 'state', example: 'CA', required: false })
  @IsOptional()
  @IsString()
  location_state?: string;
}
