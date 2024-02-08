import React from 'react'

const Imgaes = ({src, onClick, className}) => {
  return (
    <>
        <img src={src} alt="images" onClick={onClick}  className={className}/>
    </>
  )
}

export default Imgaes