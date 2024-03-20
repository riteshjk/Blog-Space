import React from "react";
import { Link,useNavigate} from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";


function SignIn() {
  const [formData, setFormData] = useState({});
  // const [errMessage, setErrMessage] = useState(null);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const {loading,error} = useSelector((state) => state.user);

  const handleChange =(e) =>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    if ( !formData.email || !formData.password) {
      // setErrMessage("Please fill all the fields");
      // setLoading(false);
      return dispatch(loginFailure(error || "Please fill all the fields"));
       // exit the function early if form data is incomplete
    }
    
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setFormData({});
      
      
      if (response.status === 200) {
        // Redirect to sign-in page
        dispatch(loginSuccess(response.data))
        navigate("/");
      } else {
        dispatch(loginFailure(response.data.message));
        // setErrMessage("Signup was not successful. Please try again.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      dispatch(loginFailure(error));
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
        error && <Alert className="mt-5" color={"failure"}>{error}</Alert>
      }
          </div>
        </form>
      </div>
     
    </div>
   
  );
}

export default SignIn;