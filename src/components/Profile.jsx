
import React from 'react'
import Container from './Container'
import { Link, NavLink, useNavigate } from 'react-router-dom'


const Profile = () => {
  

  return (
    <Container>
      <div className='sm:bg-primary py-3 rounded-br-lg rounded-bl-lg border-t border-[#ffffffdb]'>
          <div className='sm:flex sm:text-light text-primary sm:text-[16px] text-[14px] justify-evenly capitalize font-raleway font-semibold items-center'> 
            <div className='sm:py-0 py-2 '>
              <NavLink to='users' className='hover:text-being '>Users</NavLink>
            </div>
            <div className='sm:py-0 py-2 '>
              <NavLink to='friendRequest' className='hover:text-being '>friend request</NavLink>
            </div>
            <div className='sm:py-0 py-2 '>
              <NavLink to='friends' className='hover:text-being '> friends</NavLink>
            </div>
            <div className='sm:py-0 py-2 '>
              <NavLink to='group' className='hover:text-being '>Groups</NavLink>
            </div>
            <div className='sm:py-0 py-2 '>
              <NavLink to='block' className='hover:text-being '>Block</NavLink>
            </div>
          </div>
         
      </div> 
       
    </Container>
  )
}

export default Profile