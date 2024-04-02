import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './Pages/About';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Projects from './Pages/Projects';
import DashBoard from './Pages/DashBoard';
import Home from './Pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import CreatePost from './Pages/CreatePost';
import UpdatePost from './Pages/UpdatePost';

export default function App() {
  return (
    <div>
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/projects" element={<Projects />} />
        <Route element={<PrivateRoute/>}>
        <Route path="/dashboard" element={<DashBoard />} />
        </Route>
        <Route element={<AdminPrivateRoute/>}>
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:postId" element={<UpdatePost/>} />
        </Route>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  )
}
