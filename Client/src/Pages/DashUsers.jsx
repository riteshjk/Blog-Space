import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import {FaCheck,FaTimes} from 'react-icons/fa'

const DashUsers = () => {
  const {currentUser} = useSelector((state)=>state.user);
  const [users , setusers] = useState([]);
  const [showMoretasks, setShowMoretasks] = useState(true); 
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setuserIdToDelete] = useState("");
//   console.log(users)
  useEffect(()=>{
    const fetchUsers =async () =>{
      try{
        const res = await fetch(`/api/users/getusers`);
      const data = await res.json(); 
      console.log(data,"pagal")
      if(res.ok){
        setusers(data.users);

        if(data.users.length < 9){
          setShowMoretasks(false)
        }
      }
    }
      catch(error){
        console.log(error)
      }
    }
    if(currentUser.isAdmin){
      fetchUsers()
    }
     
  },[currentUser._id])


  const handleShowMoreResult =async() =>{
    const startIndex = users.length;
    try{
      const res = await fetch(`/api/users/getusers?startIndex=${startIndex}`);
    const data = await res.json();
    if(res.ok){
      setusers((prev)=>[...prev, ...data.users]);
      if(data.users.length < 9){
        setShowMoretasks(false)
      }
    }
    }
    catch(error){
      console.log(error)
    }
  }

   const handleDeleteuser = async() =>{
//     setShowModal(false)
//     // console.log(userIdToDelete,"ritesh"),
//     // console.log(currentUser._id,"devi")
//     try{
//         const res = await fetch(`/api/users/deleteuser/${userIdToDelete}/${currentUser._id}`,{
//             method:"DELETE",
//         })
//         const data = await res.json();
//         if(res.ok){
//             setusers(prevusers => prevusers.filter(user => user._id !== userIdToDelete));
//         } else {
//             console.log(data.message)
//         }
//     } catch(error){
//         console.log(error)
//     }
 }
  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-gray-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-600">
     {
      currentUser.isAdmin && users.length > 0 ?  (
        <>
        <Table hoverable className="shadow-md">
        <Table.Head>
          <Table.HeadCell>
            Date Created
          </Table.HeadCell>
          <Table.HeadCell>
            User Image
          </Table.HeadCell>
          <Table.HeadCell>
           Username
          </Table.HeadCell>
          <Table.HeadCell>
           Email
          </Table.HeadCell>
          <Table.HeadCell>
          Admin
          </Table.HeadCell>
          <Table.HeadCell>
          Delete
          </Table.HeadCell>
        </Table.Head>
        {
          users.map((user)=>(
            <Table.Body className='divide-y'>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                    <img src={user.profilePic} alt={user.username} className="w-10 h-10 object-cover bg-gray-500 rounded-full"/>
                
                </Table.Cell>
                <Table.Cell>
               {user.username}
                </Table.Cell>
                <Table.Cell>
                  {user.email}
                </Table.Cell>
                <Table.Cell>
                  {!user.isAdmin ? (<FaTimes className='text-red-500'/>) : (<FaCheck className='text-green-500'/>)}
                </Table.Cell>
                <Table.Cell>
                  <span className='text-red-500 font-medium hover:underline cursor-pointer' onClick={()=>{
                    setuserIdToDelete(user._id);
                    setShowModal(true)
                  }}>Delete</span>
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

       : (<p>You have no users yet</p>)
        
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteuser}>
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

export default DashUsers
