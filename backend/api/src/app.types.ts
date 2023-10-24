export interface LoginRequest {
  walletAddress: string
}

export interface CreateDidRequest {
  method: string
}

export interface InitiateCredentialIssuanceRequest {
  token: string
  oidcUri: string
}

export interface AcceptCredentialIssuanceRequest {
  token: string
  did: string
  sessionId: string
}

export interface LoginResponse {
  did: string
  token: string
}

export interface UserInfoResponse {
  id: string | null
  did: string | null
  token: string
}

export interface ListCredentialsResponse {
  list: object[]
}

export interface RequestCredentialIssuanceResponse {
  oidcUri: string
}

export interface InitiateCredentialIssuanceResponse {
  sessionId: string
}