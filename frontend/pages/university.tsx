import React, { useState } from "react"
import Image from "next/image"
import logo from '../public/Harvard_University_logo.svg.png'

const Uni = () => {
  const [degree, setDegree] = useState('')
  const [year, setYear] = useState('')
  const [name, setName] = useState('')
  const [major, setMajor] = useState('')

  return (
    <div className="max-w-xs">
      <div className="flex flex-col mb-12 border">
        <Image width={500} height={200} className="object-contain" alt="logo" src={logo}></Image>
        <h2 className="p-8 text-5xl font-bold text-center">Harvard University</h2>
      </div>
      <form>
        <div className="flex items-center py-4 border">
          <p className="pr-12 w-48 text-left">Name of the Student</p>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Type here" className="w-[250px] bg-transparent focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none p-[1px] " />
        </div>
        <div className="flex items-center py-4">
          <p className="pr-12 w-48">Year of Graduation</p>
          <input onChange={(e) => setYear(e.target.value)} value={year} type="text" placeholder="Type here" className="w-[250px] bg-transparent focus:border-2 py-2 px-2 focus:rounded-md focus:border-gray-400 outline-none p-[1px] " />
        </div>
        <div className="flex items-center py-4">
          <label className="pr-12 w-48">
            Degree
          </label>
          <select className="p-2 w-64 text-black" value={degree} onChange={(e) => { setDegree(e.target.value) }}>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
          </select>
        </div>
        <div className="flex items-center py-4">
          <label className="pr-12 w-48">
            Major
          </label>
          <select className="p-2 w-64 text-black" value={major} onChange={(e) => setMajor(e.target.value)}>
            <option value="Major 1">Major 1</option>
            <option value="Major 2">Major 2</option>
            <option value="Major 3">Major 3</option>
            <option value="Major 4">Major 4</option>
          </select>
        </div>
      </form>

      <button className="border-2 border-gray-400 p-2 rounded-xl">Confirm</button>
    </div >
  )
}

export default Uni