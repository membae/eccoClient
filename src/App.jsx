import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Auth from './components/Auth'
import Navbar from './components/Navbar'
function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path='/navbar' element={<Navbar/>}></Route>

    </Routes>
  )
}

export default App