import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Auth from './components/Auth'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path='/navbar' element={<Navbar/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}></Route>

    </Routes>
  )
}

export default App