import React from 'react'
import Searce from './Searce'

const GroupHeader = ({onChange,title,children,placeholders}) => {
  return (
    <>
        <div className='group__header flex justify-between p-2.5 shadow-sm shadow-primary mb-4 items-center'>
            <h2 className='md:text-[24px] text-[20px] text-secondary font-raleway font-semibold capitalize'>
                {title}
            </h2>
            <div className='searce w-[50%] ml-auto'>
                <Searce placeholder={placeholders} onChange={onChange} name='searce'/> 
            </div>
            <div className='ml-2'>
                {children}
            </div>
        </div>
    </>
  )
}

export default GroupHeader