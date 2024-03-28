import React from "react";
import { Link,useNavigate} from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";


const SignIn = ()=> {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const {loading,error:errorMessage} = useSelector((state) => state.user);

  const handleChange =(e) =>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ( !formData.email || !formData.password) {
      return dispatch(signInFailure(errorMessage || "Please fill all the fields"));
    }
    
    try {
      dispatch(signInStart())
     const res= await fetch("/api/auth/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
     })
        const data = await res.json();
      
      
      if (data.success == false) {
        dispatch(signInFailure())       
      } 
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate("/")
      }
    } catch (error) {
      dispatch(signInFailure(error));
    }
  
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold dark:rtext-white">
            <span className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Ritesh's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is the demo project you can Sing in with your email and
            Password or with Google
          </p>
        </div>
        <form className="flex flex-col gap-4 flex-1" onSubmit={handleSubmit}>
          <div>
            <div>
              <Label value="Your Email" />
              <TextInput type="email" placeholder="Email" id="email" onChange={handleChange}/>
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput type="password" placeholder="Password" id="password" onChange={handleChange}/>
            </div>
            <div>
              <Button
                className="w-full mt-4"
                type="submit"
                gradientDuoTone={"purpleToPink"}
                disabled={loading}
              >
                {
                  loading ? (
                    <>
                    <Spinner size="sm"/>
                    <span className="pl-3">Loading...</span>
                    </>
                  ) : "Sign In"
                }
             
              </Button>
            </div>
            <OAuth/>
            <div className="text-sm mt-4">
              <span>
                Dont have an account?
                <Link to="/signup" className="text-blue-500">
                  Sign Up
                </Link>
              </span>
            </div>
            {
        errorMessage && <Alert className="mt-5" color={"failure"}>{errorMessage}</Alert>
      }
          </div>
        </form>
      </div>
     
    </div>
   
  );
}

export default SignIn;