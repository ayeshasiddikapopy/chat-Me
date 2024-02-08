import React, { useEffect, useState } from 'react'
import Container from '../components/Container'
import Imgaes from '../components/Imgaes'
import Button from '../components/Button'
import { useSelector } from 'react-redux'
import { getDatabase, ref, onValue ,remove, set, push} from "firebase/database";
import AlertPage from '../components/AlertPage'
import FindUsers from '../components/FindUsers'
import { Link, useNavigate } from 'react-router-dom'
import SecondarButton from '../components/SecondarButton'



const FriendRequest = () => {

  const db = getDatabase();
  let data = useSelector((state=> state.userdata.userInfo))
  let [friendRequest, setfriendrequest] = useState([])
  let navigate = useNavigate()


  // friend Request -->>
  useEffect(()=> {

    const friendRequestRef = ref(db, 'friendRequest');

    onValue(friendRequestRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {

        if (item.val().reciverId == data.uid){
          arr.push({...item.val(), id:item.key})
        }
      })
      setfriendrequest(arr)
    });
  },[])

// friends-->>
let handleAcceptRequest = (item) => {
  set(push(ref(db, 'friends/')), {
    ...item           // this item comes with frienrequests val()
  }).then((item)=>{
    remove(ref(db, 'friendRequest' )).then(()=> {
      console.log('delet')
    })
  })
}


//back to user page-->>
  let handleFind = () => {
    navigate('/home/users')
  }

  // friend request removed-->>
  let handleremoveRequest = (items) => {

    remove(ref(db, 'friendRequest/' + items.id)).then(()=> {
      console.log('delet')
    })
  }


  
  return (
    <>
    <Container>
      <div className='md:h-550 h-[500px] overflow-y-auto bg-light md:overflow-y-auto'>
        <div className='flex flex-wrap justify-evenly overflow-y-auto mx-auto '>

          {friendRequest.length > 0 
          ?
          friendRequest.map((item)=>(
            <div className='md:w-[25%] w-[70%] shadow-primary shadow md:m-2.5 mx-auto rounded-md text-center p-2.5'>
                <div className='p-5'>
                  <Imgaes src='../src/assets/profile.jpg' className='w-full h-full cursor-pointer rounded-[50%]'/>
                </div>
                <div>
                  <h2 className='text-[16px] text-primary font-raleway font-bold py-2.5'>{item.senderName}</h2>
                  <p className='text-[14px] text-primary font-raleway font-bold py-2.5'>{item.senderEmail}</p>
                  <div className='pb-2.5'>
                    <SecondarButton onClick={()=> handleAcceptRequest(item)}>accept</SecondarButton>
                  </div>
                  <div className='pb-2.5'>
                    <SecondarButton onClick={()=> handleremoveRequest(item)}>remove</SecondarButton>
                  </div>
                </div>
            </div>
           ))
          :
          <>
            <AlertPage>No Friend Request</AlertPage>
            <FindUsers onClick={handleFind}> Find Friends , click here </FindUsers>
          </>
          }
        </div>  
      </div>
    </Container>
    </>
  )
}

export default FriendRequest