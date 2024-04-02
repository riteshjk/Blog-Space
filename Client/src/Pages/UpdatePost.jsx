
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { app } from '../firebase';
import {CircularProgressbar} from "react-circular-progressbar"; 
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UpdatePost = () => {
  const [file,setFile]  = useState(null);
  const [formData,setFormData] = useState({});
  const [imageUploadSuccess,setImageUploadSuccess] = useState(null);
  const [imageUploadFailure,setImageUploadFailure] = useState(null);
  // console.log(formData)
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate()
  const {postId} = useParams();
  const {currentUser} = useSelector((state)=>state.user)

  useEffect(()=>{
    const fetchPost = async() => {
      try{
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if(!res.ok){
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if(res.ok){
          setFormData(data.posts[0]);
          setPublishError(null);
        }
      }
      catch(error){
        console.log(error);
      }
    }
    fetchPost();
  },[postId])

  const handleUploadImage = async() => {
    try{
      if(!file){
        setImageUploadFailure("Please select an image");
        return;
    }
    setImageUploadFailure(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadSuccess(progress.toFixed(0));
      },
      (error) => {
        setImageUploadFailure(error.message);
        setImageUploadSuccess(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({...formData,image:downloadURL});
          setImageUploadSuccess(null);
          setImageUploadFailure(null);
        });
      }
    )
  }
    catch(error){
      console.log(error);
      setImageUploadSuccess(null);
      setImageUploadFailure(error.message);
    }
  }

  const handlePostSubmit =async(e) =>{
    e.preventDefault();
    try{
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json();
      if(!res.ok){
        setPublishError(data.message);
      }
      else{
        setPublishError(null);
        navigate(`/post/${data.slug}`)
      }
    }
    catch(error){
      setPublishError(error.message);
    }
  }
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form onSubmit={handlePostSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput type="text" placeholder="Title" required id="title" className="flex-1" value={formData.title} onChange={(e)=>setFormData({...formData,title:e.target.value})}/>
            <Select onChange={(e)=>setFormData({...formData,category:e.target.value})} value={formData.category}>
                <option value="uncategorized">Select a category</option>
                <option value="javascript">Javascript</option>
                <option value="reactjs">React.js</option>
                <option value="nextjs">Next.js</option>
            </Select>
        </div>
        <div className='flex gap-2 items-center justify-between border-4 border-teal-500 border-dotted p-6 my-2'>
            <FileInput type="file" accept='image/*' onChange={(e)=>setFile(e.target.files[0])}/>
            <Button type="button" gradientDuoTone={"purpleToBlue"} outline onClick={handleUploadImage} disabled={imageUploadSuccess}>
              {
                imageUploadSuccess ? <CircularProgressbar value={imageUploadSuccess} text={`${imageUploadSuccess || 0}%`}/> : "Upload image"
              }
            </Button>
        </div>
        {
          imageUploadFailure && <Alert color="failure" >{imageUploadFailure}</Alert>
        }
       {
        formData.image && <img src={formData.image} alt="Uploaded image" className='w-full h-72 object-cover'/>
       }

        <ReactQuill theme="snow" placeholder='Write something...' value={formData.content} className='h-72 mb-12 my-6 ' required  onChange={(value)=>setFormData({...formData,content:value})}/>
  
    
        <Button type='submit' gradientDuoTone="purpleToPink" className='w-full my-6'>Update Post</Button>
 
      </form>
      {
        publishError && <Alert color="failure" className='mt-4 w-full'>{publishError}</Alert>
      }
    </div>
  )
}

export default UpdatePost
