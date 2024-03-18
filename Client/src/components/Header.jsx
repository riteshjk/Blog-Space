import { Button, Navbar, TextInput } from "flowbite-react";
import React from "react";
import { Link,useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import {FaMoon} from "react-icons/fa"

const Header = () => {
    const path = useLocation().pathname;
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
        <Button className="w-12 h-10 hidden sm:inline"><FaMoon /></Button>
        <Link to="/signin"><Button gradientDuoTone={"purpleToBlue"}>Sign In</Button></Link>
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