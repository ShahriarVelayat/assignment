import {Inject, Injectable} from '@nestjs/common';
import {Job} from "./job.entity";
import {Repository} from "typeorm";
import {Location} from "../location/location.entity";
import {Requirement} from "../requirement/requirement.entity";
import {Company} from "../company/company.entity";
import axios from "axios";
import {Cron, CronExpression} from '@nestjs/schedule';

@Injectable()
export class JobService {

    constructor(
        @Inject(Job)
        private jobRepo: Repository<Job>,
        @Inject(Location)
        private locationRepo: Repository<Location>,
        @Inject(Requirement)
        private requirementRepo: Repository<Requirement>,
        @Inject(Company)
        private companyRepo: Repository<Company>,
    ) {
    }


    @Cron(CronExpression.EVERY_10_SECONDS)
    async fetchDataFromApi1() {
        try {
            const response = await axios.get(
                'https://assignment.devotel.io/api/provider1/jobs',
                {
                    headers: {
                        accept: 'application/json'
                    }
                }
            );

            console.log('Api 1 response =====>\n', response);
        } catch (error) {

        }
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async fetchDataFromApi2() {
        const response = await axios.get(
            'https://assignment.devotel.io/api/provider2/jobs',
            {
                headers: {
                    accept: 'application/json'
                }
            }
        );

        console.log('Api 2 response =====>\n', response);
    }


}
