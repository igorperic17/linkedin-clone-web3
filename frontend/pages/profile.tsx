import Image from "next/image"
import photo from '../public/profile-pic.jpg'
import { useWrappedClientContext } from "contexts/client"

interface ReadOnlyProfileProps {
    walletAddress: string | null
}
interface UpdatableProfileProps {
    walletAddress: string
}

const ReadOnlyProfile = ({ walletAddress }: ReadOnlyProfileProps) => {
    return (
        <div>
            {walletAddress}
            <div className="flex items-start gap-1 text-left rounded-xl bg-secondary max-w-xl">
                {/* <img src="../public/profile-pic.jpg" /> */}
                <Image src={photo} width={300} height={300} alt="Profile pic" className="rounded-xl rounded-r-none" ></Image>
                <div className="max-w-xs text-lg m-6">
                    <h2 className="text-5xl font-bold mb-4">NATALIA DAVTYAN</h2>
                    <p className="text-sm">Junior frontend developer and code reviewer<br></br>
                    React | JavaScript | HTML | CSS</p>
                </div>
            </div>
            <div className="mb-4">
                <div className="mb-4 p-3 text-left rounded-xl bg-secondary">
                    <h3 className="font-bold mb-2">Work Experience</h3>
                    <div className="mb-2">
                        <p>Software engineer at Apple</p>
                        <p>2019-2022</p>
                    </div>
                    <div className="mb-2">
                        <p>Frontend developer at Microsoft</p>
                        <p>2015-2019</p>
                    </div>
                </div>
                <div className="mb-4 p-3 text-left rounded-xl bg-secondary">
                    <h3 className="font-bold mb-2">Education</h3>
                        <p className="text-primary"><a>Request info &#8594;</a></p>
                </div>
                <div className="mb-4 p-3 text-left rounded-xl bg-secondary">
                    <h3 className="font-bold mb-2">Certificates</h3>
                    <div>
                        <p>TOEFL 120</p>
                        <p>2023</p>
                    </div>
                </div>
                <div className="p-3 text-left rounded-xl bg-secondary">
                    <h3 className="font-bold mb-2">Attendance</h3>
                    <div className="mb-2">
                        <p>EBC Hackathon</p>
                        <p>Barcelona, 2023</p>
                    </div>
                    <div>
                        <p>Europian Blockchain Convention</p>
                        <p>Barcelona, 2023</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const UpdatableProfile = ({ walletAddress }: UpdatableProfileProps) => {
    return (
        <div>
            TODO: Implement form update for current user. {walletAddress}
        </div>
    )
}

const Profile = () => {
    const { walletAddress, requestedProfile } = useWrappedClientContext()
    const { walletAddress: requestedProfileWalletAddress } = requestedProfile
    if (walletAddress === requestedProfileWalletAddress) {
        return <UpdatableProfile walletAddress={walletAddress} />
    }
    return <ReadOnlyProfile walletAddress={requestedProfileWalletAddress} />
}

export default Profile