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
          awardingOpportunity: {
            awardingBody: {
              eidasLegalIdentifier: 'Unknown',
              homepage: 'https://leaston.bcdiploma.com/',
              id: 'did:ebsi:2A9BZ9SUe6BatacSpvs1V5CdjHvLpQ7bEsi2Jb6LdHKnQxaN',
              preferredName: 'Leaston University',
              registration: '0597065J',
            },
            endedAtTime: '2020-06-26T00:00:00Z',
            id: 'https://leaston.bcdiploma.com/law-economics-management#AwardingOpportunity',
            identifier:
              'https://certificate-demo.bcdiploma.com/check/87ED2F2270E6C41456E94B86B9D9115B4E35BCCAD200A49B846592C14F79C86BV1Fnbllta0NZTnJkR3lDWlRmTDlSRUJEVFZISmNmYzJhUU5sZUJ5Z2FJSHpWbmZZ',
            location: 'FRANCE',
            startedAtTime: '2019-09-02T00:00:00Z',
          },
          dateOfBirth: '1993-04-08',
          familyName: 'DOE',
          givenNames: 'Jane',
          gradingScheme: {
            id: 'https://leaston.bcdiploma.com/law-economics-management#GradingScheme',
            title: 'Lower Second-Class Honours',
          },
          identifier: '0904008084H',
          learningAchievement: {
            additionalNote: ['DISTRIBUTION MANAGEMENT'],
            description: 'MARKETING AND SALES',
            id: 'https://leaston.bcdiploma.com/law-economics-management#LearningAchievment',
            title: 'MASTERS LAW, ECONOMICS AND MANAGEMENT',
          },
          learningSpecification: {
            ectsCreditPoints: 120,
            eqfLevel: 7,
            id: 'https://leaston.bcdiploma.com/law-economics-management#LearningSpecification',
            iscedfCode: ['7'],
            nqfLevel: ['7'],
          },
        },
      },
      type: 'VerifiableDiploma',
    }

    try {
      const response = await axios.post(
        baseApiURL + '/credential/issue',
        payload,
        {
          headers: { Authorization: 'Bearer ' + token },
        }
      )

      return response.data
    } catch {
      console.log('removing')
      localStorage.removeItem(API_AUTH_KEY + requester)
    }
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
    // TODO - implement proper logic, for now lets just query the
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
