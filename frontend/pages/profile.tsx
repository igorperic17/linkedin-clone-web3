import Image from "next/image"
import photo from '../public/profile-pic.jpg'
const Profile = () => {
    return (
        <div>
            <div className="flex items-start gap-1 text-left rounded-xl bg-secondary max-w-xl">
                {/* <img src="../public/profile-pic.jpg" /> */}
                <Image src={photo} width={300} height={300} alt="Profile pic" className="rounded-xl rounded-r-none" ></Image>
                <div className="max-w-xs text-lg m-6">
                    <h2 className="text-5xl font-bold mb-4">NATALIA DAVTYAN</h2>
                    <p className="text-sm">Junior frontend developer and code reviewer<br></br>
                    React | JavaScript | HTML | CSS</p>
                </div>
            </div>
            <div>
                <div className="flex items-center my-4 p-3 text-left rounded-xl bg-secondary">
                    <p className="mr-2">Enter DID:</p>
                    <input type="text" className="w-3/4 p-2 rounded-xl rounded-r-none"></input>
                    <button className="px-4 py-2 border bg-primary text-base-100 rounded-xl rounded-l-none">Save</button>
                </div>
                <div className="flex items-center my-4 p-3 text-left rounded-xl bg-secondary">
                    <p className="text-left mr-6">Don't have a DID yet?</p>
                    <a className="px-10 py-2 text-center border bg-primary text-base-100 rounded-xl">Create a DID</a>
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

export default Profile