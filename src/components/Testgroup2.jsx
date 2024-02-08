import React from 'react'

const testgroup2 = ({item}) => {
  let [inputtext, setInputText] = useState({
    fullname:'',
    lastname:''
  })
  let [listtodo, setlisttodo] = useState([])

  let handlechange =(e) => {
    let {name, value} = e.target
    setInputText({...inputtext,[name]:value}) 
 
  }

  let handleclick = (e) => {

    setlisttodo([...listtodo, inputtext.fullname, inputtext.lastname])

    setInputText({
      fullname: '',
      lastname: ''
    })

  
  }

  return (
    <>

  <div className='border border-primary p-4 my-3'>
    <input type='text' className='p-2 border border-primary ' onChange={handlechange} value={inputtext.fullname} name='fullname'/>
    <input type='text' className='p-2 border border-primary ' onChange={handlechange} value={inputtext.lastname} name='lastname'/>
    
      <button type='button' onClick={handleclick}>send</button>
    </div>

  {listtodo.map((item,i)=>(
    <>
        <p >{item}</p>
    </>
  )
  )}

  </>
  )
}

export default testgroup2