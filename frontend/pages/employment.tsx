import React, { useState } from "react"

const Employment = () => {
  const [companyName, setCompanyName] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')



  return (
    <div className="p-8 flex flex-col items-start text-left rounded-xl bg-secondary w-3/4">
      <div className="mb-10">
        <h2 className="mb-2 text-5xl font-bold text">Work experience</h2>
        <p>Send a request to get a proof of employment </p>
      </div>
      <form className="w-full flex flex-col gap-16">
        <div>
          <div className="flex gap-6">
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2 text-left">First name</label>
              <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" placeholder="Enter the first name of the employee" className="w-[320px] focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
            </div>
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2 text-left">Last name</label>
              <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" placeholder="Enter the last name of the employee" className="w-[320px] focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col items-start py-4 w-2/4">
              <label className="mr-4 mb-2 ml-2">Company Name</label>
              <input onChange={(e) => setCompanyName(e.target.value)} value={companyName} type="text" placeholder="Enter the company name" className="w-3/4 focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
            </div>
            <div className="w-1/2 flex">
              <div className="flex flex-col items-start py-4 w-full">
                <label className="mr-4 mb-2 ml-2">Start year</label>
                <input onChange={(e) => setStartYear(e.target.value)} value={startYear} type="text" placeholder="Enter the start year" className="w-4/5 focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
              </div>
              <div className="flex flex-col items-start py-4 w-full">
                <label className="mr-4 mb-2 ml-2">End year</label>
                <input onChange={(e) => setEndYear(e.target.value)} value={endYear} type="text" placeholder="Enter the end year" className="w-4/5 focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
              </div>
            </div>
          </div>
        </div>
        <button className="border-0 text-secondary text-lg bg-primary py-4 px-8 rounded-xl">Issue credential</button>
      </form>
    </div >
  )
}

export default Employment