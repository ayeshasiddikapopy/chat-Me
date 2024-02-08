import React, { useEffect, useState } from 'react'
import Container from './Container'
import { CiSettings } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import Imgaes from './Imgaes';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';


const Header = () => {
    let dispatch = useDispatch()
    let data = useSelector((state)=> state.userdata.userInfo)
    let [profile, setprofile] = useState('')
    let navigate = useNavigate()
    let [name, setName] = useState('')

    let handleImg = () => {
      navigate('cropimg')
    }
    useEffect(()=> {
      setprofile(data.photoURL)
    }, [data])

    useEffect(()=> {
      setName(data.displayName)
      console.log('name',name)
    }, [data])

    let handleSetting = () => {
      navigate('cropimg')
    }
    let handleChatting = () => {
      navigate('chat')
      localStorage.removeItem('chatInfo')
      dispatch(activeChatUser(null))
    }
    let handlenotification = () => {
      navigate('cropimg')
    }
    let handleNameUpdate = () => {
      navigate('cropimg')
    }
    let handleEdit = () => {
       navigate('cropimg')
    }
    
    
  return (
    <>
        <Container>
            <div className='bg-primary py-2.5 rounded-br-lg rounded-bl-lg border-t border-[#ffffffdb]'>
                <div className='flex text-light md:text-[24px] text-[18px] justify-between md:px-3 px-2 items-center'>
                  <div className='flex items-center gap-x-4'>

                    {data.photoURL
                    ?
                    <div className='w-[60px] h-[60px]' onClick={handleImg} >
                      <Imgaes src={profile} className='h-full w-full rounded-lg border-2 border-light'/>
                    </div>
                    :
                    <div className='w-[60px] h-[60px]' onClick={handleImg} >
                      <Imgaes src='../src/assets/profile.jpg' className='h-full w-full rounded-lg border-2 border-light'/>
                    </div>
                    }   
                    {
                    data.displayName 
                    ?
                    <div onClick={handleNameUpdate}>
                      <p className='text-[16px] font-raleway font-normal capitalize text-light hover:text-being hover:transition'>{data.displayName}</p>
                    </div>
                    :
                    <div onClick={handleNameUpdate}>
                      <p className='text-[16px] font-raleway font-normal capitalize text-light hover:text-being hover:transition'>{data.displayName}</p>
                    </div>
                    }

                  </div>
                    <FaUserEdit onClick={handleEdit} className='hover:text-being hover:transition cursor-pointer'/>
                    <IoIosNotificationsOutline onClick={handlenotification} className='hover:text-being hover:transition cursor-pointer'/>
                    <CiSettings onClick={handleSetting} className='hover:text-being hover:transition cursor-pointer'/>
                    <AiOutlineMessage onClick={handleChatting} className='hover:text-being hover:transition cursor-pointer'/>
                </div>
            </div>
        </Container>
    </>
  )
}

export default Header