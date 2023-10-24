import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './configuration/configuration';
import { ContractsController } from './contracts/contracts.controller';
import { ContractsModule } from './contracts/contracts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ContractsModule
  ],
  controllers: [AppController, ContractsController],
  providers: [AppService],
})
export class AppModule {}
