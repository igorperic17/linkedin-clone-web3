import React, { useState } from "react"
import logo from '../public/European-Blockchain-Convention-Web-Logo.png'
import Image from "next/image"
import { useWrappedClientContext } from "contexts/client"

const Hackathon = () => {
  const [event, setEvent] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const { requestedProfile } = useWrappedClientContext()
  const { walletAddress } = requestedProfile

  return (
    <div className="flex flex-col w-3/4 items-center pb-24 pt-8">
      <div className="flex pb-12">
        <Image width={500} height={200} alt="logo" src={logo}></Image>
        <h1 className="p-8 flex items-center text-4xl" >EBC HACKATON 2023</h1>
      </div>
      <div className="flex items-center py-4">
        <label className="pr-12 w-48">
          Type of the event
        </label>
        <select className="p-2 w-64 text-black" value={event} onChange={(e) => setEvent(e.target.value)}>
          <option value="Convention">Convention</option>
          <option value="Hackaton">Hackathon</option>
        </select>
      </div>
      <div className="flex items-center py-4 ">
        <p className="pr-12 w-48">First name</p>
        <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" placeholder="Type here" className="w-[250px] bg-transparent focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none p-[1px] " />
      </div>
      <div className="flex items-center py-4 ">
        <p className="pr-12 w-48">Last name</p>
        <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" placeholder="Type here" className="w-[250px] bg-transparent focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none p-[1px] " />
      </div>
      <button className="border-2 border-gray-400 p-2 rounded-xl">Confirm</button>
    </div >
  )
}

export default Hackathon