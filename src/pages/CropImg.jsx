import React, { useState, createRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Container from './../components/Container';
import Imgaes from "../components/Imgaes";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { getStorage, ref, uploadString ,getDownloadURL} from "firebase/storage";
import { getAuth,updateProfile } from "firebase/auth";
import { activeUser } from "../redux/slices/userSlices";
import NameEdit from "../components/NameEdit";



const CropImg = () => {
  
  let auth = getAuth();
  let dispatch = useDispatch();
  let data = useSelector(state=> state.userdata.userInfo);
  console.log(auth.currentUser)

  const [image, setImage] = useState();
  const [cropData, setCropData] = useState();
  const cropperRef = createRef(null);


  const handleEditFile = (e) => {

    e.preventDefault();
    let files;

    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result );
    };

    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {

    if (typeof cropperRef.current?.cropper !== "undefined") {

      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());

      const storage = getStorage();
      const storageRef = ref(storage, `profile/ ${data.uid}`);
      const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL()

      uploadString(storageRef, message4, 'data_url')

      .then((snapshot) => {

        getDownloadURL(storageRef)
        
        .then((downloadURL) => {

          updateProfile(auth.currentUser,{
            photoURL: downloadURL
          }).then(()=> {
            dispatch(activeUser(auth.currentUser))
            localStorage.setItem('userInfo', JSON.stringify(auth.currentUser))
          })
        });
      });
    }
  };
  return (
    <>
        <Container>
            <div className='md:h-550 h-[500px] overflow-y-auto bg-light md:overflow-y-auto'>
              <div className="md:flex md:justify-evenly">
                <div className="cropping__img md:w-[35%] w-[100%] p-2.5 md:my-4 my-2 shadow shadow-primary ">
                   
                    {image 
                    ?
                    <div className="w-[100px] h-[100px] rounded-lg img-preview overflow-hidden">
                        {/* <Imgaes src='../src/assets/profile.jpg' className='w-full h-full'/> */}
                    </div>
                    :
                    data.photoURL 
                    ?
                    <div className="w-[100px] h-[100px] rounded-lg overflow-hidden">
                       <Imgaes src={data.photoURL} className='w-full h-full rounded-lg'/>
                    </div>
                    :
                    <div className="w-[100px] h-[100px] rounded-lg overflow-hidden">
                      <Imgaes src='../src/assets/profile.jpg' className='w-full h-full rounded-lg'/>
                    </div>  
                    }
                    
                    {image &&
                    <div className="flex justify-between py-3">
                      <Cropper
                        ref={cropperRef}
                        style={{ height: 200, width: 200 ,borderRadius: '50px'}}
                        zoomTo={0.5}
                        initialAspectRatio={1}
                        preview=".img-preview"
                        src={image}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        guides={true}
                        /> 
                        <div className="shadow-sm shadow-primary">
                          <Imgaes src={cropData} alt="cropped" className='w-[200px] h-[200px] overflow-hidden '/>
                        </div>
                        </div>
                     }
                      <div className="flex items-center">
                        <InputBox type='file' onChange={handleEditFile}/>
                        <div className="border-light border p-2.5 ">
                            <Button onClick={getCropData}>Upload</Button>
                        </div>
                      </div>
                </div>
                <div className="edit md:w-[40%] w-[100%] overflow-y-auto p-4">
                    <div>
                      <NameEdit />
                    </div>
                </div>
              </div>
            </div>
        </Container>
    </>
  )
}

export default CropImg