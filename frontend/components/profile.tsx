import { useWrappedClientContext } from 'contexts/client'
import { ReactElement, useEffect, useState } from 'react'
import {
  CredentialDegree,
  CredentialEmployment,
  CredentialEnum,
  CredentialEvent,
  UserInfo,
} from 'contracts/MyProject.types'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { MyProjectClient } from 'contracts/MyProject.client'
import { NEXT_APP_CONTRACT_ADDRESS } from 'constants/constants'
import Image from 'next/image'
import { BackendService } from 'services/backendService'

interface ReadOnlyProfileSectionProps {
  credentials: CredentialEnum[]
}

interface ProfileHeaderProps {
  walletAddress: string
  requestedProfileWalletAddress: string
  userInfo: UserInfo | undefined
  toggle?: ReactElement
  onSubscribe?: () => void
  setUserInfo?: (userInfo: UserInfo) => void
}

export interface ProfileProps {
  walletAddress: string
  userInfo: UserInfo | undefined
  credentials: CredentialEnum[]
  isUpdatable: boolean
}

interface ListItemProps<T> {
  data: T
}

interface SectionProps<T> {
  state: T[]
}

interface GroupedCredentials {
  employments: CredentialEmployment[]
  degrees: CredentialDegree[]
  events: CredentialEvent[]
}

const groupCredentials = (
  credentials: CredentialEnum[]
): GroupedCredentials => {
  const employments: CredentialEmployment[] = []
  const degrees: CredentialDegree[] = []
  const events: CredentialEvent[] = []

  for (const credential of credentials) {
    if ('Employment' in credential) {
      employments.push(credential.Employment.data)
    }
    if ('Degree' in credential) {
      degrees.push(credential.Degree.data)
    }
    if ('Event' in credential) {
      events.push(credential.Event.data)
    }
  }
  return {
    employments,
    degrees,
    events,
  }
}

const Divider = () => {
  return (
    <hr className="my-2 h-0.5 border-t-0 bg-gray-300 opacity-100 dark:opacity-50" />
  )
}

const EmploymentListItem = ({ data }: ListItemProps<CredentialEmployment>) => {
  return (
    <div className="mb-2">
      <p>{data.institution_name}</p>
      <p>
        {data.start_year}-{data.end_year ?? 'Present'}
      </p>
    </div>
  )
}

const DegreeListItem = ({ data }: ListItemProps<CredentialDegree>) => {
  return (
    <div className="mb-2">
      <p>{data.institution_name}</p>
      <p>{data.year ?? 'N/A'}</p>
    </div>
  )
}

const EventListItem = ({ data }: ListItemProps<CredentialEvent>) => {
  return (
    <div className="mb-2">
      <p>{data.event_name}</p>
      <p>{data.year ?? 'N/A'}</p>
    </div>
  )
}

const EditableProfileHeader = ({
  userInfo,
  toggle,
  setUserInfo,
}: ProfileHeaderProps) => {
  const { contractClient, auth } = useWrappedClientContext()

  const [username, setUsername] = useState<string | undefined>(
    userInfo?.username
  )
  const [bio, setBio] = useState<string | undefined>(userInfo?.bio)

  const onSaveHandler = async () => {
    if (auth) {
      const userInfo = {
        username: username ?? '',
        bio: bio ?? '',
        did: auth.did,
      }
      await contractClient
        ?.register(
          userInfo,
          {
            amount: [],
            gas: '1000000',
          },
          'Registration',
          [{ denom: 'utestcore', amount: '100' }]
        )
        .then((res: any) => {
          console.log('Registered!')
          console.log(res)
        })
      setUserInfo && setUserInfo(userInfo)
    }
  }

  const onUsernameChangeHandler = (e: any) => {
    setUsername(e.target.value)
  }

  const onBioChangeHandler = (e: any) => {
    setBio(e.target.value)
  }

  return (
    <div className="mb-4 p-3 text-left rounded-xl bg-secondary border-solid border-2 border-black">
      <h1 className="font-bold text-3xl">About</h1>
      {toggle}
      <div className="max-w-xs text-lg mt-3 w-[200] h-[200]">
        <div>
          <Image
            src="/person-icon-1682.png"
            alt="Profile icon"
            // width={200}
            // height={200}
            layout="fill"
            // objectFit="contain"
            //   style={{ opacity: '0.1', filter: 'grayscale(100%)' }}
          />
        </div>
        <input
          defaultValue={username}
          className="text-2xl font-bold mb-4 max-w-xs"
          onChange={onUsernameChangeHandler}
        />
        <textarea
          defaultValue={bio}
          className="text-sm"
          onChange={onBioChangeHandler}
        />
      </div>
      <button
        className="text-lg px-2 py-1 text-sm border border-neutral rounded-full text-neutral hover:border-primary hover:bg-primary hover:text-secondary"
        onClick={onSaveHandler}
      >
        Save
      </button>
    </div>
  )
}

const ReadOnlyProfileHeader = ({
  userInfo,
  requestedProfileWalletAddress,
  onSubscribe,
  toggle,
}: ProfileHeaderProps) => {
  if (!userInfo) {
    return <>No user info available!</>
  }
  return (
    <div className="mb-4 p-3 text-left rounded-xl bg-secondary border-solid border-2 border-black">
      <button onClick={onSubscribe}>SUBSCRIBE!</button>
      <h1 className="font-bold text-3xl">
        About {requestedProfileWalletAddress}
      </h1>
      {toggle}
      <div className="max-w-xs text-lg mt-3">
        <h2 className="text-2xl font-bold mb-4 max-w-xs">
          {userInfo.username}
        </h2>
        <p className="text-sm">{userInfo.bio}</p>
      </div>
    </div>
  )
}

const EmploymentSection = ({ state }: SectionProps<CredentialEmployment>) => {
  //   if (state.length === 0) {
  //     return <></>
  //   }
  return (
    <div className="mb-4 p-3 text-left rounded-xl bg-secondary border-solid border-2 border-black">
      <h1 className="font-bold text-3xl mb-2">Employment</h1>
      <div className="mb-2">
        <p>Apple</p>
        <p>2020-2022</p>
      </div>
      <div className="mb-2">
        <p>Microsoft</p>
        <p>2016-2019</p>
      </div>
      <div className="mb-2">
        <p>IKEA</p>
        <p>2014-2015</p>
      </div>
    </div>
  )
}

const DegreeSection = ({ state }: SectionProps<CredentialDegree>) => {
  //   if (state.length === 0) {
  //     return <></>
  //   }
  return (
    <div className="mb-4 p-3 text-left rounded-xl bg-secondary border-solid border-2 border-black">
      <h1 className="font-bold text-3xl mb-2">Education</h1>
      <div className="mb-2">
        <p>Harvard</p>
        <p>2015</p>
      </div>
      <div className="mb-2">
        <p>MIT</p>
        <p>2005</p>
      </div>
    </div>
  )
}

const EventSection = ({ state }: SectionProps<CredentialEvent>) => {
  //   if (state.length === 0) {
  //     return <></>
  //   }
  return (
    <div className="mb-4 p-3 text-left rounded-xl bg-secondary border-solid border-2 border-black">
      <h1 className="font-bold text-4xl mb-2">Events</h1>
      <div className="mb-2">
        <p>EBC9 Hackathon 2023</p>
        <p>2023</p>
      </div>
      <div className="mb-2">
        <p>European Blockchain Convention</p>
        <p>2023</p>
      </div>
    </div>
  )
}

const ReadOnlyProfileSection = ({
  credentials,
}: ReadOnlyProfileSectionProps) => {
  const { employments, degrees, events } = groupCredentials(credentials)
  return (
    <div className="grid grid-cols-2 gap-2 w-3/4">
      <EmploymentSection state={employments} />
      <DegreeSection state={degrees} />
      <EventSection state={events} />
    </div>
  )
}

const fetchUserInfo = async (
  signingClient: SigningCosmWasmClient,
  requestedProfileWalletAddress: string
) => {
  try {
    const response = await signingClient?.queryContractSmart(
      NEXT_APP_CONTRACT_ADDRESS,
      {
        resolve_user_info: {
          address: requestedProfileWalletAddress,
        },
      }
    )
    return response.user_info
  } catch (e) {
    return undefined
  }
}

const fetchCredentials = async (
  contractClient: MyProjectClient,
  requestedProfileWalletAddress: string
): Promise<CredentialEnum[]> => {
  try {
    const response = await contractClient.listCredentials({
      address: requestedProfileWalletAddress,
    })
    return response.credentials
  } catch (e) {
    return []
  }
}

const Profile = () => {
  const {
    requestedProfile,
    walletAddress,
    signingClient,
    contractClient,
    auth,
  } = useWrappedClientContext()
  const { walletAddress: requestedProfileWalletAddress } = requestedProfile
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const [credentials, setCredentials] = useState<CredentialEnum[]>([])
  const [verifiableCredentials, setVerifiableCredentials] = useState<any[]>([])
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const coreumDenom = 'utestcore'
  const onSubscribe = async (targetProfile: string) => {
    if (auth && contractClient) {
      contractClient
        .subscirbe(
          { targetProfile },
          {
            amount: [{ denom: coreumDenom, amount: '100000' }],
            gas: '1000000',
          },
          'issue VC',
          [{ denom: coreumDenom, amount: '100' }]
        )
        .then((res: any) => {
          console.log('SUBSCRIBED!')
          console.log(res)
        })
    }
  }

  useEffect(() => {
    if (requestedProfileWalletAddress && auth) {
      if (signingClient) {
        fetchUserInfo(signingClient, requestedProfileWalletAddress)
          .then((userInfo) => {
            console.log('userInfo', userInfo)
            setUserInfo(userInfo)
          })
          .catch(console.error)
      }
      if (contractClient) {
        fetchCredentials(contractClient, requestedProfileWalletAddress).then(
          (credentials) => {
            console.log(credentials)
            setCredentials(credentials)
          }
        )
        contractClient
          .isSubscribed({
            requesterAddress: walletAddress,
            targetAddress: requestedProfileWalletAddress,
          })
          .then((val) => {
            console.log('sub response')
            console.log(val)
            setIsSubscribed(val.subscribed)
          })
          .catch((e) => console.log(e))
      }

      const backendService = new BackendService()
      if (requestedProfileWalletAddress === walletAddress) {
        backendService.listOwnCredentials(walletAddress, auth).then((vcs) => {
          console.log('Got my credentials!')
          console.log(vcs)
          setVerifiableCredentials(vcs)
        })
      } else {
        backendService
          .listOtherCredentials(
            walletAddress,
            requestedProfileWalletAddress,
            auth
          )
          .then((vcs) => {
            console.log('Got other credentials!')
            console.log(vcs)
            setVerifiableCredentials(vcs)
          })
      }
    }
  }, [signingClient, contractClient, requestedProfileWalletAddress, auth])

  if (!requestedProfileWalletAddress) {
    return <></>
  }

  const isEditable = walletAddress === requestedProfileWalletAddress
  const shouldRenderEditable = isEditable && (isEdit || !userInfo)
  const toggle = (
    <h1 className="text-3xl">
      Edit{' '}
      <input
        type="checkbox"
        className="toggle"
        checked={isEdit}
        onClick={() => setIsEdit(!isEdit)}
      />
    </h1>
  )

  return (
    <div>
      {shouldRenderEditable ? (
        <EditableProfileHeader
          userInfo={userInfo}
          walletAddress={walletAddress}
          requestedProfileWalletAddress={requestedProfileWalletAddress}
          toggle={userInfo ? toggle : undefined}
          setUserInfo={setUserInfo}
        />
      ) : (
        <ReadOnlyProfileHeader
          userInfo={userInfo}
          walletAddress={walletAddress}
          requestedProfileWalletAddress={requestedProfileWalletAddress}
          onSubscribe={() => onSubscribe(requestedProfileWalletAddress)}
          toggle={userInfo ? toggle : undefined}
        />
      )}
      <ReadOnlyProfileSection credentials={credentials} />
    </div>
  )
}

export default Profile
