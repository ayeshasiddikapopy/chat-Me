import React, { useState } from 'react'
import Container from '../components/Container'
import Heading from '../components/Heading'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import ALert from '../components/ALert'
import { getAuth, signInWithEmailAndPassword ,signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Oval } from 'react-loader-spinner'
import { GiEyelashes } from "react-icons/gi";
import { ImEye } from "react-icons/im";
import { useNavigate } from 'react-router-dom'
import LinkingPage from '../components/LinkingPage'
import Imgaes from '../components/Imgaes'
import Notifications from '../components/Notifications'
import { useDispatch } from 'react-redux'
import { activeUser } from '../redux/slices/userSlices'



const Login = () => {

  const auth = getAuth();
  let navigate = useNavigate()
  const provider = new GoogleAuthProvider();
  let [loader, setLoader] = useState(false)
  let [show, setShow] = useState(false)
  let [notifications, setNotification] = useState(false)
  let dispatch = useDispatch()
  let [formdata, setformdata] = useState({
    email:'',
    password:''
  })

  let [formError, setformError] = useState({
    email:'',
    password:''
  })

  let handleForm = (e) => {

    let {name, value} = e.target

    setformdata({...formdata, [name]:value})
    setformError({...formError, [name]:''})
  }

  let handleLogin = () => {

    let emialRegex= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    if (formdata.email == ''){
      setformError({...formError, email:'email required'})
    }else if (!emialRegex.test(formdata.email)){
      setformError({...formError, email:'valid email required'})
    }
    else if (formdata.password == ''){
      setformError({...formError,password:'password required'})
    }else{
      signInWithEmailAndPassword(auth, formdata.email, formdata.password)
      .then((userCredential) => {
       
        const user = userCredential.user;

        dispatch(activeUser(userCredential.user))
        localStorage.setItem('userInfo', JSON.stringify(userCredential.user))

        console.log(user.emailVerified)

        if(user.emailVerified == false) {
          console.log('please varify your email')
        } else{
          setLoader(true)
          setNotification(true)
          setTimeout(() => {
            navigate('/home')
          }, 2000);
        }
      
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if(errorCode.includes('auth/invalid-credential')){
          setformError({...formError, email:'email not matched'})
        }
        if(errorMessage.includes('auth/invalid-credential')){
          setformError({...formError, password:'password not matched'})
        }
      });
    }
    console.log(formdata)
  }

  let handleGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
     console.log(user)
     navigate('/home')
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
     
    });
  }

  return (
    <>
    <Container>
      <Heading className='my-8 text-primary'/>
      <div className='md:w-[40%] w-[80%] mx-auto text-center'>
        <form action="">
          <InputBox type='text' name='email' placeholder='Enter a email' onChange={handleForm}/>
          {
           formError.email && 
            <ALert>
              {formError.email}
            </ALert>
          }
          <div className='relative'>
          <InputBox type={show ? 'text' : 'password'} name='password' placeholder='Enter a password' onChange={handleForm}/>
          {
            show 
            ?
            <ImEye className='absolute top-[33%] right-[2%]' onClick={()=>setShow(false)}/>
            :
            < GiEyelashes className='absolute top-[33%] right-[2%]' onClick={()=>setShow(true)}/>
          }
        </div>
          {
           formError.password && 
            <ALert>
              {formError.password}
            </ALert>
          }
        </form>
        <div className='mt-4 '>
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
            <Button onClick={handleLogin}>Login</Button>
          }
        </div>
          <div className=' h-[50px] mt-4 w-[50%] mx-auto'>
            <Imgaes src='./src/assets/google.png' onClick={handleGoogle} className='w-full h-full cursor-pointer'/>
          </div>
        <LinkingPage to='/' title="Don't have an Account ?" itemName='sign In'/>
        <LinkingPage to='/forgot' itemName='Forgot password ?'/>
      </div>
    </Container> 
    {
      notifications &&
     <Notifications title='login succesfull ' style={{background:'#43766C'}}/>
    }
    </>
  )
}

export default Login