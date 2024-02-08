import React from 'react'
import Container from '../components/Container'
import MyGroup from '../components/MyGroup'
import GroupList from '../components/GroupList'

const Groups = () => {
  return (
    <>
    <Container>
      <div className='md:h-550 h-[500px] overflow-y-auto bg-light md:overflow-y-auto'>
        <div className='md:flex md:flex-wrap md:justify-between mx-auto p-2.5 h-full'>
          <div className='xl:w-[50%] w-[100%] object-fill h-full overflow-y-auto text-center md:p-4 p-2 my__group'>
            <MyGroup/>
          </div>
          <div className='xl:w-[50%] w-[100%] object-fill h-full overflow-y-auto text-center md:p-4 p-2 grop__List'>
            <GroupList/>
          </div>
        </div> 
      </div> 
    </Container>
  </>
  )
}

export default Groups