import React, { useEffect, useState } from 'react'
import Container from '../components/Container'
import Imgaes from '../components/Imgaes'
import SecondarButton from '../components/SecondarButton'
import { getDatabase, ref, onValue, remove, set, push } from "firebase/database";
import { useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { Oval } from 'react-loader-spinner'
import Searce from '../components/Searce';
import { FaArrowDown } from 'react-icons/fa6';
import AlertPage from '../components/AlertPage';
import FindUsers from '../components/FindUsers';
import { useNavigate } from 'react-router-dom';



const Block = () => {
  let navigate = useNavigate()
  let db = getDatabase()
  let auth = getAuth()
  let data = useSelector(state => state.userdata.userInfo)
  let [block, setBlock] = useState([])
  let [searceblock, setSearceblock] = useState([])
  let [loader, setLoader] = useState(false)

  useEffect(()=>{

    let blockRef = ref(db, 'block')

    onValue(blockRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {
        if (item.val().blockById == data.uid){
          arr.push({
            id:item.key,
            blockId : item.val().blockId,
            blockName : item.val().blockName,
            // blockemail : item.val().blockemail,

          })
        } else {
          arr.push({
            id:item.key,
            blockbyName : item.val().blockbyName,
            blockById : item.val(). blockById,
            // blockByemail:item.val(). blockByemail
          })
        }
      })
       setBlock(arr) 
    })

  },[])
 
  // unblock
  let handleUnblock = (item) => {
  
    set(push(ref(db, 'friends/' )), {
      senderId :data.uid ,
      senderName:data.displayName , 
      reciverId : item.blockById,
      recieverName : item.blockbyName,
  }).then(()=> {
    setLoader(true)
    setTimeout(() => {
      remove(ref(db, 'block/' + item.id)).then(()=>{
        console.log("delete")
      })
      setLoader(false)
    }, 500);
   
  })
    console.log(item)
  }

// searce block
let handleSearce = (e) => {
  let arr = []
  block.filter((item)=> {
    if(item.blockbyName.toLowerCase().includes(e.target.value.toLowerCase()) ){
      arr.push(item)
    }
  })
  setSearceblock(arr)
  console.log(searceblock)
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
        
         
          {searceblock.length < 1
          ? 
          block.length > 0 
          ?         
          block.map((item)=>(
             <div className='md:w-[25%] w-[70%] shadow-primary shadow md:m-2.5 mx-auto rounded-md text-center p-2.5'>
              <div className='p-5'>
                <Imgaes src='../src/assets/profile.jpg' className='w-full h-full cursor-pointer rounded-[50%]'/>
              </div>
              <div>
                {(item.blockId)
                ?
                <h2 className='text-[16px] text-primary font-raleway font-bold py-2.5'>{item.blockName}</h2>
                :
                <h2 className='text-[16px] text-primary font-raleway font-bold py-2.5'>{item.blockbyName}</h2>
                }

                {
                  (item.blockById )
                  ?
                  <>
                  {
                    loader ?
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
                    <div className='pb-2.5'>
                      <SecondarButton onClick={()=> {handleUnblock(item)}}>Unblock</SecondarButton>
                    </div>
                    }
                   </>
                  :
                  <div className='pb-2.5'>
                    <SecondarButton >blocked</SecondarButton>
                  </div>
                }
                
              </div>
          </div>
          ))
          :
          <>
          <AlertPage>No blocks</AlertPage>
          <FindUsers onClick={handleFind}> Find Friends , click here </FindUsers>
        </>
          :
          searceblock.map((item)=>(
            <div className='md:w-[25%] w-[70%] shadow-primary shadow md:m-2.5 mx-auto rounded-md text-center p-2.5'>
            <div className='p-5'>
              <Imgaes src='../src/assets/profile.jpg' className='w-full h-full cursor-pointer rounded-[50%]'/>
            </div>
            <div>
              {(item.blockId)
              ?
              <h2 className='text-[16px] text-primary font-raleway font-bold py-2.5'>{item.blockName}</h2>
              :
              <h2 className='text-[16px] text-primary font-raleway font-bold py-2.5'>{item.blockbyName}</h2>
              }

              {
                (item.blockById)
                ?
                <>
                
                {
                  loader ?
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
                  <div className='pb-2.5'>
                    <SecondarButton onClick={()=> {handleUnblock(item)}}>Unblock</SecondarButton>
                  </div>
                  }
                  </>
                :
                <div className='pb-2.5'>
                  <SecondarButton >blocked</SecondarButton>
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

export default Block