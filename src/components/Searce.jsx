import React from 'react'

const Searce = ({label, name, placeholder, onChange, type}) => {
    return (
      <div className="w-full mx-auto my-2.5 searce__input">
          <input label={label} name={name} placeholder={placeholder} onChange={onChange} type={type} className='w-full py-2.5 px-2 border border-primary border-solid rounded-lg focus:bg-[#43766c1c] focus:outline-none focus:border-primary transition'/>
      </div>
    )
  }

export default Searce