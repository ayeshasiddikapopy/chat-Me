
import React from 'react'

const Notifications = ({title, onClick, style}) => {
  return (
    <div className='animated__notification max-w-[250px] absolute bottom-2 right-4 bg-primary text-light rounded-md' onClick={onClick} style={style}>
    <p className='p-2.5 duration-200'> {title}</p>
</div>
  )
}

export default Notifications