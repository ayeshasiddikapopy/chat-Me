import React from 'react'

const AlertPage = ({children}) => {
  return (
    <div className='p-2.5 w-full bg-primary mt-4 mx-2.5 rounded-lg text-center '>
        <p className='text-light font-raleway font-semibold md:text-[18px] text-[12px] capitalize'>{children}</p>
    </div>
  )
}

export default AlertPage