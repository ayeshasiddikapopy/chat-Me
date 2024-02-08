import React from 'react'

const Button = ({children,onClick ,modalref }) => {
  return (
    <>
        <button ref={modalref} type='button' className='bg-primary capitalize md:px-4 px-2.5 md:py-2.5 py-1 rounded-xl text-light' onClick={onClick}>{children}</button>
    </>
  )
}

export default Button