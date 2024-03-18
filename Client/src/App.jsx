import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './Pages/About';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Project from './Pages/Project';
import DashBoard from './Pages/DashBoard';
import Home from './Pages/Home';

export default function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/project" element={<Project />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}
