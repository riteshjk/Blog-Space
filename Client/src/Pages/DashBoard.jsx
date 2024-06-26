import React, { useEffect,useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSideBar from '../components/DashSideBar';
import DashProfile from '../components/DashProfile';
import DashPosts from './DashPosts';
import DashUsers from './DashUsers';
import { DashComments } from '../components/DashComments';
import DashboardComponent from '../components/DashboardComp';


const DashBoard = () => {
  const location = useLocation();
  const [tab,setTab] = useState("")
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    // console.log(tabFromUrl)
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  },[location.search])
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSideBar />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts/>}
      {tab==="users" && <DashUsers/>}
      {tab ==="comments" && <DashComments/>}
      {tab==="dash" && <DashboardComponent/>}
    </div>
  );
}

export default DashBoard