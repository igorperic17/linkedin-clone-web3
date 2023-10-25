import axios from 'axios'

const baseApiURL = 'api' // TODO - move to config, use by env
const API_AUTH_KEY = 'ssiwallet-auth-'

export class BackendService {
  async listOwnCredentials(requester: String) {
    const token = await this.getAuth(requester)
    if (!token) {
      throw 'unable to authorize user' + requester
    }

    const response = await axios.get(baseApiURL + '/credential/list', {
      headers: { Authorization: 'Bearer ' + token },
    })

    return response.data
  }

  async issueDummyCredential(requester: String) {
    const token = await this.getAuth(requester)
    if (!token) {
      throw 'unable to authorize user' + requester
    }

    const payload = {
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

    const response = await axios.post(
      baseApiURL + '/credential/issue',
      payload,
      {
        headers: { Authorization: 'Bearer ' + token },
      }
    )

    return response.data
  }

  private async login(
    walletAddress: String
  ): Promise<{ did: string; token: string }> {
    const response = await axios.post(baseApiURL + '/auth/login', {
      walletAddress,
    })

    return response.data
  }

  private async getAuth(walletAddress: String): Promise<string | null> {
    let token = localStorage.getItem(API_AUTH_KEY + walletAddress)
    if (!token) {
      const { token } = await this.login(walletAddress)
      if (token) {
        localStorage.setItem(API_AUTH_KEY + walletAddress, token)
      }
    }

    return token
  }
}
