import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Auth from './components/Auth'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import MarketPage from './components/MarketsPage'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'
import Home from './components/Home'
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path="/auth" element={<Auth />} />
      <Route path='/navbar' element={<Navbar/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}></Route>
      <Route path='/market' element={<MarketPage/>}></Route>
      <Route path='/deposit' element={<Deposit/>}></Route>
      <Route path='/withdraw' element={<Withdraw/>}></Route>

    </Routes>
  )
}

export default App