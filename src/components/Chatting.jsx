import React, { useEffect, useState,createRef} from 'react'
import Imgaes from './Imgaes'
import InputBox from './InputBox';
import Button from './Button';
import { useDispatch, useSelector } from 'react-redux';
import { getDatabase, onValue, push, ref, set, update } from 'firebase/database';
import { activeChatUser } from '../redux/slices/chatSlice';
import moment from 'moment';
import ScrollToBottom from 'react-scroll-to-bottom';
import { CiCamera, CiVoicemail } from "react-icons/ci";
import { MdKeyboardVoice } from "react-icons/md";
import { TbPhotoSquareRounded } from "react-icons/tb";
import Popup from './Popup';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref as sref, uploadString ,getDownloadURL,uploadBytes } from "firebase/storage";
import 'react-html5-camera-photo/build/css/index.css';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import { Link } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";

const Chatting = () => {
    let db = getDatabase()
    const storage = getStorage();
    let chatdata = useSelector(state=> state.userChatdata.chatInfo)
    let data = useSelector(state=> state.userdata.userInfo)
    let dispatch = useDispatch()
    let [message, setMessage] = useState('')
    let [messagError, setMessagerror] = useState('')
    let [messageList, setMessageList] = useState([])
    let [groupMessage, setGroupmessage] = useState([])

    //PHOTO STATE
    let [photoPopup, setPhotoPopup] = useState(false)

    //camera state
    let [camera,setCamera] = useState(false)
    let [emoji,setEmoji] = useState(false)
  
    // message value set 
    let handlMsgValue = (e) => {
        setMessage(e.target.value)
        setMessagerror('')
    }
  
    //message send to friends and groups
    let handleMessageSend = () => {
        if(chatdata.status == 'friendsmsg'){
            if(message == ''){
                setMessagerror(messagError)
                console.log(messagError)
            }else{
                set(push(ref(db, 'friendMsg')),{
                    senderId: data.uid,
                    senderName: data.displayName,
                    recieverId: data.uid == chatdata.senderId 
                    ?
                    chatdata.reciverId 
                    :
                    chatdata.senderId ,

                    recieverName: data.uid == chatdata.senderId 
                    ?
                    chatdata.recieverName 
                    :
                    chatdata.senderName ,
                    message: message,
                    date: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                }).then((e)=>{
                    console.log('id', chatdata.id)
                    setMessage('')
                    update((ref(db,'friends/' + chatdata.id)),{
                        lastmsg:message
                    })
                    
                })
            }
        } else {
            if(message == ''){
                setMessagerror(messagError)
                console.log(messagError)
            }else{
                set(push(ref(db, 'groupMessag')),{
                    senderId: data.uid,
                    senderName: data.displayName,
                    recieverId:chatdata.id,
                    recieverName:chatdata.groupName  ,
                    message: message,
                    date: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                }).then((e)=>{
                    setMessage('')  
                    update((ref(db,'groups/' + chatdata.id)),{
                        lastmsg:message
                    })       
                })
            }
        }
    }
    //

    //message send by keypress
    let handleMessagekey = (e) =>{
        if(e.key == "Enter"){
            if(chatdata.status == 'friendsmsg'){
                if(message == ''){
                    setMessagerror(messagError)
                    console.log(messagError)
                }else{
                    set(push(ref(db, 'friendMsg')),{
                        senderId: data.uid,
                        senderName: data.displayName,
                        recieverId: data.uid == chatdata.senderId 
                        ?
                        chatdata.reciverId 
                        :
                        chatdata.senderId ,
    
                        recieverName: data.uid == chatdata.senderId 
                        ?
                        chatdata.recieverName 
                        :
                        chatdata.senderName ,
                        message: message,
                        date: `${new Date().getFullYear()}-${
                            new Date().getMonth() + 1
                        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                    }).then((e)=>{
                        console.log('id', chatdata.id)
                        setMessage('')
                        update((ref(db,'friends/' + chatdata.id)),{
                            lastmsg:message
                        })
                        
                    })
                }
            } else {
                if(message == ''){
                    setMessagerror(messagError)
                    console.log(messagError)
                }else{
                    set(push(ref(db, 'groupMessag')),{
                        senderId: data.uid,
                        senderName: data.displayName,
                        recieverId:chatdata.id,
                        recieverName:chatdata.groupName  ,
                        message: message,
                        date: `${new Date().getFullYear()}-${
                            new Date().getMonth() + 1
                        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                    }).then((e)=>{
                        setMessage('')  
                        update((ref(db,'groups/' + chatdata.id)),{
                            lastmsg:message
                        })         
                    })
                }
            }
        }
    }

    // chat data from friends
    useEffect (()=>{

        onValue(ref(db,'friendMsg'),(snapshot) => {
            let arr = []
            let chatid = chatdata.reciverId == data.uid 
            ?
            chatdata.senderId
            :
            chatdata.reciverId

            snapshot.forEach((item) => {

                if( (item.val().senderId == data.uid && item.val().recieverId == chatid) 
                || (item.val().senderId == chatid && item.val().recieverId == data.uid )){

                    arr.push({...item.val(), id:item.key})
                }
            })
            setMessageList(arr)
        })
    },[chatdata])
    
    // chat data from groups
    useEffect(()=>{
        onValue(ref(db,'groupMessag'),(snapshot)=>{
            let arr = []
            snapshot.forEach((item)=>{
                arr.push(item.val())
            })
            setGroupmessage(arr)
        })
    },[chatdata])
    
    // -----photo starts-------
    let handlePhotoChange = (e) => {

        const storageRef = sref(storage,`chatImages/, ${e.target.files[0].name}`);
        uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
        
          getDownloadURL(storageRef)
          .then((downloadURL)=>{
  
            if(chatdata.status == 'friendsmsg'){

                set(push(ref(db, 'friendMsg')),{
                    senderId: data.uid,
                    senderName: data.displayName,
                    recieverId: data.uid == chatdata.senderId 
                    ?
                    chatdata.reciverId 
                    :
                    chatdata.senderId ,

                    recieverName: data.uid == chatdata.senderId 
                    ?
                    chatdata.recieverName 
                    :
                    chatdata.senderName ,
                    chatImages: downloadURL ,
                    date: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                }).then((e)=>{
                    setMessage('') 
                })
            } else {
                set(push(ref(db, 'groupMessag')),{
                    senderId: data.uid,
                    senderName: data.displayName,
                    recieverId:chatdata.id,
                    recieverName:chatdata.groupName  ,
                    chatImages: downloadURL ,
                    date: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                }).then((e)=>{
                    setMessage('') 
                         
                })
            }
          })
        });

    }  
    
    let handleImagePopup = (item) => {
        console.log(item)
        setPhotoPopup(!photoPopup)
    }
    // -----photo ends-------

    //----camera starts-------
    let handleCamera = () => {
        setCamera(!camera)
    }
    let handleCloseCamera = () => {
        setCamera(false)
    }
    function handleTakePhoto (dataUri) {
        const storage = getStorage();
        const storageRef = sref(storage, `camera/ ${chatdata.id} `);
        // Do stuff with the photo...
        const message4 = dataUri;
        uploadString(storageRef, message4, 'data_url').then((snapshot) => {
            getDownloadURL(storageRef)
            .then((downloadURL)=>{
    
              if(chatdata.status == 'friendsmsg'){
  
                  set(push(ref(db, 'friendMsg')),{
                      senderId: data.uid,
                      senderName: data.displayName,
                      recieverId: data.uid == chatdata.senderId 
                      ?
                      chatdata.reciverId 
                      :
                      chatdata.senderId ,
  
                      recieverName: data.uid == chatdata.senderId 
                      ?
                      chatdata.recieverName 
                      :
                      chatdata.senderName ,
                      chatImages: downloadURL ,
                      date: `${new Date().getFullYear()}-${
                          new Date().getMonth() + 1
                      }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                  }).then((e)=>{
                      
                  })
              } else {
                set(push(ref(db, 'groupMessag')),{
                    senderId: data.uid,
                    senderName: data.displayName,
                    recieverId:chatdata.id,
                    recieverName:chatdata.groupName  ,
                    chatImages: downloadURL ,
                    date: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                }).then((e)=>{
                    console.log('id', chatdata.id)
                    setMessage('')         
                })
              }
            })
        });
        console.log(dataUri);
    }
    
    function handleTakePhotoAnimationDone (dataUri) {
    setTimeout(() => {
        setCamera(false)
    }, 500);
    }
    // -------camera ends------

    // ---------emoji starts--------
    let handleEmoji = () => {
        setEmoji(!emoji)
    }
    let handleEMojisPicker = (e) => {
        setMessage(message => message+e.emoji)

        setTimeout(() => {  
            setEmoji(false)
        }, 1000);
       
    }
    // ---------emoji ends--------
   
  
 
  return (
    <>
    <div className='shadow-primary shadow p-2 rounded-md h-full overflow-y-auto relative'>
        <div className='chat_header border-b-2 rounded-b-2xl rounded-r-2xl p-2.5' >
            <div className='md:w-[80px] md:h-[80px] w-[50px] h-[50px] rounded-md border-[5px] border-primary center mx-auto mb-2'>
                <Imgaes src='../src/assets/profile.jpg' className='w-full h-full'/>
            </div>
            { 
            ( data.uid == chatdata.senderId )
            ?
            <h2 className='md:text-[16px] text-[12px] text-primary text-center font-raleway font-semibold capitalize'>{chatdata.recieverName}</h2>
            :
            ( data.uid == chatdata.reciverId )
            ?
            <h2 className='md:text-[16px] text-[12px] text-primary text-center font-raleway font-semibold capitalize'>{chatdata.recieverName}</h2>
           :
           ( data.uid == chatdata.adminId )
           ?
           <h2 className='md:text-[16px] text-[12px] text-primary text-center font-raleway font-semibold capitalize'>{chatdata.groupName}</h2>
           : 
           ( data.uid !== chatdata.adminId )
           ?
           <h2 className='md:text-[16px] text-[12px] text-primary text-center font-raleway font-semibold capitalize'>{chatdata.groupName}</h2> 
            :
           <h2 className='md:text-[16px] text-[12px] text-primary text-center font-raleway font-semibold capitalize'>users</h2> 

            }
            <p className='font-sans md:text-[14px] text-[8px] text-primary font-normal'>active</p>
        </div>
        <ScrollToBottom className='chating h-[250px] mb-3 '>   
            { (chatdata.status == 'friendsmsg') ?
            messageList.map((item)=>(
                item.senderId == data.uid 
                ?
                <div className='chat__right text-right ml-auto msg_sender md:px-2 px-1 w-[70%]'>
                    {(item.message)
                    ?
                    <div className=''>
                        <p className='md:p-2.5 p-1 bg-primary shadow-sm shadow-primary inline-block rounded-lg font-raleway font-normal text-[12px] text-light my-1 message__overflow' >{item.message}
                        </p>
                        <p className='text-[10px] text-being font-sans font-normal'>
                            {moment(item.date, ' h:mm:ss a').fromNow()}
                        </p>
                    </div>
                    : (item.chatImages) ?
                    <>
                    <div className='w-[100px] h-[100px] ml-auto py-1' onClick={()=>handleImagePopup(item)}>
                        <Link > 
                            <Imgaes src={item.chatImages} className='w-full h-full rounded-md'/>
                        </Link>
                    </div>
                    {photoPopup &&
                    <Popup>
                            <div className='w-full h-[250px] bg-light' >
                            <Link > 
                                <Imgaes src={item.chatImages} className='w-full h-full rounded-md'/>
                            </Link>
                        </div>
                            <IoMdClose onClick={()=>setPhotoPopup(false)} className='w-[40px] h-[40px] mx-auto my-2.5 text-primary rounded-[50%] shadow-md '/>
                    </Popup>
                    }
                    </>
                    :
                    <h2>dwd</h2>
                    }
                   
                </div>
                :
                <div className='chat__left text-left w-[60%] mr-auto msg__reciever md:px-2 px-1'>
                     {item.message
                    ?
                    <>
                     <p className='md:p-2.5 p-1 bg-light shadow-sm shadow-primary inline-block rounded-lg font-raleway font-normal text-[12px] text-primary my-1 message__overflow'>{item.message}
                    </p>
                    <p className='text-[10px] text-being font-sans font-normal'>
                        {moment(item.date, ' h:mm:ss a').fromNow()}
                    </p>
                    </>
                    :
                    <div className='w-[100px] h-[100px] mr-auto py-1'>
                        <Imgaes src={item.chatImages} className='w-full h-full rounded-md'/>
                    </div>
                    } 
                </div>
            ))
            :
            groupMessage.map((item)=>(
                item.senderId == data.uid ? item.recieverId == chatdata.id &&
                
                <div className='chat__right text-right ml-auto msg_sender md:px-2 px-1 w-[70%]'>
                    {(item.message)
                    ?
                    <div className=''>
                        <p className='md:p-2.5 p-1 bg-primary shadow-sm shadow-primary inline-block rounded-lg font-raleway font-normal text-[12px] text-light my-1 message__overflow' >{item.message}
                        </p>
                        <p className='text-[10px] text-being font-sans font-normal'>
                            {moment(item.date, ' h:mm:ss a').fromNow()}
                        </p>
                    </div>
                    : (item.chatImages) ?
                    <>
                    <div className='w-[100px] h-[100px] ml-auto py-1' onClick={()=>handleImagePopup(item)}>
                        <Link > 
                            <Imgaes src={item.chatImages} className='w-full h-full rounded-md'/>
                        </Link>
                    </div>
                    {photoPopup &&
                    <Popup>
                            <div className='w-full h-[250px] bg-light' >
                            <Link > 
                                <Imgaes src={item.chatImages} className='w-full h-full rounded-md'/>
                            </Link>
                        </div>
                            <IoMdClose onClick={()=>setPhotoPopup(false)} className='w-[40px] h-[40px] mx-auto my-2.5 text-primary rounded-[50%] shadow-md '/>
                    </Popup>
                    }
                    </>
                    :
                    <h2>dwd</h2>
                    }
                    <p className='text-[10px] text-being font-sans font-semibold'>{item.senderName}</p>
                   
                </div>
                :  item.recieverId == chatdata.id &&
                <div className='chat__left text-left w-[60%] mr-auto msg__reciever md:px-2 px-1'>
                     {item.message
                    ?
                    <>
                     <p className='md:p-2.5 p-1 bg-light shadow-sm shadow-primary inline-block rounded-lg font-raleway font-normal text-[12px] text-primary my-1 message__overflow'>{item.message}
                    </p>
                    <p className='text-[10px] text-being font-sans font-normal'>
                        {moment(item.date, ' h:mm:ss a').fromNow()}
                    </p>
                    </>
                    :
                    <div className='w-[100px] h-[100px] mr-auto py-1'>
                        <Imgaes src={item.chatImages} className='w-full h-full rounded-md'/>
                    </div>
                    } 
                      <p className='text-[10px] text-being font-sans font-semibold '>{item.recieverName}</p>
                </div>
            ))
           
            }
        </ScrollToBottom>
        <div className='flex items-center justify-between w-[95%] absolute bottom-0 gap-x-2'>
            <div className='w-[70%] send__box' onKeyUp={handleMessagekey}>
                <div className='w-[100%]'>
                    <InputBox type='text' onChange={handlMsgValue} name='sends' value={message} placeholder='message' />
                </div>
            </div>
            <div className='p-2 bg-primary text-light rounded-md hover:bg-dark' onClick={handleEmoji}>
                <MdOutlineEmojiEmotions/>
            </div>
            <div className='p-2 bg-primary text-light rounded-md hover:bg-dark' onClick={handleCamera}>
                <CiCamera/>
            </div>
            <div className='p-2 bg-primary text-light rounded-md hover:bg-dark' >
                <label>
                    < TbPhotoSquareRounded/>
                    <div className='hidden'>
                        <InputBox type="file" onChange={handlePhotoChange}/>
                    </div>
                </label>
            </div>
            <div className='p-2 bg-primary text-light rounded-md hover:bg-dark'>
                <MdKeyboardVoice/>
            </div>
            <div className='send__box hover:bg-dark rounded-lg'>
                <div onClick={handleMessageSend} >
                    <Button>send</Button>
                </div>
            </div>
        </div>
    </div>
   
    {camera &&
    <div className='w-[400px] absolute top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-light rounded-2xl border-primary border-[5px]'>
        <Camera
        onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
        onTakePhotoAnimationDone = { (dataUri) => { handleTakePhotoAnimationDone(dataUri); } }
        idealFacingMode = {FACING_MODES.ENVIRONMENT}
        idealResolution = {{width: 300, height: 200}}
        imageType = {IMAGE_TYPES.JPG}
        imageCompression = {0.97}
        isMaxResolution = {false}
        isImageMirror = {true}
        isSilentMode = {false}
        isDisplayStartCameraError = {false}
        sizeFactor = {1}
        />
        <div >
            <IoMdClose onClick={handleCloseCamera} className='w-[40px] h-[40px] mx-auto my-2.5 text-secondary bg-light rounded-[50%] shadow-md shadow-primary '/>
        </div>
    </div>
    }

    {emoji &&
        <EmojiPicker onEmojiClick={(e)=>handleEMojisPicker(e)}/>
    }
   

    </>
  )
}

export default Chatting