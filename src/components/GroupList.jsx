import React, { useEffect, useState } from 'react'
import { getDatabase , push, set, ref, onValue, remove} from 'firebase/database'
import { useSelector } from 'react-redux'
import Button from './Button'
import Imgaes from './Imgaes'
import GroupHeader from './GroupHeader'
import AlertPage from './AlertPage'


const GroupList = () => {
    let db = getDatabase()
    let data = useSelector(state => state.userdata.userInfo)
    let [grouplist,setgroupList] = useState([])
    let [pending, setPending] = useState([])
    let [member, setMember] = useState([])
    let [searceGroupList,setSearceGroupList] = useState([])


    useEffect(()=>{
        let groupRef = ref(db, 'groups')

        onValue(groupRef,(snapshot)=>{
        let arr = []
        snapshot.forEach((item)=>{
          if(data.uid !== item.val().adminId){
            arr.push({...item.val(), id:item.key})
          }
        })
        setgroupList(arr)
         })
    },[])

    // group request
    let handleGroupJoin = (item) => {
        set(push(ref(db, 'groupRequest/')),{
            groupId: item.id,
            groupName: item.groupName,
            userId: data.uid,
            userName: data.displayName
        })
       
        console.log(item)
        console.log('request sent')
    }

    // group request pending
    useEffect(()=>{
        onValue(ref(db, 'groupRequest/'),(snapshot)=>{
            let arr = []
            snapshot.forEach((item)=>{
                if(data.uid == item.val().userId){
                    arr.push(item.val().groupId)
                }
            })
            setPending(arr)
        })
    },[])


    // group member
    useEffect(()=>{
        onValue(ref(db, 'groupMember'),(snapshot)=>{
            let arr = []
            snapshot.forEach((item)=>{
                if(data.uid == item.val().userId){
                    arr.push(item.val().groupId)
                }
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

  return (
    <>
        <div className='shadow-primary shadow p-2 rounded-md h-full overflow-y-auto'>
            <GroupHeader onChange={handleSearceList} title='Groups List' placeholders='searce groups'/>
            {searceGroupList.length < 1 
            ?
            grouplist.length > 0
            ?
            grouplist.map((item,i)=>(
                <div key={i} className='p-2.5 m-2 shadow-primary shadow-sm rounder-md groupList__item'>
                    <div className='flex justify-between items-center group__contents'>
                        <div className='profiles flex items-center'>
                            <div className='md:w-[100px] w-[50px] md:h-[100px] h-[50px]'>
                                <Imgaes src='../src/assets/profile.jpg' className='w-full h-full rounded-md'/>
                            </div>
                            <div className='text-left capitalize'>
                                <h2 className='xl:text-[16px] text-[14px] text-primary font-raleway font-semibold px-4'>{item.groupName}</h2>
                                <p className='xl:text-[14px] text-[12px] text-primary font-raleway font-normal px-4'>{item.groupTag}</p>
                                <p className='xl:text-[12px] text-[10px] text-primary font-raleway font-normal px-4'>{item.adminName}</p>
                            </div>
                            </div>
                        <div className='flex '>
                            {
                            pending.includes(item.id) 
                            ?
                            <div >
                                <Button>pending</Button>
                            </div>
                            :     
                            member.includes(item.id)
                            ?
                            <div className='flex'>
                                <div className='px-2' >
                                    <Button>member</Button>
                                </div>
                                <div className='px-2' >
                                    <Button>chat</Button>
                                </div>
                            </div>
                            :
                            <div onClick={()=>handleGroupJoin(item)}>
                                <Button>join</Button>
                            </div>
                            }
                        
                        
                        </div>
                    </div>
                </div>
            ))
            :
            <>
            <AlertPage>No groups </AlertPage>
            </>
            :
            searceGroupList.map((item,i)=>(
                <div key={i} className='p-2.5 m-2 shadow-primary shadow-sm rounder-md groupList__item'>
                    <div className='flex justify-between items-center group__contents'>
                        <div className='profiles flex items-center'>
                            <div className='md:w-[100px] w-[50px] md:h-[100px] h-[50px]'>
                                <Imgaes src='../src/assets/profile.jpg' className='w-full h-full rounded-md'/>
                            </div>
                            <div className='text-left capitalize'>
                            <h2 className='xl:text-[16px] text-[14px] text-primary font-raleway font-semibold px-4'>{item.groupName}</h2>
                                <p className='xl:text-[14px] text-[12px] text-primary font-raleway font-normal px-4'>{item.groupTag}</p>
                                <p className='xl:text-[12px] text-[10px] text-primary font-raleway font-normal px-4'>{item.adminName}</p>
                            </div>
                        </div>
                        <div className='flex'>
                            {
                            pending.includes(item.id) 
                            ?
                            <div >
                                <Button>pending</Button>
                            </div>
                            :     
                            member.includes(item.id)
                            ?
                            <div className='flex'>
                                <div className='px-2' >
                                    <Button>member</Button>
                                </div>
                                <div className='px-2' >
                                    <Button>chat</Button>
                                </div>
                            </div>
                            :
                            <div onClick={()=>handleGroupJoin(item)}>
                                <Button>join</Button>
                            </div>
                            }
                        
                        
                        </div>
                    </div>
                </div>
            ))
            }
        </div>
    </>
  )
}

export default GroupList