import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Requirement} from "./requirement.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Requirement])],
    exports: [TypeOrmModule]
})
export class RequirementModule {
}
