import {Injectable} from '@nestjs/common';
import {Job} from "./job.entity";
import {Repository} from "typeorm";
import {Location} from "../location/location.entity";
import {Requirement} from "../requirement/requirement.entity";
import {Company} from "../company/company.entity";
import axios from "axios";
import {Cron, CronExpression} from '@nestjs/schedule';
import {InjectRepository} from "@nestjs/typeorm";

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

            console.log('Api 1 response =====>\n', response.data);
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

        console.log('Api 2 response =====>\n', response.data);
    }


}
