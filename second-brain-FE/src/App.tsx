import './App.css'
import { Button } from './components/Button'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/ShareIcon'
import { Card } from './components/Card'
import { Model } from './components/AddContentModel'
import { useState } from 'react'

function App() {

  const [open, setOpen] = useState(false);
  const [modelText, setModelText] = useState("");
  const [buttonText, setButtonText] = useState("");

  const popUp = (text:string, buttonText:string) =>{
    setModelText(text)
    setOpen(true)
    setButtonText(buttonText)
  }

  return (
    <>
    <Model open={open} onClose={() => setOpen(false)} text={modelText} buttonText={buttonText}/>
    <div className='flex flex-row-reverse gap-4 px-4 pt-4 pb-6'>
      <Button variant='secondary' text='Share Brain' startIcon={<ShareIcon />} onClick={() => popUp("Share Your Brain With The World", "Share Brain")}></Button>
      <Button variant='primary' text='Add Content' startIcon={<PlusIcon />} onClick={() => popUp("Add Content To Your Brain", "Add To Brain")}></Button>
    </div>
    <div className='flex gap-10 mx-10 my-5'>
    <Card title='project ideas' link='https://x.com/wojakcodes/status/1864967266577846555' type='twitter'/>
    <Card title='project ideas' link='https://www.youtube.com/watch?v=tg_Qmigw3pU' type='youtube'/>
    </div>
    </>
  )
}

export default App
