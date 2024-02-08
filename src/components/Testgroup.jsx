import React, { useState } from 'react'


const testgroup = (props) => {
  let [inputtext, setInputText] = useState('')

  let handlechange =(e) => {
    setInputText(e.target.value) 
  }
  let handleclick = () => {
       props.addlist(inputtext)
  
       setInputText('')
  }
  return (
    <div className='border border-primary p-4 my-3'>
      <input type='text' className='p-2 border border-primary ' onChange={handlechange} value={inputtext}/>
      <button type='button' onClick={handleclick}>add</button>
    </div>
  )
}

export default testgroup