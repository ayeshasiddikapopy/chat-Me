
import React from 'react'
import Container from './../components/Container';
import Chatgroup from '../components/Chatgroup';
import FriendsChat from '../components/FriendsChat';
import Chatting from '../components/Chatting';

const Chat = () => {

  return (
    <>
        <Container>
        <div className='h-550 bg-light'>
          <div className='md:flex md:flex-wrap md:justify-between mx-auto p-2.5 h-full overflow-x-auto'>
            <div className='md:w-[50%] w-[100%] h-full overflow-y-auto text-center md:p-4 p-2'>
              <Chatgroup/>
              <FriendsChat/>
            </div>
            <div className='md:w-[50%] w-[100%] h-full overflow-y-auto text-center md:p-4 p-2'>
              <Chatting/>
            </div>
          </div> 
        </div> 
        </Container>
    </>
  )                     
}

export default Chat