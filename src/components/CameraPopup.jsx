import React from 'react'

const CameraPopup =({ children, onClick}) => {
 
    return (
      <>
          <div className=' w-full h-full fixed flex items-center justify-center top-0 left-0 bg-[#0000004c] popup__items'>
            <div className='popup__contents w-full h-full bg-light rounded p-2.5 text-center'>
               {children}
            </div>
          </div>   
      </>
    )
}

export default CameraPopup