import React, { useEffect, useState } from 'react'
import Imgaes from '../components/Imgaes'
import Button from '../components/Button'
import Container from '../components/Container'
import { getDatabase, ref, onValue, set ,push } from "firebase/database";
import SecondarButton from '../components/SecondarButton';
import { useSelector } from 'react-redux';
import InputBox from '../components/InputBox';
import Searce from '../components/Searce';



const Users = () => {
  
  let db = getDatabase()
  let data = useSelector(state => state.userdata.userInfo)
  let [userList, setUserList] = useState([])
  let [pending, setPending] = useState([])
  let [friends, setFriends] = useState([])
  let [block, setBlock] = useState([])
  let [searce, setSearce] = useState([])
 
  // users-->>
  useEffect(() => {

      let userListRef = ref(db, 'users')

      onValue(userListRef, (snapshot)=> {

        let arr = []

        snapshot.forEach((items)=>{
          if (data.uid !== items.key) {
            arr.push({...items.val(), id:items.key})
          }
        })
        
        setUserList(arr)
      })
  },[])

  // frienrequest-->>
  let handleFriendreq = (info) => {

    set(push(ref(db, 'friendRequest/')), {
        senderId : data.uid,
        senderName: data.displayName,
        senderEmail: data.email,
        reciverId : info.id,
        recieverName : info.displayName,
        recieverEmail:info.email
    });
  }

  //pending--->>
  useEffect(()=> {

    let pendingRef = ref(db, 'friendRequest')

    onValue(pendingRef, (snapshot)=> {
      let arr = []
      snapshot.forEach(items=>{
        arr.push(items.val().senderId + items.val().reciverId)
      })
      setPending(arr)
    })
  },[])

  // friends -->>
  useEffect(()=> {

    let friendsRef = ref(db, 'friends')

    onValue(friendsRef, (snapshot)=> {
      let arr = []
      snapshot.forEach(items=>{
        arr.push(items.val().senderId + items.val().reciverId)
      })
      setFriends(arr)
    })
  },[])

   // Block -->>
   useEffect(()=> {

    let friendsRef = ref(db, 'block')

    onValue(friendsRef, (snapshot)=> {
      let arr = []
      snapshot.forEach(items=>{
        arr.push(items.val().blockId + items.val().blockById)
      })
      setBlock(arr)
    })
  },[])

  // searce --->>
  let handleSearce = (e) => {

    let arr = []
    userList.filter((item)=>{
      if(item.displayName.toLowerCase().includes(e.target.value.toLowerCase())){
        arr.push(item)
      }
    })
    setSearce(arr)
  }


  return (
    <>
      <Container>
        <div className='md:h-550 h-[500px] overflow-y-auto bg-light md:overflow-y-auto'>
          <div className='searce w-[50%] mx-auto'>
              <Searce placeholder='search friends' onChange={handleSearce} name='searce'/> 
          </div>
          <div className='md:flex md:flex-wrap md:justify-evenly overflow-y-auto mx-auto '>

            {searce.length < 1 
            ?
            userList.map((items) => (
              <div className='md:w-[25%] w-[70%] shadow-primary shadow md:m-2.5 mx-auto rounded-md text-center p-2.5'>
                  
                  <div className='p-5'>
                    <Imgaes src='../src/assets/profile.jpg' className='w-full h-full cursor-pointer rounded-lg'/>
                  </div>
                  
                  <div>
                    <h2 className='text-[16px]  text-primary font-raleway font-bold py-2.5'>{items.displayName}</h2>
                    <p className='text-[14px]  text-primary font-raleway font-bold py-2.5 truncate text-ellipsis w-[100%]'>{items.email}</p>

                    { block.includes(items.id + data.uid) || block.includes(data.uid + items.id) 
                    ?
                    <div className='pb-2.5'>
                      <SecondarButton>blocked</SecondarButton>
                    </div>
                    :                    
                    pending.includes(items.id + data.uid) || pending.includes(data.uid + items.id) 
                    ?
                    <div className='pb-2.5'>
                      <SecondarButton>pending</SecondarButton>
                    </div>
                    : 
                    friends.includes(items.id + data.uid) || friends.includes(data.uid + items.id)
                    ?
                    <div className='pb-2.5'>
                      <SecondarButton>friends</SecondarButton>
                    </div>
                    :
                    
                    <div className='pb-2.5'>
                      <SecondarButton onClick={()=> handleFriendreq(items)}>add</SecondarButton>
                    </div>
                    }
                  </div>
              </div>
             ))
            :
            searce.map((items) => (
              <div className='md:w-[25%] w-[70%] shadow-primary shadow md:m-2.5 mx-auto rounded-md text-center p-2.5'>
                  
                  <div className='p-5'>
                    <Imgaes src='../src/assets/profile.jpg' className='w-full h-full cursor-pointer rounded-lg'/>
                  </div>
                  
                  <div>
                    <h2 className='text-[16px]  text-primary font-raleway font-bold py-2.5'>{items.displayName}</h2>
                    <p className='text-[14px]  text-primary font-raleway font-bold py-2.5 truncate text-ellipsis w-[100%]'>{items.email}</p>

                    { block.includes(items.id + data.uid) || block.includes(data.uid + items.id) 
                    ?
                    <div className='pb-2.5'>
                      <SecondarButton>blocked</SecondarButton>
                    </div>
                    :                    
                    pending.includes(items.id + data.uid) || pending.includes(data.uid + items.id) 
                    ?
                    <div className='pb-2.5'>
                      <SecondarButton>pending</SecondarButton>
                    </div>
                    : 
                    friends.includes(items.id + data.uid) || friends.includes(data.uid + items.id)
                    ?
                    <div className='pb-2.5'>
                      <SecondarButton>friends</SecondarButton>
                    </div>
                    :
                    
                    <div className='pb-2.5'>
                      <SecondarButton onClick={()=> handleFriendreq(items)}>add</SecondarButton>
                    </div>
                    }
                  </div>
              </div>
             ))
             }
          </div>  
        </div>
      </Container>
    </>
  )
}

export default Users