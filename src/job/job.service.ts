import { Injectable } from '@nestjs/common';
import { Job } from './job.entity';
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

      let company = await this.companyRepo.findOne({
        where: {
          name: job.company.name
        }
      });

      if (!company) {
        company = await this.companyRepo.create({ name: job.company.name, industry: job.company.industry });
      }
    }
  }

  handleApi2Response(data: Api1Interafce) {}
}
