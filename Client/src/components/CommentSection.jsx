import { Button, TextInput, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const CommentSection = ({postId}) => {
    const {currentUser } = useSelector((state)=>state.user)
    const [comment, setComment] = useState("")
     console.log(currentUser,"name")
    const handleCommentSUbmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
            return;
        }

        try{
          const res= await fetch("/api/comment/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content : comment,
              userId : currentUser._id,
              postId
            })

            
          })
          const data = await res.json();
          if(!res.ok){
            console.log(data.message)
          }
          else{
            setComment("")
          }
        }
        catch(error){
            console.log(error)
        } 
    }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {
           currentUser ? ( <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
            <p>Signed in as</p>
            <img className='w-5 h-5 rounded-full object-cover' src={currentUser.profilePic} alt="userImage" />
            <Link className='text-blue-500 text-xs hover:underline'  to={`/dashboard?tab=profile`}>@{currentUser.username}</Link>
          </div>) :
          (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Sign in to comment</p>
          <Link className='text-blue-500 text-xs hover:underline' to={"/signin"}>Sign In</Link>
        </div>
          )
        }
    {
        currentUser && (
            <form onSubmit={handleCommentSUbmit} className='border border-teal-500 rounded-md p-3'>
                <Textarea placeholder="Add a comment..."  rows="3" maxLength="200" onChange={(e)=>setComment(e.target.value)}/>
                <div className='flex items-center justify-between mt-5'>
                    <p className='text-gray-500 size-xs'>{200 - comment.length} characters remaining</p>
                    <Button outline gradientDuoTone={"purpleToPink"} type="submit">Submit</Button>
                </div>
            </form>
        )
    }
    </div>
  )
}

export default CommentSection
