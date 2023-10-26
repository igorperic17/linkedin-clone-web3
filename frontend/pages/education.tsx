import { useWrappedClientContext } from "contexts/client"
import React, { useState } from "react"
import parseInteger from "utils/parseInteger"

interface IssueEducationCredentialsParameters {
  university: string
  year: string
  firstName: string
  lastName: string
  did: string
}

const getIssueEducationCredentialData = ({
  university,
  year,
  firstName,
  lastName,
  did
}: IssueEducationCredentialsParameters) => {
  return {
    credentialData: {
      credentialSubject: {
        id: did,
        awardingOpportunity: {
          awardingBody: {
            eidasLegalIdentifier: 'Unknown',
            homepage: 'https://leaston.bcdiploma.com/',
            id: 'did:ebsi:2A9BZ9SUe6BatacSpvs1V5CdjHvLpQ7bEsi2Jb6LdHKnQxaN',
            preferredName: university,
            registration: '0597065J'
          },
          endedAtTime: `${parseInteger(year) ?? 2023}-06-26T00:00:00Z`,
          id: 'https://leaston.bcdiploma.com/law-economics-management#AwardingOpportunity',
          identifier: 'https://certificate-demo.bcdiploma.com/check/87ED2F2270E6C41456E94B86B9D9115B4E35BCCAD200A49B846592C14F79C86BV1Fnbllta0NZTnJkR3lDWlRmTDlSRUJEVFZISmNmYzJhUU5sZUJ5Z2FJSHpWbmZZ',
          location: 'FRANCE',
          startedAtTime: '2019-09-02T00:00:00Z'
        },
        dateOfBirth: '1993-04-08',
        familyName: lastName,
        givenNames: firstName,
        gradingScheme: {
          id: 'https://leaston.bcdiploma.com/law-economics-management#GradingScheme',
          title: 'Lower Second-Class Honours'
        },
        identifier: '0904008084H',
        learningAchievement: {
          additionalNote: [
            'DISTRIBUTION MANAGEMENT'
          ],
          description: 'MARKETING AND SALES',
          id: 'https://leaston.bcdiploma.com/law-economics-management#LearningAchievment',
          title: 'MASTERS LAW, ECONOMICS AND MANAGEMENT'
        },
        learningSpecification: {
          ectsCreditPoints: 120,
          eqfLevel: 7,
          id: 'https://leaston.bcdiploma.com/law-economics-management#LearningSpecification',
          iscedfCode: [
            7
          ],
          nqfLevel: [
            7
          ]
        }
      }
    },
    type: 'VerifiableDiploma'
  }
}

const Education = () => {
  const [university, setUniversity] = useState('')
  const [year, setYear] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const { requestedProfile, backendService, auth } = useWrappedClientContext()
  const { walletAddress } = requestedProfile

  const onSaveHandler = async (e: any) => {
    e.preventDefault()
    if (walletAddress && auth) {
      const credential = getIssueEducationCredentialData({ university, year, firstName, lastName, did: auth.did })
      await backendService.issueCredential(walletAddress, credential, auth)
    }
  }

  return (
    <div className="p-8 flex flex-col items-start text-left rounded-xl bg-white w-3/4">
      <div className="mb-10">
        <h2 className="mb-2 text-5xl font-bold">Education</h2>
        <p>Send a request to issue proof of obtained degree at a university</p>
      </div>
      <form className="w-full flex flex-col gap-16">
        <div>
          <div className="flex gap-6">
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2 text-left">First name</label>
              <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" placeholder="Enter the first name of the alumni" className="w-[320px] focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl bg-secondary" />
            </div>
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2 text-left">Last name</label>
              <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" placeholder="Enter the last name of the alumni" className="w-[320px] focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl bg-secondary" />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2 text-left">University</label>
              <select className="w-[320px] focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl bg-secondary" value={university} onChange={(e) => { setUniversity(e.target.value) }}>
                <option value="">Select the university</option>
                <option value="Harvard">Harvard</option>
                <option value="MIT">MIT</option>
              </select>
            </div>
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2">Graduation year</label>
              <input onChange={(e) => setYear(e.target.value)} value={year} type="text" placeholder="Enter the year" className="w-2/5 focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl bg-secondary" />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="border-0 text-base-100 text-xl bg-primary py-4 px-8 rounded-full" onClick={onSaveHandler}>Issue credential</button>
        </div>
      </form>
    </div >
  )
}

export default Education