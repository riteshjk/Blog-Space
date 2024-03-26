import { Alert, Button, Modal, ModalHeader, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import {  useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { updateStart, updateSuccess, updateFailure } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";


 const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUplaodProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});

//   console.log("====================================");
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);


  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //        request.resource.size < 2 * 1024 &&
    //        request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    // setImageUploading(true);
     setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUplaodProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUplaodProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({...formData, profilePic: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
     setFormData({ ...formData, [e.target.id]: e.target.value });

  };
  
  const handleSubmit = async (e) => {
     e.preventDefault();
    
     if (Object.keys(formData).length === 0) {
       return;
     }
  
     try {
       dispatch(updateStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

       const data = await res.json();
      
       if (!res.ok) {
        
         dispatch(updateFailure(data.message));
        
     } else {
        dispatch(updateSuccess(data));
      }
    } 
    catch (error) {
      
      dispatch(updateFailure(error.message));
    }
  };

 

 

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
          accept="image/*"
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer 
           overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  } )`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.userPresent.profilePic}
            alt=""
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
            ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }
            `}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.userPresent.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.userPresent.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
        //   defaultValue={currentUser.password}
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
        >
          Update
        </Button>
        {/* {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a Post
            </Button>
          </Link>
        )} */}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span  className="cursor-pointer">
          Delete Account
        </span>
        <span  className="cursor-pointer">
          Sign Out
        </span>
      </div>
  
    </div>
  );
};

export default DashProfile