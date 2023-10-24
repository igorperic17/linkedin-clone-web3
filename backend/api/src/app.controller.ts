import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
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
}
