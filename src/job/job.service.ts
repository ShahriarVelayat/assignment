import { Injectable } from '@nestjs/common';
import { Employment_type_enum, Job } from './job.entity';
import { Repository } from 'typeorm';
import { Location } from '../location/location.entity';
import { Requirement } from '../requirement/requirement.entity';
import { Company } from '../company/company.entity';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Api1Interafce, Api2Interafce } from './interfaces/api.interafce';
import { GetJobsReqDto } from './dto/get-jobs.req.dto';
import { QueryUtil } from '../utils/query.util';
import { GetJobsResDto, JobDetail } from './dto/get-jobs.res.dto';

@Injectable()
export class JobService {
  async;

  constructor(
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
    @InjectRepository(Requirement)
    private requirementRepo: Repository<Requirement>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async fetchDataFromApi1() {
    try {
      console.log('=== Fetching data from Api1 ===');
      const response = await axios.get('https://assignment.devotel.io/api/provider1/jobs', {
        headers: {
          accept: 'application/json'
        }
      });
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      await this.handleApi1Response(response.data);
    } catch (error) {
      // console.error(error);
      console.trace(error);
      throw new Error('Error fetching data from API 1', error.message);
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async fetchDataFromApi2() {
    console.log('=== Fetching data from Api2 ===');

    try {
      const response = await axios.get('https://assignment.devotel.io/api/provider2/jobs', {
        headers: {
          accept: 'application/json'
        }
      });
      if (response.status !== 200 || response.data?.status !== 'success') {
        throw new Error(response.statusText);
      }
      await this.handleApi2Response(response.data);
    } catch (error) {
      // console.error(error);
      console.trace(error);
      throw new Error('Error fetching data from API 2', error.message);
    }
  }

  async handleApi1Response(data: Api1Interafce) {
    if (data.jobs.length === 0) {
      throw new Error('Job not found');
    }

    for (const job of data.jobs) {
      let company = await this.companyRepo.findOne({
        where: {
          name: job.company.name
        }
      });

      if (!company) {
        company = await this.companyRepo.create({ name: job.company.name, industry: job.company.industry });
      }

      let [city, state] = job.details.location.split(',').map(part => part.trim());

      let location = await this.locationRepo.findOne({
        where: {
          city,
          state
        }
      });

      if (!location) {
        location = this.locationRepo.create({ city, state, country: 'US' });
        await this.locationRepo.save(location);
      }

      let requirements: any = [];
      for (const skill of job.skills) {
        let requirement = await this.requirementRepo.findOne({
          where: {
            name: skill
          }
        });

        if (!requirement) {
          requirement = this.requirementRepo.create({ name: skill });
          await this.requirementRepo.save(requirement);
        }
        requirements.push(requirement);
      }

      let foundJob = await this.jobRepo.findOne({ where: { source_id: job.jobId } });

      if (!foundJob) {
        let salaryRange = this.parseSalaryRange(job.details.salaryRange);
        foundJob = this.jobRepo.create({
          position: job.title,
          employment_type: this.getJobType(job.details.type.toLowerCase()) || Employment_type_enum.UNKNOWN,
          salary_min: salaryRange?.min,
          salary_max: salaryRange?.max,
          salary_currency: 'USD',
          source: 'api-1',
          source_id: job.jobId,
          date_posted: new Date(job.postedDate),
          company: company,
          location: location,
          requirements: requirements
        });

        await this.jobRepo.save(foundJob);
      }
    }
  }

  parseSalaryRange(salaryStr) {
    const match = salaryStr.match(/\$([\d,.]+)k\s*-\s*\$([\d,.]+)k/i);

    if (!match) return null;

    const min = parseFloat(match[1].replace(/,/g, '')) * 1000;
    const max = parseFloat(match[2].replace(/,/g, '')) * 1000;

    return { min, max };
  }

  getJobType(value: string): Employment_type_enum | undefined {
    return Object.values(Employment_type_enum).find(type => type === value);
  }

  async handleApi2Response(response: Api2Interafce) {
    let data = response.data;
    if (!data.jobsList) {
      throw new Error('Job not found');
    }

    for (const jobKey of Object.keys(data.jobsList)) {
      let job = data.jobsList[jobKey];
      let company = await this.companyRepo.findOne({
        where: {
          name: job.employer.companyName
        }
      });

      if (!company) {
        company = await this.companyRepo.create({ name: job.employer.companyName, website: job.employer.website });
      }

      let location = await this.locationRepo.findOne({
        where: {
          city: job.location.city,
          state: job.location.state
        }
      });

      if (!location) {
        location = this.locationRepo.create({
          city: job.location.city,
          state: job.location.state,
          country: 'US'
        });
        await this.locationRepo.save(location);
      }

      let requirements: any = [];
      for (const skill of job.requirements.technologies) {
        let requirement = await this.requirementRepo.findOne({
          where: {
            name: skill,
            experience_level: job.requirements.experience
          }
        });

        if (!requirement) {
          requirement = this.requirementRepo.create({ name: skill, experience_level: job.requirements.experience });
          await this.requirementRepo.save(requirement);
        }
        requirements.push(requirement);
      }

      let foundJob = await this.jobRepo.findOne({ where: { source_id: jobKey } });

      if (!foundJob) {
        foundJob = this.jobRepo.create({
          position: job.position,
          remote: job.location.remote,
          employment_type: Employment_type_enum.UNKNOWN,
          salary_min: job.compensation?.min,
          salary_max: job.compensation?.max,
          salary_currency: job.compensation.currency,
          source: 'api-2',
          source_id: jobKey,
          date_posted: new Date(job.datePosted),
          company: company,
          location: location,
          requirements: requirements
        });

        await this.jobRepo.save(foundJob);
      }
    }
  }

  async getJobs(body: GetJobsReqDto) {
    const query = new QueryUtil(this.jobRepo, {
      search: body.search,
      searchIn: ['position'],
      limit: body.limit,
      pageIndex: body.pageIndex,
      sortBy: body.sortBy,
      order: body.order,
      filter: body
    });
    const result = await query.find();

    let response = new GetJobsResDto();

    response.limit = result.limit;
    response.pageIndex = result.pageIndex;
    response.totalItems = result.totalItems;
    response.items = [];

    for (const item of result.items) {
      let temp = new JobDetail();
      temp.id = item.id;
      temp.position = item.position;
      temp.remote = item.remote;
      temp.employment_type = item.employment_type;
      temp.salary_min = item.salary_min;
      temp.salary_max = item.salary_max;
      temp.salary_currency = item.salary_currency;
      temp.source = item.source;
      temp.source_id = item.source_id;
      temp.date_posted = item.date_posted;
      temp.company = item.company;
      temp.location = item.location;
      temp.requirements = item.requirements;

      response.items.push(temp);
    }

    // console.log(result);
    return response;
  }
}
