import Image from "next/image"
import photo from '../public/profile-pic.jpg'
import { useState } from "react"

interface UpdatableProfileProps {
  walletAddress: string
}

interface WorkExperience {

}

interface Education {

}

interface Certification {

}

interface UserInfo {
  workExperience: WorkExperience[]
  education: Education[]
  certificates: Certification[]
}

interface ListItemProps<T> {
  data: T
  update: (data: T) => void
}

const WorkExperienceListItem = ({ data, update }: ListItemProps<WorkExperience>) => {
  /*
  <div className="mb-2">
        <p>Software engineer at Apple</p>
        <p>2019-2022</p>
      </div>
      <div className="mb-2">
        <p>Frontend developer at Microsoft</p>
        <p>2015-2019</p>
      </div>
      */
  return (
    <div>

    </div>
  )
}

const EducationListItem = ({ data, update }: ListItemProps<Education>) => {
  return (
    <div>

    </div>
  )
}

const CertificationListItem = ({ data, update }: ListItemProps<Certification>) => {
  /*
  <div>
        <p>TOEFL 120</p>
        <p>2023</p>
      </div>
      <div className="mb-2">
        <p>EBC Hackathon</p>
        <p>Barcelona, 2023</p>
      </div>
      <div>
        <p>Europian Blockchain Convention</p>
        <p>Barcelona, 2023</p>
      </div>
  */
  return (
    <div>

    </div>
  )
}

const getUpdateHandler = <T,>(setState: (item: T[]) => void, items: T[], replaceIndex: number): (item: T) => void => {
  const childSetState = (updatedItem: T) => {
    const updatedItems = items.map((item, index) => index === replaceIndex ? updatedItem : item)
    setState(updatedItems)
  }
  return childSetState
}

const UpdatableProfileHeader = () => {
  // TODO: This is hardcoded.
  return (
    <div className="flex items-start gap-1 text-left rounded-xl bg-secondary max-w-xl">
      <div className="max-w-xs text-lg m-6">
        <h2 className="text-5xl font-bold mb-4">NATALIA DAVTYAN</h2>
        <p className="text-sm">Junior frontend developer and code reviewer<br></br>
          React | JavaScript | HTML | CSS</p>
      </div>
    </div>
  )
}

interface UpdatableSectionProps<T> {
  state: T[]
  setState: (items: T[]) => void
}

const UpdatableWorkExperience = ({ state, setState }: UpdatableSectionProps<WorkExperience>) => {
  return (
    < div className="mb-4 p-3 text-left rounded-xl bg-secondary" >
      <h3 className="font-bold mb-2">Work Experience</h3>
      {state.map((value, index) => (
        <WorkExperienceListItem data={value} update={getUpdateHandler(setState, state, index)} />
      ))}
    </div >
  )
}

const UpdatableEducation = ({ state, setState }: UpdatableSectionProps<Education>) => {
  return (
    <div className="mb-4 p-3 text-left rounded-xl bg-secondary">
      <h3 className="font-bold mb-2">Education</h3>
      {state.map((value, index) => (
        <EducationListItem data={value} update={getUpdateHandler(setState, state, index)} />
      ))}
    </div>
  )
}

const UpdatableCertificationItems = ({ state, setState }: UpdatableSectionProps<Certification>) => {
  return (
    <div className="mb-4 p-3 text-left rounded-xl bg-secondary">
      <h3 className="font-bold mb-2">Certificates</h3>
      {state.map((value, index) => (
        <CertificationListItem data={value} update={getUpdateHandler(setState, state, index)} />
      ))}
    </div>
  )
}

const UpdatableProfile = ({ walletAddress }: UpdatableProfileProps) => {
  const [workExperienceItems, setWorkExperienceItems] = useState<WorkExperience[]>([])
  const [educationItems, setEducationItems] = useState<Education[]>([])
  const [certificationItems, setCertificationItems] = useState<Certification[]>([])
  return (
    <div>
      {walletAddress}
      <UpdatableProfileHeader />
      <div className="mb-4">
        <UpdatableWorkExperience state={workExperienceItems} setState={setWorkExperienceItems} />
        <UpdatableEducation state={educationItems} setState={setEducationItems} />
        <UpdatableCertificationItems state={certificationItems} setState={setCertificationItems} />
      </div>
    </div>
  )
}

export default UpdatableProfile