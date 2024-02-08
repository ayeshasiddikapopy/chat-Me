import React from 'react'

const ALert = ({children}) => {
  return (
    <>
        <div className='w-full py-2.5 px-2 border border-red-500 border-solid rounded-lg md:min-w-[18rem] min-w-[16rem] mx-auto md:text-[12px] text-[10px] text-red-500 mb-3'>{children}</div>
    </>
  )
}

export default ALert