import { ArrayResponse } from '../interfaces/query.req';
import { ApiProperty } from '@nestjs/swagger';
import { Employment_type_enum } from '../job.entity';
import { CompanyDetail } from '../../company/dto/get-companies.res.dto';
import { CompanyLocationDetail } from 'src/location/dto/get-locations.res.dto';
import { RequirementDetail } from '../../requirement/dto/get-requirements.res.dto';

export class JobDetail {
  @ApiProperty({ description: 'job id', example: '123' })
  id: number;

  @ApiProperty({ description: 'job title', example: 'Software Engineer' })
  position: string;

  @ApiProperty({ description: 'is a remote job?', example: false })
  remote: boolean;

  @ApiProperty({ description: 'employment type', example: Employment_type_enum.UNKNOWN, enum: Employment_type_enum })
  employment_type: Employment_type_enum;

  @ApiProperty({ description: 'min salary', example: 75000 })
  salary_min: number;

  @ApiProperty({ description: 'max salary', example: 113000 })
  salary_max: number;

  @ApiProperty({ description: 'salary pay in ?', example: 'USD' })
  salary_currency: string;

  @ApiProperty({ description: 'source api', example: 'api-2' })
  source: string;

  @ApiProperty({ description: 'source api id', example: 'job-722' })
  source_id: string;

  @ApiProperty({ description: 'job posted date', example: '2025-07-19' })
  date_posted: Date;

  @ApiProperty({ description: '' })
  company: CompanyDetail;

  @ApiProperty({ description: '' })
  location: CompanyLocationDetail;

  @ApiProperty({ description: '' })
  requirements: RequirementDetail[];
}

export class GetJobsResDto implements ArrayResponse {
  @ApiProperty()
  totalItems: number;

  @ApiProperty({ type: [JobDetail] })
  items: JobDetail[];

  @ApiProperty({ default: 10 })
  limit: number;

  @ApiProperty({ default: 0 })
  pageIndex: number;
}
