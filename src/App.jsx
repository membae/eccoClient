import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Auth from './components/Auth'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import MarketPage from './components/MarketsPage'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'
import Home from './components/Home'
import Profile from './components/Profile'
import Logout from './components/Logout'
import Bot from './components/Bot'
import Configure from './components/Configure'
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
      <Route path='/profile' element={<Profile/>}></Route>
      <Route path='/logout' element={<Logout/>}></Route>
      <Route path='/bot' element={<Bot/>}></Route>
      {/* <Route path='/configure' element={<Configure/>}></Route> */}
      <Route path="/configure/:botName" element={<Configure />} ></Route>


    </Routes>
  )
}

export default App