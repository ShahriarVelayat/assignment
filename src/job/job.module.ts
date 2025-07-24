import {Module} from '@nestjs/common';
import {JobController} from './job.controller';
import {JobService} from './job.service';
import {Job} from "./job.entity";
import {Location} from "../location/location.entity";
import {Company} from "../company/company.entity";
import {Requirement} from "../requirement/requirement.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Job, Location, Company, Requirement])],
    controllers: [JobController],
    providers: [JobService],
    exports: [TypeOrmModule, JobService],
})
export class JobModule {
}
