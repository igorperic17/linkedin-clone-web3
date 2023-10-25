import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserInfoResponse, ListCredentialsResponse, LoginResponse, RequestCredentialIssuanceResponse, InitiateCredentialIssuanceRequest, InitiateCredentialIssuanceResponse, AcceptCredentialIssuanceRequest } from './app.types';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class AppService {

  private readonly apiHost: string
  private readonly apiUrl: string

  constructor(configService: ConfigService) {
    this.apiHost =`${configService.getOrThrow('walletKit.baseUrl')}:${configService.getOrThrow('walletKit.port')}`
    this.apiUrl = `${this.apiHost}/api`
  }

  async login(walletAddress: string): Promise<LoginResponse> {
    // 1. Retrieve the user. NOTE: Also creates the account using wallet address as ID if it does not exist.
    const user = await this.getOrCreateUserAsync(walletAddress)
    const dids = await this.getDidsAsync(user.token);
    if (dids.length > 1) {
      throw new Error('More than one DID registered.');
    }
    // 3. Provide the user's did if available, or create a new one linked to the wallet.
    const did = dids.length > 0 ? dids[0] : await this.createDidAsync(user.token)
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

  async issueCredential(token: string, credential: object): Promise<any> {
    // 1. Resolve token to id (walletAddress) through userInfo.
    const { id } = await this.getUserInfoAsync(token);
    const dids = await this.getDidsAsync(token);
    if (!id || dids.length !== 1) {
      throw new Error('User is not properly registered.');
    }
    // 2. Make issuance request.
    const { oidcUri } = await this.requestCredentialIssuanceAsync(credential)
    // 3. Initiate issuance.
    const { sessionId } = await this.initiateCredentialIssuanceAsync({ token, oidcUri })
    // 4. Accept issuance.
    await this.acceptCredentialIssuance({ token, did: dids[0], sessionId })
  }

  private async getOrCreateUserAsync(walletAddress: string): Promise<UserInfoResponse> {
    const payload = { id: walletAddress }
    const response = await axios.post(`${this.apiUrl}/auth/login`, payload)
    this.validateResponse(response)
    return response.data
  }

  private async getDidsAsync(token: string): Promise<string[]> {
    const options = this.getRequestOptions(token)
    const response = await axios.get(`${this.apiUrl}/wallet/did/list`, options)
    return response.data
  }

  private async getUserInfoAsync(token: string): Promise<UserInfoResponse> {
    const options = this.getRequestOptions(token)
    const response = await axios.get(`${this.apiUrl}/auth/userInfo`, options)
    return response.data
  }

  private async createDidAsync(token: string): Promise<string> {
    const payload = { method: 'key' }
    const options = this.getRequestOptions(token)
    const response = await axios.post(`${this.apiUrl}/wallet/did/create`, payload, options)
    this.validateResponse(response)
    return response.data
  }

  private async requestCredentialIssuanceAsync(credential: object): Promise<RequestCredentialIssuanceResponse> {
    const url = `${this.apiHost}/issuer-api/default/credentials/issuance/request?walletId=x-device&isPreAuthorized=true`
    const payload = {
      credentials: [credential]
    }
    const response = await axios.post(url, payload)
    this.validateResponse(response)
    return {
      oidcUri: response.data
    }
  }

  private async initiateCredentialIssuanceAsync({ token, oidcUri }: InitiateCredentialIssuanceRequest): Promise<InitiateCredentialIssuanceResponse> {
    const url = `${this.apiUrl}/wallet/issuance/startIssuerInitiatedIssuance`
    const payload = { oidcUri }
    const options = this.getRequestOptions(token)
    const response = await axios.post(url, payload, options)
    this.validateResponse(response)
    return { sessionId: response.data }
  }

  private getRequestOptions(token: string): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }

  private async acceptCredentialIssuance({ token, did, sessionId }: AcceptCredentialIssuanceRequest): Promise<void> {
    const url = `${this.apiUrl}/wallet/issuance/continueIssuerInitiatedIssuance?sessionId=${sessionId}&did=${did}`
    const options = this.getRequestOptions(token)
    const response = await axios.get(url, options)
    this.validateResponse(response)
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
