import React from 'react'

const SecondarButton = ({children, onClick}) => {
  return (
    <>
        <button type='button' onClick={onClick} className='w-full py-2.5 text-center bg-primary text-light rounded-lg'>{children}</button>
    </>
  )
}

export default SecondarButton