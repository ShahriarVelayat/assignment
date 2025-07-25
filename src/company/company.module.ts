import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Company} from "./company.entity";
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
    imports: [TypeOrmModule.forFeature([Company])],
    exports: [TypeOrmModule],
    controllers: [CompanyController],
    providers: [CompanyService]
})
export class CompanyModule {
}
