import React, { useState } from "react"

const Event = () => {
  const [eventName, setEventName] = useState('')
  const [year, setYear] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  return (
    <div className="p-8 flex flex-col items-start text-left rounded-xl bg-secondary w-3/4">
      <div className="mb-10">
        <h2 className="mb-2 text-5xl font-bold text">Event</h2>
        <p>Send a request to issue proof of attandance of an event</p>
      </div>
      <form className="w-full flex flex-col gap-16">
        <div>
          <div className="flex gap-6">
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2 text-left">First name</label>
              <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" placeholder="Enter the first name of the participant" className="w-[320px] focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
            </div>
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2 text-left">Last name</label>
              <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" placeholder="Enter the last name of the participant" className="w-[320px] focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2 text-left">Event name</label>
              <input onChange={(e) => setEventName(e.target.value)} value={eventName} type="text" placeholder="Enter the event name" className="w-[320px] focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
            </div>
            <div className="flex flex-col items-start py-4 w-1/2">
              <label className="mr-4 mb-2 ml-2">Year</label>
              <input onChange={(e) => setYear(e.target.value)} value={year} type="text" placeholder="Enter the year" className="w-2/5 focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none rounded-xl" />
            </div>
          </div>
        </div>
        <button className="border-0 text-secondary text-lg bg-primary py-4 px-8 rounded-xl">Issue credential</button>
      </form>
    </div >
  )
}

export default Event