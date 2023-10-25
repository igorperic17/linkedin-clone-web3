import { useWrappedClientContext } from "contexts/client"
import { ReactElement, useEffect, useState } from "react"
import { CredentialDegree, CredentialEmployment, CredentialEnum, CredentialEvent, UserInfo } from "contracts/MyProject.types"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { MyProjectClient } from "contracts/MyProject.client"

interface ReadOnlyProfileSectionProps {
    credentials: CredentialEnum[]
}

interface ProfileHeaderProps {
    walletAddress: string
    userInfo: UserInfo | undefined
    toggle: ReactElement
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

const Divider = () => {
    return (
        <hr className="my-2 h-0.5 border-t-0 bg-gray-300 opacity-100 dark:opacity-50" />
    )
}

const EmploymentListItem = ({ data }: ListItemProps<CredentialEmployment>) => {
    return (
        <div className="mb-2">
            <p>{data.institution_name}</p>
            <p>{data.start_year}-{data.end_year ?? 'Present'}</p>
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

const UpdatableProfileHeader = ({ userInfo, toggle }: ProfileHeaderProps) => {
    const { contractClient, auth } = useWrappedClientContext()

    const [username, setUsername] = useState<string | undefined>(userInfo?.username)
    const [bio, setBio] = useState<string | undefined>(userInfo?.bio)

    const onSaveHandler = async () => {
        if (auth) {
            await contractClient
                ?.register(
                    { username: username ?? '', bio: bio ?? '', did: auth.did },
                    {
                        amount: [], //{ denom: 'utestcore', amount: '100000000000000000000000000' }
                        gas: '1000000',
                    },
                    'Registration',
                    [{ denom: 'utestcore', amount: '100' }]
                )
                .then((res: any) => {
                    console.log('Registered!')
                    console.log(res)
                })
        }
    }

    const onUsernameChangeHandler = (e: any) => {
        setUsername(e.target.value)
    }

    const onBioChangeHandler = (e: any) => {
        setBio(e.target.value)
    }

    if (!userInfo) {
        return (<>No user info available!</>)
    }
    return (
        <div className="mb-4 p-3 text-left rounded-xl bg-secondary border-solid border-2 border-black">
            <h1 className="font-bold text-3xl">About</h1>
            {toggle}
            <div className="max-w-xs text-lg mt-3">
                <input defaultValue={username} className="text-4xl font-bold mb-4 max-w-xs" onChange={onUsernameChangeHandler} />
                <textarea defaultValue={bio} className="text-sm" onChange={onBioChangeHandler} />
            </div>
            <button className="text-lg px-2 py-1 text-sm border border-neutral rounded-full text-neutral hover:border-primary hover:bg-primary hover:text-secondary" onClick={onSaveHandler}>Save</button>
        </div>
    )
}

const ReadOnlyProfileHeader = ({ userInfo, toggle }: ProfileHeaderProps) => {
    if (!userInfo) {
        return (<>No user info available!</>)
    }
    return (
        <div className="mb-4 p-3 text-left rounded-xl bg-secondary border-solid border-2 border-black">
            <h1 className="font-bold text-3xl">About</h1>
            {toggle}
            <div className="max-w-xs text-lg mt-3">
                <h2 className="text-4xl font-bold mb-4 max-w-xs">{userInfo.username}</h2>
                <p className="text-sm">{userInfo.bio}</p>
            </div>
        </div>
    )
}

const EmploymentSection = ({ state }: SectionProps<CredentialEmployment>) => {
    if (state.length === 0) {
        return <></>
    }
    return (
        <div className="mb-4 p-3 text-left rounded-xl bg-secondary border-solid border-2 border-black">
            <h1 className="font-bold text-3xl mb-2">Work Experience</h1>
            {state.sort((a, b) => (b.end_year ?? (99999 + (b.start_year ?? 0))) - (a.end_year ?? (99999 + (a.start_year ?? 0)))).map((value, index) => (
                <>
                    <EmploymentListItem data={value} key={index} />
                    {index < state.length - 1 && <Divider />}
                </>
            ))}
        </div >
    )
}

const DegreeSection = ({ state }: SectionProps<CredentialDegree>) => {
    if (state.length === 0) {
        return <></>
    }
    return (
        <div className="mb-4 p-3 text-left rounded-xl bg-secondary border-solid border-2 border-black">
            <h1 className="font-bold text-3xl mb-2">Education</h1>
            {state.sort((a, b) => b.year - a.year).map((value, index) => (
                <>
                    <DegreeListItem data={value} key={index} />
                    {index < state.length - 1 && <Divider />}
                </>
            ))}
        </div>
    )
}

const EventSection = ({ state }: SectionProps<CredentialEvent>) => {
    if (state.length === 0) {
        return <></>
    }
    return (
<<<<<<< Updated upstream
        <div className="mb-4 p-3 text-left rounded-xl bg-secondary border-solid border-2 border-black">
            <h1 className="font-bold text-4xl mb-2">Certificates</h1>
            {state.sort((a, b) => (b.year ?? 0) - (a.year ?? 0)).map((value, index) => (
                <>
                    <EventListItem data={value} key={index} />
                    {index < state.length - 1 && <Divider />}
                </>
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
    const { requestedProfile, walletAddress, signingClient, contractClient, auth } = useWrappedClientContext()
    const { walletAddress: requestedProfileWalletAddress } = requestedProfile
    const [userInfo, setUserInfo] = useState<UserInfo>()
    const [credentials, setCredentials] = useState<CredentialEnum[]>([])
    const [isEdit, setIsEdit] = useState<boolean>(false)

    useEffect(() => {
        if (requestedProfileWalletAddress && auth) {
            if (signingClient) {
                fetchUserInfo(signingClient, requestedProfileWalletAddress)
                    .then((userInfo) => {
                        console.log(userInfo)
                        setUserInfo(userInfo)
                    })
                    .catch(console.error)
            }
            if (contractClient) {
                fetchCredentials(contractClient, requestedProfileWalletAddress)
                    .then((response) => {
                        console.log(response)
                        setCredentials(response.credentials)
                    })
            }
        }
    }, [signingClient, contractClient, requestedProfileWalletAddress, auth])

    if (!requestedProfileWalletAddress) {
        return (<></>)
    }

    const isEditable = walletAddress === requestedProfileWalletAddress
    const shouldRenderEditable = isEditable && isEdit

    const toggle = (
        <h1 className='text-3xl'>Edit <input type="checkbox" className="toggle" checked={isEdit} onClick={() => setIsEdit(!isEdit)} /></h1>
    )

    return (
        <div>
            {shouldRenderEditable
                ? (<UpdatableProfileHeader userInfo={userInfo} walletAddress={walletAddress} toggle={toggle} />)
                : (<ReadOnlyProfileHeader userInfo={userInfo} walletAddress={walletAddress} toggle={toggle} />)}
            <ReadOnlyProfileSection credentials={credentials} />
        </div>
    )
}

export default Profile