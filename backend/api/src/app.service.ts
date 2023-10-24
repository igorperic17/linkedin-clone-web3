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
    const user = await this.getOrCreateUserAsync(walletAddress)
    // 2. Retrieve the user's did if available, or create a new one linked to the wallet.
    const did = user.did ? user.did : await this.createDidAsync(user.token)
    return {
      did,
      token: user.token
    }
  }

  private async getOrCreateUserAsync(walletAddress: string): Promise<GetOrCreateUserResponse> {
    const payload = {
      id: walletAddress
    }
    const response = await axios.post(`${this.apiUrl}/auth/login`, payload)
    if (response.status !== 200) {
      throw new Error('Internal Server Error')
    }
    return response.data
  }

  private async createDidAsync(token: string): Promise<string> {
    const payload = {
      method: 'key'
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.post(`${this.apiUrl}/wallet/did/create`, payload, config)
    return response.data
  }

  healthCheck(): string {
    return 'Hello World!';
  }
}
