import {Module} from '@nestjs/common';
import {Location} from "./location.entity";
import {TypeOrmModule} from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
    imports: [TypeOrmModule.forFeature([Location])],
    exports: [TypeOrmModule],
    controllers: [LocationController],
    providers: [LocationService]
})
export class LocationModule {
}
