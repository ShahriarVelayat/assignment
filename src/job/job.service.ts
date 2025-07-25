import { Injectable } from '@nestjs/common';
import { Employment_type_enum, Job } from './job.entity';
import { Repository } from 'typeorm';
import { Location } from '../location/location.entity';
import { Requirement } from '../requirement/requirement.entity';
import { Company } from '../company/company.entity';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Api1Interafce } from './interfaces/api.interafce';

@Injectable()
export class JobService {
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
      console.error(error);
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
    } catch (error) {
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
          requirements.push(requirement);
        }
      }

      let foundJob = await this.jobRepo.findOne({ where: { source_id: job.jobId } });

      if (!foundJob) {
        let salaryRange = this.parseSalaryRange(job.details.salaryRange);
        foundJob = this.jobRepo.create({
          position: job.title,
          employment_type: this.getJobType(job.details.type.toLowerCase()) || Employment_type_enum.UNKNOWN,
          salary_min: salaryRange?.min,
          salary_max: salaryRange?.max,
          salary_currency: '$',
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

  handleApi2Response(data: Api1Interafce) {}
}
