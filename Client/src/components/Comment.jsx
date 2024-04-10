import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

const Comment = ({comment,hanldeLike,onEdit,onDelete}) => {

    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const {currentUser} = useSelector((state) => state.user)
    // console.log(user,"done")
    useEffect(() => {
        const getUser = async () =>{
            try{
                const res = await fetch(`/api/users/${comment.userId}`);
                const data = await res.json();
                if(res.ok){
                    setUser(data)
                    
                }
            }
            catch(err){
                console.log(err)
            }
        }
        getUser()
    },[comment])

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
      };

    const handleSave = async () => {
        try {
          const res = await fetch(`/api/comment/editComment/${comment._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: editedContent,
            }),
          });
          if (res.ok) {
            setIsEditing(false);
            onEdit(comment, editedContent);
          }
        } catch (error) {
          console.log(error.message);
        }
      };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shirnk-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user && user.profilePic}
          alt=""
        />
      </div>
      <div className="flex-1">
        <div className="flex  items-center mb-1">
          <span className="font-bold mr-1 text-xss truncate">
            {user ? `@${user.username}` : `anonymous user`}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {
            isEditing ? <> <Textarea className='w-full mb-2' value={editedContent} onChange={(e)=>setEditedContent(e.target.value)}/>
            <div className='flex gap-2 justify-end text-sm'>
                <Button onClick={handleSave} type="button" size="sm" gradientDuoTone={"purpleToPink"}>Save</Button>
                <Button onClick={()=>setIsEditing(false)} type="button" size="sm" outline gradientDuoTone={"purpleToPink"}>Cancle</Button>

            </div>
            </> :
            <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex item-center pt-2 text-xs border-t
               dark:border-gray-700 max-w-fit gap-2">
              <button type="button" onClick={()=>hanldeLike(comment._id)} className={`text-gray-500 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}>
                <FaThumbsUp className='text-sm'/>
              </button>
              <p className="text-grey-400">
                    {comment.numberOfLikes > 0 &&
                      comment.numberOfLikes +" "+
                        (comment.numberOfLikes === 1 ? "like" : "likes")}
                  </p>    
                  {
                    currentUser && (comment.userId === currentUser._id || currentUser.isAdmin) && (
                      <>
                        <button onClick={handleEdit} type="button" className="text-gray-500 hover:text-blue-500">Edit</button>
                        <button onClick={()=>onDelete(comment._id)} type="button" className="text-gray-500 hover:text-red-500">Delete</button>

                        </>
                    )
                  }   
                   
            </div>
            </>
        }
       
        </div>
        </div>
 
  )

}

export default Comment
