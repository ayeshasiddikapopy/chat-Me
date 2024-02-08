import React from 'react'

const Heading = ({className}) => {
  return (
    <>
      <div className={className}>
        <h1 className='md:text-5xl text-2xl font-raleway font-bold text-center'>Chat <span className='text-being'>Me</span></h1>
      </div>
    </>
  )
}

export default Heading