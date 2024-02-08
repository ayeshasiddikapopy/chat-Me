import React from 'react'

const InputBox = ({label, name, placeholder, onChange, type , value}) => {
  return (
    <div className="w-full mx-auto my-7">
        <input value={value} label={label} name={name} placeholder={placeholder} onChange={onChange} type={type} className='w-full py-2.5 px-2 border border-primary border-solid rounded-lg focus:bg-[#43766c1c] focus:outline-none focus:border-primary transition'/>
    </div>
  )
}

export default InputBox