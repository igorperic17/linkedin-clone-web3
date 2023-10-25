import Image from "next/image"
import photo from '../public/profile-pic.jpg'
import { useWrappedClientContext } from "contexts/client"
import { useEffect, useState } from "react"
import { CredentialDegree, CredentialEmployment, CredentialEnum, CredentialEvent, UserInfo } from "contracts/MyProject.types"
import UpdatableProfile from "components/updatableProfile"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { MyProjectClient } from "contracts/MyProject.client"

interface ReadOnlyProfileSectionProps {
    credentials: CredentialEnum[]
}

export interface ProfileProps {
    walletAddress: string
    userInfo: UserInfo
    credentials: CredentialEnum[]
}

interface ListItemProps<T> {
    data: T
  }
  
  const EmploymentListItem = ({ data }: ListItemProps<CredentialEmployment>) => {
    /*
    <div className="mb-2">
          <p>Software engineer at Apple</p>
          <p>2019-2022</p>
        </div>
        <div className="mb-2">
          <p>Frontend developer at Microsoft</p>
          <p>2015-2019</p>
        </div>
        */
    return (
      <div>
  
      </div>
    )
  }
  
  const DegreeListItem = ({ data }: ListItemProps<CredentialDegree>) => {
    return (
      <div>
  
      </div>
    )
  }
  
  const EventListItem = ({ data }: ListItemProps<CredentialEvent>) => {
    /*
    <div>
          <p>TOEFL 120</p>
          <p>2023</p>
        </div>
        <div className="mb-2">
          <p>EBC Hackathon</p>
          <p>Barcelona, 2023</p>
        </div>
        <div>
          <p>Europian Blockchain Convention</p>
          <p>Barcelona, 2023</p>
        </div>
    */
    return (
      <div>
  
      </div>
    )
  }
  
  const UpdatableProfileHeader = () => {
    // This is modifiable
    // TODO: This is hardcoded.
    return (
      <div className="flex items-start gap-1 text-left rounded-xl bg-secondary max-w-xl">
        <div className="max-w-xs text-lg m-6">
          <h2 className="text-5xl font-bold mb-4">NATALIA DAVTYAN</h2>
          <p className="text-sm">Junior frontend developer and code reviewer<br></br>
            React | JavaScript | HTML | CSS</p>
        </div>
      </div>
    )
  }
  
  interface SectionProps<T> {
    state: T[]
  }
  
  const EmploymentSection = ({ state }: SectionProps<CredentialEmployment>) => {
    return (
      < div className="mb-4 p-3 text-left rounded-xl bg-secondary" >
        <h3 className="font-bold mb-2">Work Experience</h3>
        {state.map((value) => (
          <EmploymentListItem data={value} />
        ))}
      </div >
    )
  }
  
  const DegreeSection = ({ state }: SectionProps<CredentialDegree>) => {
    return (
      <div className="mb-4 p-3 text-left rounded-xl bg-secondary">
        <h3 className="font-bold mb-2">Education</h3>
        {state.map((value) => (
          <DegreeListItem data={value} />
        ))}
      </div>
    )
  }
  
  const EventSection = ({ state }: SectionProps<CredentialEvent>) => {
    return (
      <div className="mb-4 p-3 text-left rounded-xl bg-secondary">
        <h3 className="font-bold mb-2">Certificates</h3>
        {state.map((value) => (
          <EventListItem data={value} />
        ))}
      </div>
    )
  }
  
  const UpdatableProfile = ({ walletAddress, userInfo, credentials }: ProfileProps) => {
    const { contractClient } = useWrappedClientContext()
    return (
      <div>
        {walletAddress}
        <UpdatableProfileHeader userInfo={userInfo} />
        <div className="mb-4">
          <EmploymentSection state={workExperienceItems} />
          <DegreeSection state={educationItems} />
          <EventSection state={certificationItems} />
        </div>
      </div>
    )
  }

const ReadOnlyProfileSection = ({ credentials }: ReadOnlyProfileSectionProps) => {
    
    return (
        <div className="mb-4">
          <EmploymentSection state={workExperienceItems} />
          <DegreeSection state={educationItems} />
          <EventSection state={certificationItems} />
        </div>
    )
}

const fetchUserInfo = async (signingClient: SigningCosmWasmClient, requestedProfileWalletAddress: string) => {
    const userInfo = await signingClient?.queryContractSmart(
        'testcore1vhmj54h6dcttmlstnqcwmfxy0cwjh3k05wr852l3a76fgn300s0seefzf2', // TODO: Hardcoded
        {
            resolve_user_info: {
                address: requestedProfileWalletAddress,
            },
        }
    )
    return userInfo
}

const fetchCredentials = async (contractClient: MyProjectClient, requestedProfileWalletAddress: string) => {
    return await contractClient.listCredentials({ address: requestedProfileWalletAddress })
}

const Profile = () => {
    const { requestedProfile, walletAddress, signingClient, contractClient } = useWrappedClientContext()
    const { walletAddress: requestedProfileWalletAddress } = requestedProfile
    const [userInfo, setUserInfo] = useState<UserInfo>()
    const [credentials, setCredentials] = useState<CredentialEnum[]>([])

    contractClient?.listCredentials
    useEffect(() => {
        if (requestedProfileWalletAddress) {
            if (signingClient) {
                fetchUserInfo(signingClient, requestedProfileWalletAddress)
                    .then((userInfo) => {
                        console.log(userInfo)
                        setUserInfo(userInfo)
                    })
                    .catch(console.error)
            }
            if (contractClient) {
                // TODO: his might throw an error for any user that is not us.
                fetchCredentials(contractClient, requestedProfileWalletAddress)
                    .then((response) => {
                        console.log(response)
                        setCredentials(response.credentials)
                    })
            }
        }
    }, [signingClient, requestedProfileWalletAddress])

    if (walletAddress === requestedProfileWalletAddress) {
        return <UpdatableProfile
            walletAddress={requestedProfileWalletAddress}
            userInfo={userInfo}
            credentials={credentials}
        />
    }
    return <ReadOnlyProfileSection 
        walletAddress={requestedProfileWalletAddress}
        userInfo={userInfo}
        credentials={credentials}
    />
}

export default Profile