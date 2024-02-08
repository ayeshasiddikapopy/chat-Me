import React, { useState } from 'react'
import Container from '../components/Container'
import Heading from './../components/Heading';
import InputBox from '../components/InputBox';
import Button from '../components/Button';
import ALert from '../components/ALert';
import { GiEyelashes } from "react-icons/gi";
import { ImEye } from "react-icons/im";
import { getAuth, createUserWithEmailAndPassword ,sendEmailVerification ,updateProfile} from "firebase/auth";
import { Oval } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom';
import LinkingPage from '../components/LinkingPage';
import Notifications from '../components/Notifications';
import { getDatabase, ref, set ,push} from "firebase/database";



const Registration = () => {

  let navigate = useNavigate()
  const auth = getAuth();
  const db = getDatabase();
  let [show, setShow] = useState(false)
  let [loader, setLoader] = useState(false)
  let [notifications, setNotification] = useState(false)
 
  let [formdata, setformdata] = useState({
    fullName:'',
    email:'',
    password:''
  })
  let [formerror, setformerror] = useState({
    fullName:'',
    email:'',
    password:''
  })


  let handleInput = (e) => {

    let {name, value} = e.target

    setformdata({...formdata, [name]:value})
    setformerror({...formerror,[name]:''})
  }
  let handleclick =() => {

    let regex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/

    if (formdata.email == ''){
      setformerror({...formerror, email:'email required'})
    } 
    else if (!regex.test(formdata.email)){
      setformerror({...formerror, email:'valid email required'})
      console.log('valid email ')
    }
    else if (formdata.fullName == ''){
        setformerror({...formerror, fullName:'name required'})
    }
    else if (formdata.password == ''){
      setformerror({...formerror, password:'password required'})
    }
    else if (!passwordRegex.test(formdata.password)){
      setformerror({...formerror, password:'at least one uppercase or lowercase letter, one digit '})
      console.log('valid email ')
    }
    else{
      createUserWithEmailAndPassword(auth, formdata.email, formdata.password).then((userCredential) => {

        const user = userCredential.user;
        console.log(user)

        sendEmailVerification(auth.currentUser).then(() => {

          let users = auth.currentUser

            updateProfile(users, {

              displayName: formdata.fullName,
              // photoURL: "https://example.com/jane-q-user/profile.jpg"

            }).then(()=>{

                set(ref(db, 'users/' + user.uid), {
                  
                  displayName: user.displayName,
                  email: user.email,

                  // profile_picture : imageUrl
                });
                
              }).then(() => {
         
               
               setformdata({
                  fullName:'',
                  email:'',
                  password:''
                })
                
                setTimeout(() => {
                  setLoader(true)
                  setNotification(true)
                }, 500);
                setTimeout(() => {
                  navigate('/login')
                }, 1000);
              
              }).catch((error) => {
                console.log(error)
              })
        })
      }).catch((error) => {
      
        const errorCode = error.code;
        const errorMessage = error.message;
        
        if(errorCode.includes('auth/email-already-in-use')){
          setformerror({...formerror, email:'email already exist'})
        }
        if(errorMessage.includes('auth/weak-password')){
          setformerror({...formerror, password:'password should be minimum 8 character'})
        }
         // if i find my result just in errorcode then why should i use include method??
        //  ans: includes method are more targetable to find the problem specificaly
      })
    }
       
   
   
  }

  return (
    <>
    <Container>
    <Heading className='my-8 text-primary'/>
      <div className='md:w-[40%] w-[80%] mx-auto text-center'>
        <form>
          <InputBox type='text' placeholder='Enter a name' name='fullName' onChange={handleInput} value={formdata.fu}/>
          {
            formerror.fullName &&
            <ALert>
              {formerror.fullName}
            </ALert>
          }
          <InputBox type='email' placeholder='Enter Email' name='email' onChange={handleInput}/>
          {
            formerror.email &&
            <ALert>
              {formerror.email}
            </ALert>
          }
          <div className='relative'>
            <InputBox type={show ? 'text' : 'password'}placeholder='Enter password' name='password' onChange={handleInput}/>
            {
              show 
              ?
              <ImEye className='absolute top-[33%] right-[2%]' onClick={()=>setShow(false)}/>
              :
              < GiEyelashes className='absolute top-[33%] right-[2%]' onClick={()=>setShow(true)}/>
            }
          </div>
          {
            formerror.password &&
            <ALert>
              {formerror.password}
            </ALert>
          }
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
              <Button onClick={handleclick}>Registration</Button>
            }  
          </div>
        <LinkingPage to='/login' title='Already have Account ?' itemName='sign up'/>
            
        </form>
      </div>
    </Container> 
    {
      notifications &&
     <Notifications title='registration succesfull & check your email to varify' style={{background:'#43766C'}}/>
    }
    </>
  )
}

export default Registration