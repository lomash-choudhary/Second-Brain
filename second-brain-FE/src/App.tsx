import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DashBoard } from './pages/DashBoard'
import {FirstPage} from './pages/FirstPage'
import { SignUpAndSignInPage } from './pages/SignUpPage'

function App() {
  return (
    <>
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<FirstPage />}/>
          <Route path='/signup' element={<SignUpAndSignInPage type='Sign Up' />}/>
          <Route path='/signin' element={<SignUpAndSignInPage type='Sign In' />}/>
          <Route path='/dashboard' element={<DashBoard />}/>
          {/* <Route path="/brain/:hash" element={<DashBoard />} /> */}
        </Routes>
        
      </div>
    </BrowserRouter>
    
    </>
  )
}

export default App
