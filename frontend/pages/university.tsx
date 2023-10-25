import React, { useState } from "react"
import Image from "next/image"
import logo from '../public/Harvard_University_logo.svg.png'

const Uni = () => {
  const [degree, setDegree] = useState('')
  const [year, setYear] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [university, setUniversity] = useState('')
  const [major, setMajor] = useState('')

  return (
    <div className="p-8 flex flex-col items-start gap-1 text-left rounded-xl bg-secondary w-3/4">
        <h2 className="mb-2 text-5xl font-bold text-center">Education</h2>
        <p className="mb-4">Send a request to get information about the education </p>
      <form className="w-full flex flex-col gap-4">
        <div>
          <div className="flex gap-6">
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2 text-left">First name</label>
              <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" placeholder="Enter the first name of the alumni" className="w-[320px] focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
            </div>
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2 text-left">Last name</label>
              <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" placeholder="Enter the last name of the alumni" className="w-[320px] focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2 text-left">University</label>
              <select className="w-[320px] focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" value={degree} onChange={(e) => { setDegree(e.target.value) }}>
                <option value="">Select the university</option>
                <option value="Harvard">Harvard</option>
                <option value="MIT">MIT</option>
              </select>
            </div>
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2">Graduation year</label>
              <input onChange={(e) => setYear(e.target.value)} value={year} type="text" placeholder="Enter the year" className="w-2/5 focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
            </div>
          </div>
        </div>
        <button className="border-0 text-secondary text-lg bg-primary py-4 px-8 rounded-xl">Issue credential</button>
      </form>
    </div >
  )
}

export default Uni