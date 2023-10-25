import axios from 'axios'
import { Authentication } from 'hooks/client'

const baseApiUrl = process.env.NEXT_PUBLIC_DEVELOPMENT === 'true' ? 'api' : 'https://api.rubentewierik.dev'
const DUMMY_CREDENTIAL = {
  credentialData: {
    credentialSubject: {
      id: 'did:ebsi:2AEMAqXWKYMu1JHPAgGcga4dxu7ThgfgN95VyJBJGZbSJUtp',
      currentAddress: ['1 Boulevard de la Liberté, 59800 Lille'],
      dateOfBirth: '1993-04-08',
      familyName: 'DOE',
      firstName: 'Jane',
      gender: 'FEMALE',
      nameAndFamilyNameAtBirth: 'Jane DOE',
      personalIdentifier: '0904008084H',
      placeOfBirth: 'LILLE, FRANCE',
    },
  },
  type: 'VerifiableId',
}

interface LoginResponse {
  did: string
  token: string
}

export class BackendService {

  async listOwnCredentials(walletAddress: string, auth: Authentication) {
    const token = { auth }
    if (!token) {
      throw new Error('Unable to authorize user ' + walletAddress)
    }

    const response = await axios.get(baseApiUrl + '/credential/list', {
      headers: { Authorization: 'Bearer ' + token },
    })

    return response.data
  }

  async issueCredential(walletAddress: string, credential: object | undefined, auth: Authentication) {
    const token = { auth }
    if (!token) {
      throw 'Unable to authorize user ' + walletAddress
    }

    const payload = credential ?? DUMMY_CREDENTIAL
    const response = await axios.post(
      baseApiUrl + '/credential/issue',
      payload,
      {
        headers: { Authorization: 'Bearer ' + token },
      }
    )

    return response.data
  }

  public static async login(
    walletAddress: string
  ): Promise<LoginResponse> {
    const response = await axios.post(baseApiUrl + '/auth/login', {
      walletAddress,
    })

    return response.data
  }
}
