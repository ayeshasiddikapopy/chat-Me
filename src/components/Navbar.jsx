import React , {useEffect} from 'react'
import Heading from './../components/Heading';
import Container from '../components/Container';
import { getAuth, onAuthStateChanged ,signOut} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { activeUser } from '../redux/slices/userSlices';
import InputBox from './../components/InputBox';
import { activeChatUser } from '../redux/slices/chatSlice';

const Navbar = () => {  const auth = getAuth();
    let navigate= useNavigate()
    let dispatch = useDispatch()
    let data = useSelector(state=> state.userdata.userInfo)
    let chatdata = useSelector(state => state.userChatdata.chatInfo)
    

    useEffect(() =>{
        if(!data) {
          navigate('/login')
        }
      },[])

      let handleLogout = () => {
        signOut(auth).then(() => {
          localStorage.removeItem('userInfo')
          dispatch(activeUser(null))
          navigate('/login')
          // localStorage.removeItem('chatInfo')
          // dispatch(activeChatUser(null))
         
        }).catch((error) => {
          console.log(error)
        });
      }
  
  return (
    <>
        <div className='bg-primary px-2.5 '>
            <Container>
                <div className='flex justify-between items-center'>
                    <Heading className='text-light'/>
                    <div className='w-[40%]'>
                        <InputBox placeholder='search friends'/>
                    </div>
                    <div onClick={handleLogout} className='text-[#ffffffdb] text-md font-raleway font-semibold hover:text-light'>
                        <p >log out</p>
                    </div>
                </div>
            </Container>
        </div>
        
    </>
  )
}

export default Navbar