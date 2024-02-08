import React, { useEffect, useState } from 'react'
import InputBox from './InputBox'
import Button from './Button'
import { getDatabase, onValue, push, ref ,update} from 'firebase/database'
import { useDispatch, useSelector } from 'react-redux'
import { activeUser } from '../redux/slices/userSlices'
import { getAuth, updateProfile } from "firebase/auth";

const NameEdit = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    let [edit, setedit] = useState('')
    let db = getDatabase()
    let data = useSelector(state=> state.userdata.userInfo)
    let dispatch = useDispatch()

    let handleChange = (e) => {
        setedit(e.target.value)
    }

    let handleUpdate = () => { 
        updateProfile(auth.currentUser, {
            displayName: edit, 
        }).then(() => {
            console.log('update')
            dispatch(activeUser(auth.currentUser))
            localStorage.setItem('userInfo', JSON.stringify(auth.currentUser))
        }).then(()=>{
            setedit('')
        }).catch((error) => {
            console.log(error)
        });
    }  
   
    let [show, setshow] = useState(false)
    let handleShow = () => {
        setshow(!show)
    }

  return (
  
    <>
    <div className='p-4'>
        {show &&
        <div className='flex items-center justify-between'>
            <div className='w-[80%] '>
                <InputBox placeholder='Enter to edit name' value={edit} onChange={handleChange}/>
            </div>
            <div className=' hover:bg-dark rounded-lg' onClick={handleUpdate} >
                <Button>Update</Button>
            </div>
        </div>
        }
        <div className='p-2.5 bg-[#0000000e] rounded-md flex items-baseline justify-between'>
            <p className='md:text-[16px] text-[14px] text-dark font-raleway font-normal md:px-2.5 px-2.5 '>Name : {data.displayName}</p>
            <div className=' hover:bg-dark rounded-lg' onClick={handleShow}>
                    <Button>Edit</Button>
            </div>
        </div>
    </div>
    </>
  )
}

export default NameEdit