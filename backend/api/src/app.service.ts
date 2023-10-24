import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetOrCreateUserResponse, LoginResponse } from './app.types';
import axios from 'axios';

@Injectable()
export class AppService {

  private readonly apiUrl: string

  constructor(configService: ConfigService) {
    this.apiUrl = `${configService.getOrThrow('walletKit.baseUrl')}:${configService.getOrThrow('walletKit.port')}/api`
  }

  async login(walletAddress: string): Promise<LoginResponse> {
    // 1. Retrieve the user. NOTE: Also creates the account using wallet address as ID if it does not exist.
    const user = await this.getOrCreateUser(walletAddress)
    return null as any
  }

  private async getOrCreateUser(walletAddress: string): Promise<GetOrCreateUserResponse> {
    const payload = {
      id: walletAddress
    }
    const response = await axios.post(`${this.apiUrl}/auth/login`, payload)
    if (response.status !== 200) {
      throw new Error('Internal Server Error')
    }
    const x = response.data // TODO
    console.log(JSON.stringify(x))
    return x
  }

  healthCheck(): string {
    return 'Hello World!';
  }
}
