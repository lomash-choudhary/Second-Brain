import './App.css'
import { Button } from './components/Button'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/ShareIcon'
import { Card } from './components/Card'

function App() {

  return (
    <>
    <div className='flex'>
      <Button variant='secondary' text='Share Brain' startIcon={<ShareIcon />}></Button>
      <Button variant='primary' text='Add Content' startIcon={<PlusIcon />}></Button>
    </div>

    <Card />
    </>
  )
}

export default App
