import React, { useEffect, useRef, useState } from 'react'
import Container from '../components/Container'
import Imgaes from '../components/Imgaes'
import Button from '../components/Button'
import { useSelector } from 'react-redux'
import {  useNavigate } from 'react-router-dom'
import Popup from '../components/Popup'
import InputBox from './../components/InputBox';
import { IoMdClose } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { getDatabase, ref, onValue, remove, set, push } from "firebase/database";
import { Oval } from 'react-loader-spinner'
import ALert from './../components/ALert';
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import Searce from '../components/Searce'
import GroupHeader from './GroupHeader'
import AlertPage from './AlertPage'
import FindUsers from './FindUsers'

const MyGroup = () => {
    let db = getDatabase()
    let data = useSelector(state=> state.userdata.userInfo)
    let navigate = useNavigate()
    
  //GROUP STATE
    let [group, setgroup] = useState([])

  //group popup state
    let [popup, setpopup] = useState(false)
    let [waiting, setwaiting] = useState(false)
    let [checkgrp, setcheckgrp] = useState(false)
    let [creatagain, setcreatagain] = useState(false)

    let [groupData, setGroupdata] = useState({
    groupName:'',
    groupTag:''
    })
    let [groupError, setGrouperror] = useState({
    groupName:'',
    groupTag:''
    })

    // request popup
    let [groupRequestPopup , setgroupRequestPopup] = useState(false)
    let [groupRequest, setGroupRequest] = useState([])
    
    // member modal state
    let [member, setMember] = useState([])
    let [memberPopup, setMemberPopup] = useState(false)

    //searce state
    let [searce, setSearce] = useState([])



// ------------create group popup starts----------//
    // close popup
    let handleCloseGroup = () => {
        setpopup(!popup)
    }

    // create groups inputs
    let handleGroupChange = (e) => {
        let {name, value} = e.target
        setGroupdata({...groupData, [name]:value})
        setGrouperror({...groupError, [name] : ''})
    }

    // create groups
    let handleCreatGroup = (e) => {
        setcreatagain(false)
        if(groupData.groupName == ''){
        setGrouperror({...groupError, groupName:'Group name required'})
        } else if (groupData.groupTag == '') {
        setGrouperror({...groupError, groupTag:'Group Tag required'})
        } else{
        setGroupdata({...groupData, [e.target.name]:e.target.value})
        
        set(push(ref(db,'groups/')),{
            groupName : groupData.groupName,
            groupTag: groupData.groupTag,
            adminName: data.displayName,
            adminId : data.uid
        }).then(()=>{
        
            setTimeout(() => {
            setwaiting(true)        
            }, 500);
        }).then(()=>{
            setTimeout(() => {
            setcheckgrp(true)
            }, 1000);
        })
        .then(()=>{
            setTimeout(() => {
            setpopup(false)
            }, 2000);
        }).then(()=>{
            setTimeout(() => {
            setcreatagain(true)
            }, 2000);
        })
        }
    }
  
    // fetch group data from database for my group
    useEffect(()=>{
      let groupRef = ref(db, 'groups')
      onValue(groupRef,(snapshot)=>{
          let arr = []
          snapshot.forEach((item)=>{
            if(data.uid == item.val().adminId){
              arr.push({...item.val(), id:item.key})
            }
          })

          setgroup(arr)
      })
    },[])

// ------------create group popup ends----------//

//  -------------group request starts ------------//
let handleGroupreqPopup = (id) =>{

  setgroupRequestPopup(true)

  onValue(ref(db,'groupRequest/'), (snapshot)=>{
    let arr = []
    snapshot.forEach((item)=> {
      if(item.val().groupId == id){
        arr.push({...item.val(), id:item.key})
       
      }
    })
    console.log(arr)
    setGroupRequest(arr)
  })
  console.log(id)
   
}
let handleCreatGroupClose = () => { // modal close
  setgroupRequestPopup(!groupRequestPopup)
}

//  -------------group request ends------------//

//member request accept
let handleAcceptRequest = (item) => {
    set(push(ref(db, '/groupMember')),{
    groupId : item.groupId,
    groupName: item.groupName,
    userId : item.userId,
    userName: item.userName,
    id:item.id
  }).then(()=>{
    remove(ref(db,'groupRequest/'+ item.id)).then(()=>{
      setTimeout(() => {
        setgroupRequestPopup(false)
      }, 500);
    })
  })
}

//member request removed
let handleRemoveRequest = (item) => {
  console.log(item.id)
  remove(ref(db,'groupRequest/'+item.id))
}


// member modal open starts----->>>
let handleMember = (id) =>{
  setMemberPopup(true)
  let memberRef = ref(db, 'groupMember')
  onValue(memberRef, (snapshot)=>{
    let arr = []
    snapshot.forEach((item)=> {
     
      if(item.val().groupId == id){

        arr.push({...item.val(), id:item.key})
      }
      
  })
  setMember(arr)
  console.log(member)
  })
}

// close member popup
let handleMmeberClose = () => {
  setMemberPopup(!memberPopup)
}

// remove member
let handleMemberRemove = (item)=>{
  console.log(item)
  remove(ref(db,'groupMember/'+ item.id)).then(()=>{
    setTimeout(() => {
      setMemberPopup(false)
    }, 1000);
  })
}

// member modal open end----->>>

  // searce my group
  let handleSearce = (e) => {
    let arr = []
    group.filter((item) => {
      if(item.groupName.toLowerCase().includes(e.target.value.toLowerCase())){
        arr.push(item)
      }
    })
    setSearce(arr)
  }


  return (
    <>
        <div className='shadow-primary shadow p-2 rounded-md h-full overflow-y-auto'>
           
            <GroupHeader onChange={handleSearce} title='My group' placeholders='searce groups'>
               <Button onClick={handleCloseGroup}>create Groups</Button>
            </GroupHeader>
            {searce.length < 1
            ?
            group.length > 0 ?

            group.map((item)=>(
              <div className='group__items p-2.5 m-2 shadow-primary shadow-sm rounder-md'>
                  <div className='flex justify-between items-center group__contents'>
                  <div className='profiles flex items-center'>
                      <div className='md:w-[100px] w-[50px] md:h-[100px] h-[50px]'>
                          <Imgaes src='../src/assets/profile.jpg' className='w-full h-full  rounded-md'/>
                      </div>
                      <div className='text-left capitalize'>
                          <h2 className='xl:text-[16px] text-[14px] text-primary font-raleway font-semibold px-4'>{item.groupName}</h2>
                          <p className='xl:text-[14px] text-[12px] text-primary font-raleway font-normal px-4'>{item.groupTag}</p>
                          <p className='xl:text-[12px] text-[10px] text-primary font-raleway font-normal px-4'>{item.adminName}</p>
                      </div>
                  </div>
                  <div className='sm:flex'>
                      <div className='px-2' onClick={()=>handleGroupreqPopup(item.id)}>
                          <Button>request</Button>
                      </div>
                      <div className='sm:px-2 sm:py-0 py-2' onClick={()=>handleMember(item.id)}>
                          <Button>member</Button>
                      </div >
                      <div className='px-2'>
                          <Button>chat</Button>
                      </div>
                  </div>
                  </div>
              </div>
            ))
            :
            <>
            <AlertPage>No groups </AlertPage>
            </>
            :
            searce.map((item)=>(
            <div className='group__items p-2.5 m-2 shadow-primary shadow-sm rounder-md'>
              <div className='flex justify-between items-center group__contents'>
              <div className='profiles flex items-center'>
                  <div className='md:w-[100px] w-[50px] md:h-[100px] h-[50px]'>
                      <Imgaes src='../src/assets/profile.jpg' className='w-full h-full  rounded-md'/>
                  </div>
                  <div className='text-left capitalize'>
                      <h2 className='md:text-[16px] text-[12px] text-primary font-raleway font-semibold px-4'>{item.groupName}</h2>
                      <p className='md:text-[14px] text-[12px] text-primary font-raleway font-normal px-4'>{item.groupTag}</p>
                      <p className='md:text-[12px] text-[10px] text-primary font-raleway font-normal px-4'>{item.adminName}</p>
                  </div>
              </div>
              <div className='flex'>
                  <div className='px-2' onClick={()=>handleGroupreqPopup(item.id)}>
                      <Button>request</Button>
                  </div>
                  <div className='px-2' onClick={()=>handleMember(item.id)}>
                      <Button>member</Button>
                  </div >
                  <div className='px-2'>
                      <Button>chat</Button>
                  </div>
              </div>
              </div>
            </div>
            ))
            }
        </div>

        {/*---create group popup starts---*/}
        {popup &&
        <Popup >
            <FaArrowLeft onClick={handleCloseGroup} className='ml-auto text-primary'/>
            <InputBox type='text' name='groupName' onChange={handleGroupChange} placeholder='Group Name'/>
            { groupError.groupName &&
            <ALert>
              {groupError.groupName}
            </ALert>
            }
            <InputBox type='text' name='groupTag' onChange={handleGroupChange} placeholder='Group tag'/>
            { groupError.groupTag &&
            <ALert>
              {groupError.groupTag}
            </ALert>
            }
            {creatagain 
            ?
            <Button onClick={handleCreatGroup}> Create group</Button>
            :
            checkgrp 
            ?
            <div className='flex justify-center my-2'>
              <IoCheckmarkDoneOutline className='text-primary text-[32px] rounded-[50%] shadow-md shadow-primary'/>
            </div>
            :
              waiting
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
              <Button onClick={handleCreatGroup}> Create group</Button>
            }
            
            <IoMdClose onClick={handleCloseGroup} className='w-[40px] h-[40px] mx-auto my-2.5 text-rose-600 rounded-[50%] shadow-md shadow-primary'/>
            
        </Popup>
        } 
        {/*---create group popup ends---*/}
        {/* group request popup starts */}
         {groupRequestPopup &&
         <Popup>
            <FaArrowLeft onClick={handleCreatGroupClose} className='ml-auto text-primary'/>
              {
                groupRequest.map((item)=>(
                  <div className='group__items p-2.5 m-2 shadow-primary shadow-sm rounder-md '>
                  <div className='flex justify-between items-center group__contents'>
                      <div className='profiles flex items-center'>
                          <div className='md:w-[50px] w-[30px] md:h-[50px] h-[30px]'>
                              <Imgaes src='../src/assets/profile.jpg' className='w-full h-full  rounded-md'/>
                          </div>
                          <div className='text-left capitalize'>
                              <h2 className='text-[12px] text-primary font-raleway font-semibold px-2'>{item.userName}</h2>
                          </div>
                      </div>
                      <div className='flex gap-x-1'> 
                        <div className='p-2 border border-primary rounded-md' onClick={()=> handleAcceptRequest(item)}>
                          <FaCheck className=' text-primary'/>
                        </div>
                        <div className='p-2 border border-primary rounded-md ' onClick={()=> handleRemoveRequest(item)}>
                          <MdClose className=' text-secondary'/>
                        </div>
                      </div>
                  </div>
                  </div>
                ))
              }
         
            <IoMdClose onClick={handleCreatGroupClose} className='w-[40px] h-[40px] mx-auto my-2.5 text-rose-600 rounded-[50%] shadow-md shadow-primary'/>
         </Popup>
         }
        {/* group request popup ends */}

        {/* member popup acceped starts*/}
        {memberPopup &&
          <Popup>
            <FaArrowLeft onClick={handleMmeberClose} className='ml-auto text-primary'/>
            {member.map((item)=>(
              <div className='group__items p-2.5 m-2 shadow-primary shadow-sm rounder-md '>
              <div className='flex justify-between items-center group__contents'>
                  <div className='profiles flex items-center'>
                      <div className='md:w-[50px] w-[30px] md:h-[50px] h-[30px]'>
                          <Imgaes src='../src/assets/profile.jpg' className='w-full h-full  rounded-md'/>
                      </div>
                      <div className='text-left capitalize'>
                          <h2 className='text-[12px] text-primary font-raleway font-semibold px-2'>{item.userName}</h2>
                          {/* <p className='text-[14px] text-primary font-raleway font-normal px-4'>{item.groupTag}</p>
                          <p className='text-[12px] text-primary font-raleway font-normal px-4'>{item.adminName}</p> */}
                      </div>
                  </div>
                  <div className='flex gap-x-1'> 
                   
                    <div className='p-2 border border-primary rounded-md ' onClick={()=>{handleMemberRemove(item)}}>
                      <MdClose className=' text-secondary'/>
                    </div>
                  </div>
              </div>
              </div>
            ))

            }
            <IoMdClose onClick={handleMmeberClose} className='w-[40px] h-[40px] mx-auto my-2.5 text-rose-600 rounded-[50%] shadow-md shadow-primary'/>
         </Popup>
        }
        {/* member popup acceped ends */}
    </>
  )
}

export default MyGroup