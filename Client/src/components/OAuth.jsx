import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const auth = getAuth(app);
    const handleGoogleAuth = async () => {
        
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: "select_account"
        });

        try {
            const result = await signInWithPopup(auth, provider);

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    image: result.user.photoURL
                })
            });
            //  console.log(res,"xyz")
            const data = await res.json();
            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate("/");
            } else {
                console.error("Error:", res.statusText);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <Button type="button" gradientDuoTone={"purpleToBlue"} outline className='w-full mt-4 mr-2' onClick={handleGoogleAuth}>
            <AiFillGoogleCircle className='mr-2 w-6 h-6' /> Continue With Google
        </Button>
    );
}

export default OAuth;