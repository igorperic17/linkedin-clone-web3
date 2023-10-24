export interface LoginRequest {
  walletAddress: string
}

export interface LoginResponse {
  did: string
  token: string
}

export interface GetOrCreateUserResponse {
  did: string | null
  token: string
}