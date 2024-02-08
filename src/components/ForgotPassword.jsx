import React, { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import InputBox from './InputBox';
import ALert from './ALert';
import { Oval } from 'react-loader-spinner'
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {

    const auth = getAuth();
    let navigate = useNavigate()
    let [formdata, setformdata] = useState ({
        email:''
    })
    let [formError, setformError] = useState ({
      email:''
    })
    let [loader, setLoader] = useState(false)


   let handleInput = (e) => {

    let {name, value} = e.target
    setformdata({...formdata, [name]:value})
    setformError({...formError, [name]: ''})
      console.log(formdata)
   }

    let handlesubmit = () => {

      let emialRegex= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
      if (formdata.email == ''){
        setformError({...formError, email:'email required'})
      }else if (!emialRegex.test(formdata.email)){
        setformError({...formError, email:'valid email required'})
      } else {

        
        sendPasswordResetEmail(auth, formdata.email)
        .then(() => {
          console.log('mail send')
          setLoader(true)
          setTimeout(() => {
            navigate('/login')
          }, 3000);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode)
          console.log(errorMessage)
          // .. if needed then i can use this error 
        });
      }
    }

  return (
    <div className='min-w-[200px] w-[30%] text-center mx-auto my-[10%] border-1 border-solid border-being shadow-sm shadow-[#676767] p-5 '>
        <h2  className=' py-3 text-primary text-[24px] font-raleway '>Enter your email</h2>
        <InputBox type='email' placeholder='enter your email' name='email' onChange={handleInput}/>
        {
          formError.email &&
          <ALert>
            {formError.email}
          </ALert>
        }
        <div className='my-3'>
            {
              loader 
              ?
                <div className='flex justify-center my-2'>
                <Oval
                visible={true}
                height="40"
                width="40"
                color="#4fa94d"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                />
                </div>
              :
              <Button onClick={handlesubmit}> Submit </Button>

            }
        </div>
    </div>
  )
}

export default ForgotPassword