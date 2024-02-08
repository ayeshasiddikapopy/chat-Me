import React, { useEffect, useState } from 'react'
import Container from '../components/Container'
import Imgaes from '../components/Imgaes'
import { getDatabase, ref, onValue, remove, set, push } from "firebase/database";
import { useSelector } from 'react-redux';
import SecondarButton from '../components/SecondarButton';
import Searce from '../components/Searce';
import AlertPage from '../components/AlertPage';
import FindUsers from '../components/FindUsers';
import { useNavigate } from 'react-router-dom';



const Friends = () => {

  let navigate = useNavigate()
  const db = getDatabase();
  let reduxData =  useSelector((state)=>state.userdata.userInfo)
  let [friends, setfriends ] = useState([])
  let [searce, setSearce] = useState([])
  
  // get friends---->>>
  useEffect(()=> {

    const FriendsRef = ref(db, 'friends' );

    onValue(FriendsRef, (snapshot) => {

      let arr = []
      snapshot.forEach((item) => {
        if(reduxData.uid == item.val().senderId || reduxData.uid == item.val().reciverId ) {
          arr.push({...item.val(),id:item.key})
        }
      })
      setfriends(arr)
    });
  },[])

  // Unfriend--->>
  let handleUnfriend = (item) => {
    remove(ref(db, 'friends/' + item.id)).then(()=>{
      console.log("delete")
    })
  }

  // Blocking Friends-->>
  let handleBlock = (item) => {

      if (reduxData.uid == item.senderId) {
        set(push(ref(db, 'block/')), {
          blockId : item.senderId,
          blockName : item.senderName,
          blockById : item.reciverId,
          blockbyName : item.recieverName,
         
        }).then(()=> {
          remove(ref(db, 'friends/' + item.id)).then(()=>{
            console.log("delete")
          })
        })
      } else {
        set(push(ref(db, 'block/')),{
          blockId : item.reciverId,
          blockName : item.recieverName,
          blockById : item.senderId,
          blockbyName : item.senderName,
         
        }).then(()=> {
          remove(ref(db, 'friends/' + item.id)).then(()=>{
            console.log("delete")
          })
        })
      
      }

console.log(item)
    
  }

  // searce friends
  let handleSearce = (e) => {
    let arr = []
    friends.filter((item)=> {
      if (item.recieverName.toLowerCase().includes(e.target.value.toLowerCase())){
        arr.push(item)
      }
    })
    setSearce(arr)
  }

  //back to user page-->>
  let handleFind = () => {
    navigate('/home/users')
  }

  return (
    <>
      <Container>
        <div className='md:h-550 h-[500px] overflow-y-auto bg-light md:overflow-y-auto'>
          <div className='searce w-[50%] mx-auto'>
              <Searce placeholder='search friends' onChange={handleSearce} name='searce'/> 
          </div>
          <div className='flex flex-wrap justify-evenly overflow-y-auto mx-auto '>
            {searce.length < 1
            ?
            friends.length > 0 ?
            friends.map((item)=>(
              <div className='md:w-[25%] w-[70%] shadow-primary shadow md:m-2.5 mx-auto rounded-md text-center p-2.5'>
                  <div className='p-5'>
                    <Imgaes src='../src/assets/profile.jpg' className='w-full h-full cursor-pointer rounded-[50%]'/>
                  </div>
                  <div>
                    {(item.senderId == reduxData.uid) 
                    ?
                    <h2 className='text-[16px] text-primary font-raleway font-bold py-2.5'>{item.recieverName}</h2>
                    :
                    <h2 className='text-[16px] text-primary font-raleway font-bold py-2.5'>{item.senderName}</h2>
                    }
                    <div className='pb-2.5'>
                      <SecondarButton onClick={()=> handleUnfriend(item)}>Unfriend</SecondarButton>
                    </div>
                    <div className='pb-2.5'>
                      <SecondarButton onClick={()=> handleBlock(item)}>Block</SecondarButton>
                    </div>
                  </div>
              </div>
            ))
            :
            <>
            <AlertPage>No Friend </AlertPage>
            <FindUsers onClick={handleFind}> Find Friends , click here </FindUsers>
            </>
            :
            searce.map((item)=>(
            <div className='md:w-[25%] w-[70%] shadow-primary shadow md:m-2.5 mx-auto rounded-md text-center p-2.5'>
                <div className='p-5'>
                  <Imgaes src='../src/assets/profile.jpg' className='w-full h-full cursor-pointer rounded-[50%]'/>
                </div>
                <div>
                  {(item.senderId == reduxData.uid) 
                  ?
                  <h2 className='text-[16px] text-primary font-raleway font-bold py-2.5'>{item.recieverName}</h2>
                  :
                  <h2 className='text-[16px] text-primary font-raleway font-bold py-2.5'>{item.senderName}</h2>
                  }
                  <div className='pb-2.5'>
                    <SecondarButton onClick={()=> handleUnfriend(item)}>Unfriend</SecondarButton>
                  </div>
                  <div className='pb-2.5'>
                    <SecondarButton onClick={()=> handleBlock(item)}>Block</SecondarButton>
                  </div>
                </div>
            </div>
            ))}
          </div>  
        </div>
      </Container>
    </>
  )
}

export default Friends