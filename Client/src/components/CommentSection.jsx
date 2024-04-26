import { Button, Modal, TextInput, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';




const CommentSection = ({postId}) => {
    const {currentUser } = useSelector((state)=>state.user)
    const [comment, setComment] = useState("")
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([])
    const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
    const navigate = useNavigate()
    console.log(comments,"hi")
    
    const handleCommentSubmit = async (e) => {
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
          if(res.ok){
            setComment("");
            setCommentError(null);
            setComments([data, ...comments]);
          }
          else{
            console.log(data.message)
          }
        }
        catch(error){
          setCommentError(error.message);
        } 
    }
    useEffect(() => {
      const getComments = async () => {
        try {
          const res = await fetch(`/api/comment/getPostComments/${postId}`);
          if (res.ok) {
            const data = await res.json();
  
            setComments(data);
          }
        } catch (error) {
          console.log(error);
        }
      };
  
      getComments();
    }, [postId]);


    const hanldeLike = async (commentId) => {
      console.log(commentId);
      try {
        if (!currentUser) {
          return navigate("/signin");
        }
        const res = await fetch(`/api/comment/likeComment/${commentId}`, {
          method: "PUT",
        });
        if (res.ok) {
          const data = await res.json();
          setComments(
            comments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likes: data.likes,
                    numberOfLikes: data.likes.length,
                  }
                : comment
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleEdit = async (comment, editedContent) => {
      setComments(
        comments.map((c) =>
          c._id === comment._id ? { ...comment, content: editedContent } : c
        )
      );
    };

    const handleDelete = async (commentId) => {
      try {
        if (!currentUser) {
          navigate("/signin");
          return;
        }
         
        const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          const data = await res.json();
          setComments((comments) =>
            comments.filter((comment) => comment._id !== commentId)
          );
          setShowModal(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

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
            <form onSubmit={handleCommentSubmit} className='border border-teal-500 rounded-md p-3'>
                <Textarea placeholder="Add a comment..."  rows="3" maxLength="200" onChange={(e)=>setComment(e.target.value)}/>
                <div className='flex items-center justify-between mt-5'>
                    <p className='text-gray-500 size-xs'>{200 - comment.length} characters remaining</p>
                    <Button outline gradientDuoTone={"purpleToPink"} type="submit">Submit</Button>
                </div>
            </form>
        )
    }
    {comments.length === 0 ? (
        <p className="text-sm my-5">No commnets yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {
            comments.map((comment)=>(
              <Comment key={comment._id} comment={comment} hanldeLike={hanldeLike} onEdit={handleEdit} onDelete={(commentId)=>{
                setShowModal(true) 
                setCommentToDelete(commentId)
              }}/>
            ))
          }
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle
              className="h-14 w-14 text-grey-400
             dark:text-grey-200 mb-4 mx-auto
            "
            />
            <h3 className="mb-5 text-lg text-grey-500 dark:text-grey-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={()=>handleDelete(commentToDelete)}>
                Yes, I'm sure
              </Button>
              <Button color="grey" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CommentSection
