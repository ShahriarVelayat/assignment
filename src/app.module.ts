import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JobModule} from './job/job.module';
import {CompanyModule} from './company/company.module';
import {LocationModule} from './location/location.module';
import {RequirementModule} from './requirement/requirement.module';
import * as configs from 'config'
import {Job} from "./job/job.entity";
import {Company} from './company/company.entity';
import {Requirement} from "./requirement/requirement.entity";
import {Location} from "./location/location.entity";
import {DataSource} from "typeorm";
import {ScheduleModule} from "@nestjs/schedule";

let database_config: any = configs.get('database')

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: database_config.host,
            port: database_config.port,
            username: database_config.username,
            password: database_config.password,
            database: database_config.database,
            entities: [Job, Location, Company, Requirement],
            synchronize: true,
        }),
        JobModule,
        CompanyModule,
        LocationModule,
        RequirementModule,
        ScheduleModule.forRoot()

    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {
    }

}
