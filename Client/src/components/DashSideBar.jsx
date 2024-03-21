import { Sidebar } from 'flowbite-react'
import React from 'react'
import { HiUser,HiArrowSmRight } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useEffect,useState } from 'react';

const DashSideBar = () => {
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
  <Sidebar className="w-full md:w-56">
    <Sidebar.Items >
        <Sidebar.ItemGroup >
            <Link to="/dashboard?tab=profile">
            <Sidebar.Item  active={tab=="profile"} icon={HiUser} label={"User"} as="div"> 
               Profile
            </Sidebar.Item>
            </Link>
            <Sidebar.Item active icon={HiArrowSmRight} className="cursor-pointer" as="div"> 
               Sign Out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
    </Sidebar.Items>
  </Sidebar>
  )
}

export default DashSideBar
