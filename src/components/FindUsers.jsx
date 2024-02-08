import React from 'react'
import { RxDoubleArrowUp } from "react-icons/rx";

const FindUsers = ({children, onClick}) => {
  return (
    <>
        <div onClick={onClick} className='border-[0.5px] border-primary py-2 px-4 my-4 rounded-md flex items-center'>
            <p className='text-primary text-[16px] font-sans font-normal hover:text-[#284842]'>{children}</p>
            <RxDoubleArrowUp className=' rounded-[50%] border mx-2 text-[20px] '/>
        </div>
    </>
  )
}

export default FindUsers