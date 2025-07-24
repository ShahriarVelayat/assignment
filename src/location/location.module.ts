import {Module} from '@nestjs/common';
import {Location} from "./location.entity";
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Location])],
    exports: [TypeOrmModule]
})
export class LocationModule {
}
