import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from './Button'
import GroupHeader from './GroupHeader'
import { getDatabase , push, set, ref, onValue, remove} from 'firebase/database'
import Imgaes from './Imgaes'
import { activeChatUser } from '../redux/slices/chatSlice'
import AlertPage from './AlertPage'


const Chatgroup = () => {
    let db = getDatabase()
    let data = useSelector(state => state.userdata.userInfo)
    let dispatch = useDispatch()
    let [grouplist,setgroupList] = useState([])
    let [searceGroupList,setSearceGroupList] = useState([])
    let [member, setMember] = useState([])


    useEffect(()=>{
        let groupRef = ref(db, 'groups')

        onValue(groupRef,(snapshot)=>{
        let arr = []
        snapshot.forEach((item)=>{
          if(data.uid == item.val().adminId){
            arr.push({...item.val(), id:item.key})
          }else if (member.includes(item.key + data.uid)){
            arr.push({...item.val(), id:item.key})
          }
        })
        setgroupList(arr)
         })
    },[member.length])

    
    // group member
    useEffect(()=>{
        onValue(ref(db, 'groupMember'),(snapshot)=>{
            let arr = []
            snapshot.forEach((item)=>{

                arr.push(item.val().groupId + item.val().userId)
            })
            setMember(arr)
        })
    },[])

    // searce group list
    let handleSearceList = (e) => {
        let arr = []
        grouplist.filter((item) => {
            if(item.groupName.toLowerCase().includes(e.target.value.toLowerCase())){
            arr.push(item)
            }
        })
        setSearceGroupList(arr)
    }

    // group data 
    let handleGroupList = (item) =>{
        dispatch(activeChatUser({...item, status:'groupMassage'}))
        console.log(item)
    }

  return (
    <>
    <div className='shadow-primary shadow p-2 rounded-md h-full overflow-y-auto groupList'>
        <GroupHeader onChange={handleSearceList} title='Groups List'  placeholders='searce groups'/>
        {searceGroupList.length < 1 
        ?
        grouplist.length > 0
        ?
        grouplist.map((item, i)=>(
            <div key={i} className='p-2.5 m-2 shadow-primary shadow-sm rounder-md groupList__item' onClick={()=>handleGroupList(item)}>
                <div className='flex justify-between items-center group__contents'>
                    <div className='profiles flex items-center'>
                        <div className='md:w-[100px] w-[50px] md:h-[100px] h-[50px]'>
                            <Imgaes src='../src/assets/profile.jpg' className='w-full h-full rounded-md'/>
                        </div>
                        <div className='text-left capitalize'>
                            <h2 className='text-[16px] text-primary font-raleway font-semibold px-4'>{item.groupName}</h2>
                            <p className='md:text-[12px] text-[12px] text-primary font-raleway font-normal md:px-4 px-2.5 truncate text-ellipsis w-[100px]'>{item.lastmsg}</p>
                            <p className='text-[12px] text-primary font-raleway font-normal px-4'>{item.adminName}</p>
                        </div>
                    </div>
                    <div>
                        <Button>Chat</Button>
                    </div>
                </div>
            </div>
        ))
        :
        <div className='p-2.5 w-full bg-primary mt-4 rounded-lg text-center '>
            <p className='text-light font-raleway font-semibold md:text-[18px] text-[12px] capitalize'>no groups</p>
        </div>
        :
        searceGroupList.map((item,i)=>(
            <div key={i} className='p-2.5 m-2 shadow-primary shadow-sm rounder-md groupList__item' onClick={()=>handleGroupList(item)}>
            <div className='flex justify-between items-center group__contents'>
                <div className='profiles flex items-center'>
                    <div className='md:w-[100px] w-[50px] md:h-[100px] h-[50px]'>
                        <Imgaes src='../src/assets/profile.jpg' className='w-full h-full rounded-md'/>
                    </div>
                    <div className='text-left capitalize'>
                        <h2 className='text-[16px] text-primary font-raleway font-semibold px-4'>{item.groupName}</h2>
                        <p className='md:text-[12px] text-[12px] text-primary font-raleway font-normal md:px-4 px-2.5 truncate text-ellipsis w-[100px]'>{item.lastmsg}</p>
                        <p className='text-[12px] text-primary font-raleway font-normal px-4'>{item.adminName}</p>
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

export default Chatgroup