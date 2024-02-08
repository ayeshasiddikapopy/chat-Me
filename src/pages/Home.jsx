import React from 'react'
import Container from '../components/Container'
import Profile from '../components/Profile'
import Users from './Users'


const Home = () => {

 

  return (
    <>
      {/* <Profile/> */}
      <Container>
        <div className='h-[550px] bg-light'>
          <Users/>
        </div>
      </Container>
    </>
  )
}

export default Home