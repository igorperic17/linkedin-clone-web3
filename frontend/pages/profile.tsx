import Image from "next/image"
import photo from '../public/profile-pic.jpg'
const Profile = () => {
    return (
        <div>
            <div className="flex justify-around items-center gap-5  text-left">
                {/* <img src="../public/profile-pic.jpg" /> */}
                    <Image src={photo} width={300} height={300} alt="Profile pic" className="rounded-xl" ></Image>
                <div className="max-w-xs text-lg">
                    <h2 className="text-5xl font-normal">NATALIA DAVTYAN</h2>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
                </div>
            </div>
            <div>
                <div className="flex gap-2 my-5 text-lg">
                    <p>Enter DID:</p>
                    <input type="text" className="w-3/4"></input>
                </div>
                <div>
                    <p className="text-left">
                        Do not have a DID yet? Create one <a>here</a>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Profile