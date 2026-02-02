import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Auth from './components/Auth'
function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

    </Routes>
  )
}

export default App