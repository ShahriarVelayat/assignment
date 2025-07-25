import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Requirement} from "./requirement.entity";
import { RequirementController } from './requirement.controller';
import { RequirementService } from './requirement.service';

@Module({
    imports: [TypeOrmModule.forFeature([Requirement])],
    exports: [TypeOrmModule],
    controllers: [RequirementController],
    providers: [RequirementService]
})
export class RequirementModule {
}
