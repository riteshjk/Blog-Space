import { Sidebar } from 'flowbite-react'
import React from 'react'
import { HiUser,HiArrowSmRight } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useEffect,useState } from 'react';

const DashSideBar = () => {
    const {theme} = useSelector((state) => state.theme)
    const [tab,setTab] = useState("");
    const location = useLocation();

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if(tabFromUrl){
            setTab(tabFromUrl)
        }
    },[location.search])
  return (
  <Sidebar className="w-full md:w-60">
    <Sidebar.Items >
        <Sidebar.ItemGroup >
            <Link to="/dashboard?tab=profile">
            <Sidebar.Item  active={tab=="profile"} icon={HiUser} label={"User"}> 
               Profile
            </Sidebar.Item>
            </Link>
            <Sidebar.Item active icon={HiArrowSmRight} className="cursor-pointer"> 
               Sign Out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
    </Sidebar.Items>
  </Sidebar>
  )
}

export default DashSideBar
