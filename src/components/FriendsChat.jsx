import { getDatabase , push, set, ref, onValue, remove} from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { activeChatUser } from '../redux/slices/chatSlice'
import GroupHeader from './GroupHeader'
import Imgaes from './Imgaes'
import Button from './Button'
import AlertPage from './AlertPage'

const FriendsChat = () => {
    let db = getDatabase()
    let data = useSelector(state => state.userdata.userInfo)
    let dispatch = useDispatch()
    let chatdata = useSelector(state => state.userChatdata.chatInfo)
    let [friends, setfriends] = useState([])
    let [searceFriends, setSearceFriends] = useState([])
    let [msgFriends, setmsgFriends] = useState([])

    // friends info
    useEffect(()=>{
        onValue(ref(db,'friends'),(snapshot)=>{

            let arr = []

            snapshot.forEach((item)=>{

                if((data.uid == item.val().reciverId) || (data.uid == item.val().senderId)){

                    arr.push({...item.val(), id:item.key})
                }
            })
            setfriends(arr)
        })
    },[])

    // searce friends
    let handleSearce = (e) => {

        let arr = []

        friends.filter((item)=> {

        if (item.recieverName.toLowerCase().includes(e.target.value.toLowerCase())){

            arr.push(item)
        }
        })
        setSearceFriends(arr)
    }

    //freinds redux
    let handlefriends = (item) => {
        dispatch(activeChatUser({...item, status:'friendsmsg'}))
        localStorage.setItem('chatInfo', JSON.stringify(item))
    }

    useEffect (()=>{

        onValue(ref(db,'friendMsg'),(snapshot) => {

            let arr = []
            snapshot.forEach((item) => {   
                arr.push({...item.val(), id:item.key})
            })
            setmsgFriends(arr)
        })
    },[chatdata])

    useEffect(()=>{
        dispatch(activeChatUser('chatInfo'))
    },[])
  return (
    <>
      <div className='shadow-primary shadow p-2 rounded-md h-full overflow-y-auto'>
        <GroupHeader onChange={handleSearce} title=' friends List' placeholders='searce friends'/>
        {searceFriends.length < 1 
        ?
        friends.length > 0 ?
        friends.map((item, i)=>(
            <div key={i} className='p-2.5 m-2 shadow-primary shadow-sm rounder-md groupList__item' onClick={()=>handlefriends(item)}>
                <div className='flex justify-between items-center group__contents'>
                    <div className='profiles flex items-center'>
                        <div className='md:w-[100px] w-[50px] md:h-[100px] h-[50px]'>
                            <Imgaes src='../src/assets/profile.jpg' className='w-full h-full rounded-md'/>
                        </div>
                       
                        <div className='text-left capitalize'>
                            {
                                data.uid == item.reciverId 
                                ?
                                <p className='md:text-[16px] text-[12px] text-primary font-raleway font-semibold md:px-4 px-2.5'>{item.senderName}</p>
                                :
                                <p className='md:text-[16px] text-[12px] text-primary font-raleway font-normal md:px-4 px-2.5'>{item.recieverName}</p>
                            }
                            <div className='text-left capitalize'>
                                <p className='md:text-[12px] text-[12px] text-primary font-raleway font-normal md:px-4 px-2.5 truncate text-ellipsis w-[100px]'>{item.lastmsg}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button>Chat</Button>
                    </div>
                </div>
            </div>
        ))
        :
        <>
        <div className='p-2.5 w-full bg-primary mt-4 rounded-lg text-center '>
            <p className='text-light font-raleway font-semibold md:text-[18px] text-[12px] capitalize'>no friends</p>
        </div>
        </>
        :
        searceFriends.map((item)=>(
        <div key={i} className='p-2.5 m-2 shadow-primary shadow-sm rounder-md groupList__item' onClick={()=>handlefriends(item)}>
            <div className='flex justify-between items-center group__contents'>
                <div className='profiles flex items-center'>
                    <div className='md:w-[100px] w-[50px] md:h-[100px] h-[50px]'>
                        <Imgaes src='../src/assets/profile.jpg' className='w-full h-full rounded-md'/>
                    </div>
                   
                    <div className='text-left capitalize'>
                        {
                            data.uid == item.reciverId 
                            ?
                            <p className='md:text-[16px] text-[12px] text-primary font-raleway font-semibold md:px-4 px-2.5'>{item.senderName}</p>
                            :
                            <p className='md:text-[16px] text-[12px] text-primary font-raleway font-normal md:px-4 px-2.5'>{item.recieverName}</p>
                        }
                        <div className='text-left capitalize'>
                            <p className='md:text-[12px] text-[12px] text-primary font-raleway font-normal md:px-4 px-2.5 truncate text-ellipsis w-[100px]'>{item.lastmsg}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <Button>Chat</Button>
                </div>
            </div>
        </div>
        ))
        }
    </div>   
    </>
  )
}

export default FriendsChat