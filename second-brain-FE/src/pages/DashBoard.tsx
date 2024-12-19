import { Button } from '../components/Button'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Card } from '../components/Card'
import { Model } from '../components/AddContentModel'
import { useState } from 'react'
import { SideBar } from '../components/SideBar'

export const DashBoard = () => {

  const [open, setOpen] = useState(false);
  const [modelText, setModelText] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [sideBarOpen, setSideBarOpen] = useState(false)

  const popUp = (text:string, buttonText:string) =>{
    setModelText(text)
    setOpen(true)
    setButtonText(buttonText)
  }

  const sideBarToggel = () => {
    setSideBarOpen(x => !x)
  }

  return (
    <>
    <div>
      <SideBar open={sideBarOpen} onClose={sideBarToggel}/>
    </div>
    <div className="bg-[#f9fafd] h-screen">
    <div className={`${sideBarOpen ? "ml-72" : "pt-6 pl-10"}`}> 
      <div className='flex items-center justify-between'>
        <p className={`text-[#000000] text-4xl font-bold `}>All Notes</p>
      <div>
        <div className='flex flex-row-reverse gap-4 px-4 pt-4 pb-6'>
          <Button variant='secondary' text='Share Brain' startIcon={<ShareIcon />} onClick={() => popUp("Share Your Brain With The World", "Share Brain")} ></Button>
          <Button variant='primary' text='Add Content' startIcon={<PlusIcon />} onClick={() => popUp("Add Content To Your Brain", "Add To Brain")}></Button>
        </div>
      </div>
      </div>
    
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 mx-10 my-5 ${sideBarOpen ? "gap-x-36" :"gap-x-8"}  ${sideBarOpen ? "pr-28" :"pr-8"}`}>
      <Card title='project ideas' link='https://x.com/wojakcodes/status/1864967266577846555' type='twitter'/>
      <Card title='project ideas' link='https://www.youtube.com/watch?v=tg_Qmigw3pU' type='youtube'/>

    </div>
    <Model open={open} onClose={() => setOpen(false)} text={modelText} buttonText={buttonText}/>
    </div>
    </div>
    
    
    </>
  )
}


