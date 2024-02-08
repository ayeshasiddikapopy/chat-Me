import React from 'react'
import { Link } from 'react-router-dom'

const LinkingPage = ({title, itemName , to}) => {
  return (
    <div className='my-5'>
        <p className='text-[16px] text-primary font-sans font-normal '> {title}
            <Link to={to} className='text-secondary px-1'>{itemName} </Link>
        </p>
    </div>
  )
}

export default LinkingPage