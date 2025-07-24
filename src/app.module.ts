import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as configs from 'config'

let database_config:any = configs.get('database')
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: database_config.host,
      port: database_config.port,
      username: database_config.username,
      password: database_config.password,
      database: database_config.database,
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
