import { useWrappedClientContext } from "contexts/client"
import { useEffect, useState } from "react"
import { CredentialDegree, CredentialEmployment, CredentialEnum, CredentialEvent, UserInfo } from "contracts/MyProject.types"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { MyProjectClient } from "contracts/MyProject.client"

interface ReadOnlyProfileSectionProps {
    credentials: CredentialEnum[]
}

interface ProfileHeaderProps {
    walletAddress: string
    userInfo: UserInfo | undefined
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

const groupCredentials = (credentials: CredentialEnum[]): GroupedCredentials => {
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
        events
    }
}

const EmploymentListItem = ({ data }: ListItemProps<CredentialEmployment>) => {
    return (
        <div className="mb-2">
            <p>{data.institution_name}</p>
            <p>{data.start_year}-{data.end_year}</p>
        </div>
    )
}

const DegreeListItem = ({ data }: ListItemProps<CredentialDegree>) => {
    return (
        <div className="mb-2">
            <p>{data.institution_name}</p>
            <p>{data.year}</p>
        </div>
    )
}

const EventListItem = ({ data }: ListItemProps<CredentialEvent>) => {
    return (
        <div className="mb-2">
            <p>{data.event_name}</p>
            <p>{data.year}</p>
        </div>
    )
}

const UpdatableProfileHeader = ({ userInfo }: ProfileHeaderProps) => {
    const { contractClient } = useWrappedClientContext()

    const [username, setUsername] = useState<string | undefined>(userInfo?.username)
    const [bio, setBio] = useState<string | undefined>(userInfo?.bio)

    const onUsernameChangeHandler = (e: any) => {
        setUsername(e.target.value)
    }

    const onBioChangeHandler = (e: any) => {
        setBio(e.target.value)
    }

    const onSavehandler = async () => {
        // TODO: Update public profile data on chain.
    }

    if (!userInfo) {
        return (<>No user info available!</>)
    }
    return (
        <div className="flex items-start gap-1 text-left rounded-xl bg-secondary max-w-xl">
            <div className="max-w-xs text-lg m-6">
                <input defaultValue={username} className="text-5xl font-bold mb-4" onChange={onUsernameChangeHandler} />
                <input defaultValue={bio} className="text-sm" onChange={onBioChangeHandler} />
            </div>
            <button onClick={onSavehandler}>Save</button>
        </div>
    )
}

const ReadOnlyProfileHeader = ({ userInfo }: ProfileHeaderProps) => {
    if (!userInfo) {
        return (<>No user info available!</>)
    }
    return (
        <div className="flex items-start gap-1 text-left rounded-xl bg-secondary max-w-xl">
            <div className="max-w-xs text-lg m-6">
                <h2 className="text-5xl font-bold mb-4">{userInfo.username}</h2>
                <p className="text-sm">{userInfo.bio}</p>
            </div>
        </div>
    )
}

const EmploymentSection = ({ state }: SectionProps<CredentialEmployment>) => {
    return (
        <div className="mb-4 p-3 text-left rounded-xl bg-secondary" >
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

const ReadOnlyProfileSection = ({ credentials }: ReadOnlyProfileSectionProps) => {
    const {
        employments,
        degrees,
        events
    } = groupCredentials(credentials)
    return (
        <div className="mb-4">
            <EmploymentSection state={employments} />
            <DegreeSection state={degrees} />
            <EventSection state={events} />
        </div>
    )
}

const fetchUserInfo = async (signingClient: SigningCosmWasmClient, requestedProfileWalletAddress: string) => {
    try {
        const userInfo = await signingClient?.queryContractSmart(
            'testcore1vhmj54h6dcttmlstnqcwmfxy0cwjh3k05wr852l3a76fgn300s0seefzf2', // TODO: Hardcoded
            {
                resolve_user_info: {
                    address: requestedProfileWalletAddress,
                },
            }
        )
        return userInfo
    } catch (e) {
        return undefined
    }
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

    if (!requestedProfileWalletAddress) {
        return (<></>)
    }

    const isUpdatable = walletAddress === requestedProfileWalletAddress

    return (
        <div>
            {walletAddress}
            {isUpdatable
                ? (<UpdatableProfileHeader userInfo={userInfo} walletAddress={walletAddress} />)
                : (<ReadOnlyProfileHeader userInfo={userInfo} walletAddress={walletAddress} />)}
            <ReadOnlyProfileSection credentials={credentials} />
        </div>
    )
}

export default Profile