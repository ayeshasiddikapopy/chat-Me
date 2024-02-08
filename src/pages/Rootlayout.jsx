import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Profile from '../components/Profile';
import { Outlet } from 'react-router-dom';
import { FaBarsProgress } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const Rootlayout = () => {
  let [bar, setbar] = useState(false)
  let [profile, setProfile] = useState(false)
  let [cross, setCross] = useState(false)
  useEffect(()=> {
    let resizeWindow = (e) => {

      if(window.innerWidth < 640){
        setbar(true)
        setCross(true)
        setProfile(false)
        
      }else{
        setbar(false)
        setCross(false)
        setProfile(true)
      }
    }
    resizeWindow()
    return (

      window.addEventListener("resize", resizeWindow)
    )

  },[])
   
  let handleBar = () => {
    setProfile(!profile)
    setbar(false)
  }
  let handleClose = () => {
    setProfile(false)
    setbar(true)
  }
   
  
  return (
    <>
        <Navbar/>
        {cross && 
       ( bar ?
          <div className='p-4 bg-primary ' onClick={handleBar}>
           <FaBarsProgress className='text-light' />
          </div>
          :
          <div className='p-4 bg-primary text-light' onClick={handleClose}>
            <IoMdClose />
          </div>)
        }
        {profile &&
          <Profile/>
        }
        
        <Outlet/>
        <Header/>
    </>
  )
}

export default Rootlayout