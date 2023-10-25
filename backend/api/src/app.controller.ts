import { Controller, Get, Post, Body, Headers, Param } from '@nestjs/common';
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
    const token = this.getToken(auth);
    return await this.appService.listCredentials(token);
  }

  @Get('credential/list/:targetWallet')
  async listOtherCredentials(
    @Param('targetWallet') targetWallet: string,
    @Headers('Authorization') auth: string,
  ) {
    const token = this.getToken(auth);
    return await this.appService.listOtherCredentials(token, targetWallet);
  }

  @Post('credential/issue')
  async issueCredential(
    @Headers('Authorization') auth: string,
    @Body() credential: object,
  ) {
    const token = this.getToken(auth);
    await this.appService.issueCredential(token, credential);
  }

  private getToken(auth: string): string {
    return auth.replace('Bearer ', '');
  }
}
