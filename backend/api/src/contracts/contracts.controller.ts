import { Controller, Get } from '@nestjs/common';
import { ContractsService } from './services/ContractService';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @Get('/test')
  async test(): Promise<any> {
    return await this.service.test();
  }
}
