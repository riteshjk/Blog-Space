import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React from "react";
import { Link,useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import {FaMoon, FaSun} from "react-icons/fa";
import { useSelector,useDispatch } from "react-redux";
import {toggleTheme} from "../redux/theme/themeSlice"

const Header = () => {
    const path = useLocation().pathname;
    const {currentUser} = useSelector((store) => store.user);
    const {theme} = useSelector((store) => store.theme);
    const dispatch = useDispatch();
    //  console.log(currentUser,"hi")
  return (
    <div>
      <Navbar className="border-b-2">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:rtext-white"
        >
          <span className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Ritesh's
          </span>
          Blog
        </Link>
        <form>
          <TextInput
            type="text"
            placeholder="Search..."
            icon="search"
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
          />
        </form>
        <Button className="w-12 h-10  lg:hidden" color="gray" pill>
          <AiOutlineSearch />
        </Button>
        <div className="flex gap-4 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color={"gray"} pill onClick={()=>dispatch(toggleTheme())}>
          {theme == "light" ? <FaSun /> : <FaMoon />}
          </Button>
        {
          currentUser ? (
            <Dropdown arrowIcon={false} inline label={<Avatar img={currentUser?.profilePic} rounded/>}>

                <Dropdown.Header>
                  <span className="block text-sm">@{currentUser?.username}</span>
                  <span className="block text-sm font-medium truncate">@{currentUser?.email}</span>
                </Dropdown.Header>
                
                  <Link to="/dashboard?tab=profile">
                    <Dropdown.Item>Profile</Dropdown.Item>
                  </Link>
                
                <Dropdown.Divider />
                <Dropdown.Item>Sign Out</Dropdown.Item>
              </Dropdown>
          ) : (
            <Link to="/signin"><Button gradientDuoTone={"purpleToBlue"} outline>Sign In</Button></Link>
          )
        }
        
        
        
        <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={Link} >
            <Link to="/">Home</Link>
          </Navbar.Link>

          <Navbar.Link active={path ==="/about"} as={Link}>
            <Link to="/about">About</Link>
          </Navbar.Link>

          <Navbar.Link active={path ==="/projects"} as={Link}>
            <Link to="/projects">Projects</Link>
            
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
