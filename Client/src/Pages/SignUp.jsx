import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import OAuth from "../components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [errMessage, setErrMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMessage(null);

    if (!formData.username || !formData.email || !formData.password) {
      setErrMessage("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      setFormData({});
      setLoading(false);

      if (response.status === 200) {
        navigate("/signin");
      } else {
        setErrMessage("Signup was not successful. Please try again.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setErrMessage("An error occurred while signing up. Please try again later.");
      setLoading(false);
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
            This is the demo project you can Sing up with your email and Password or with Google
          </p>
        </div>
        <form className="flex flex-col gap-4 flex-1" onSubmit={handleSubmit}>
          <div>
            <div>
              <Label value="Your Username" />
              <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput type="email" placeholder="Email" id="email" onChange={handleChange} />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} />
            </div>
            <div>
              <Button
                className="w-full mt-4"
                type="submit"
                gradientDuoTone={"purpleToPink"}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
              <OAuth/>
            </div>

            <div className="text-sm mt-4">
              <span>
                Already have an account?
                <Link to="/signin" className="text-blue-500">
                  Sign In
                </Link>
              </span>
            </div>
            {errMessage && <Alert className="mt-5" color={"failure"}>{errMessage}</Alert>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
