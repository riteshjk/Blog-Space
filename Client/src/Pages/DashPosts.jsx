import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashPosts = () => {
  const {currentUser} = useSelector((state)=>state.user);
  const [userPosts , setUserPosts] = useState([]);
  const [showMoretasks, setShowMoretasks] = useState(true); 
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  console.log(userPosts)
  useEffect(()=>{
    const fetchData =async () =>{
      try{
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
      const data = await res.json(); 
      
      if(res.ok){
        setUserPosts(data.posts);

        if(data.posts.length < 9){
          setShowMoretasks(false)
        }
      }
    }
      catch(error){
        console.log(error)
      }
    }
    if(currentUser.isAdmin){
      fetchData()
    }
     
  },[currentUser._id])


  const handleShowMoreResult =async() =>{
    const startIndex = userPosts.length;
    try{
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
    const data = await res.json();
    if(res.ok){
      setUserPosts((prev)=>[...prev, ...data.posts]);
      if(data.posts.length < 9){
        setShowMoretasks(false)
      }
    }
    }
    catch(error){
      console.log(error)
    }
  }

  const handleDeletePost = async() =>{
    setShowModal(false)
    // console.log(postIdToDelete,"ritesh"),
    // console.log(currentUser._id,"devi")
    try{
        const res = await fetch(`/api/post/delete/${postIdToDelete}/${currentUser._id}`,{
            method:"DELETE",
        })
        const data = await res.json();
        if(res.ok){
            setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postIdToDelete));
        } else {
            console.log(data.message)
        }
    } catch(error){
        console.log(error)
    }
}
  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-gray-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-600">
     {
      currentUser.isAdmin && userPosts.length > 0 ?  (
        <>
        <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>
            Date Updated
          </Table.HeadCell>
          <Table.HeadCell>
            Post Image
          </Table.HeadCell>
          <Table.HeadCell>
           Post Title
          </Table.HeadCell>
          <Table.HeadCell>
          Category
          </Table.HeadCell>
          <Table.HeadCell>
          Delete
          </Table.HeadCell>
          <Table.HeadCell>
          <span>Edit</span>
          </Table.HeadCell>
        </Table.Head>
        {
          userPosts.map((post)=>(
            <Table.Body className='divide-y'>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-500"/>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>{post.title}</Link>
                </Table.Cell>
                <Table.Cell>
                  {post.category}
                </Table.Cell>
                <Table.Cell>
                  <span className='text-red-500 font-medium hover:underline cursor-pointer' onClick={()=>{
                    setPostIdToDelete(post._id);
                    setShowModal(true)
                  }}>Delete</span>
                </Table.Cell>
                <Table.Cell>
                  <Link className='text-blue-500 hover:underline' to={`/update-post/${post._id}`}>
                  <span>Edit</span>
                  </Link>
                </Table.Cell>

              </Table.Row>
            </Table.Body>
          ))
        }
        </Table>
        {
          showMoretasks && (
            <button onClick={handleShowMoreResult} className='w-full text-center text-blue-500 self-center text-sm py-7'>Show More</button>
          )
        }
        </>
      )

       : (<p>You have no posts yet</p>)
        
     }
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
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts
