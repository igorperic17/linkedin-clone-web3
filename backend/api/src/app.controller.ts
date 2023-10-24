import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginRequest, LoginResponse } from './app.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck(): string {
    return this.appService.healthCheck();
  }

  @Post('auth/login')
  async login(@Body() { walletAddress }: LoginRequest): Promise<LoginResponse> {
    return await this.appService.login(walletAddress);
  }

  @Get('credential/list')
  async listCredentials(@Headers('Authorization') auth: string) {
    const token = auth.replace('Bearer ', '');
    return await this.appService.listCredentials(token);
  }
}
