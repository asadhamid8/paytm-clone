import { useState } from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import { Signup } from './pages/signup'
import { Signin } from './pages/signin'
import { SendMoney } from './pages/send'
import {Dashboard} from  './pages/dashboard'
import './App.css'
function App() {


  return (
    <div>
     
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
           <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />  
        </Routes>
      </BrowserRouter> 
      </div>
    
  )
}

export default App
