import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetOrCreateUserResponse, ListCredentialsResponse, LoginResponse } from './app.types';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

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

  async listCredentials(token: string): Promise<ListCredentialsResponse> {
    const options = this.getRequestOptions(token)
    const response = await axios.get(`${this.apiUrl}/wallet/credentials/list`, options)
    this.validateResponse(response)
    return response.data
  }

  private async getOrCreateUserAsync(walletAddress: string): Promise<GetOrCreateUserResponse> {
    const payload = {
      id: walletAddress
    }
    const response = await axios.post(`${this.apiUrl}/auth/login`, payload)
    this.validateResponse(response)
    return response.data
  }

  private async createDidAsync(token: string): Promise<string> {
    const payload = {
      method: 'key'
    }
    const options = this.getRequestOptions(token)
    const response = await axios.post(`${this.apiUrl}/wallet/did/create`, payload, options)
    this.validateResponse(response)
    return response.data
  }

  private getRequestOptions(token: string): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }

  private validateResponse(response: AxiosResponse) {
    if (response.status !== 200) {
      throw new Error('Internal Server Error')
    }
  }

  healthCheck(): string {
    return 'Hello World!';
  }
}
