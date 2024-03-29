import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet,Navigate } from 'react-router-dom';

const AdminPrivateRoute = () => {
    const {currentUser} = useSelector((state)=>state.user)
  return (
    <div>
      {
        currentUser && currentUser.isAdmin ? <Outlet/> : <Navigate to="/signin"/>
      }
    </div>
  )
}

export default AdminPrivateRoute
