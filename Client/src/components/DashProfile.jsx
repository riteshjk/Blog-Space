import { Alert, Button, Modal, ModalHeader, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import {  useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
// import {
//   deleteUserFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   signoutSuccess,
//   updateFailure,
//   updateStart,
//   updateSuccess,
// } from "../redux/user/userSlice";
// import { HiOutlineExclamationCircle } from "react-icons/hi";
// import { Link } from "react-router-dom";
 const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUplaodProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();
//   const [formData, setFormData] = useState({});
//   const [imageUplaoding, setImageUploading] = useState(false);
//   const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
//   const [updateUserError, setUpdateUserError] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   console.log("====================================");
//   console.log(imageFileUploadProgress, imageFileUploadError);
//   console.log("====================================");
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

//   const dispatch = useDispatch();

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //        request.resource.size < 2 * 1024 &&
    //        request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    // setImageUploading(true);
     setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUplaodProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUplaodProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // setUpdateUserError(null);
    // setUpdateUserSuccess(null);
    // if (Object.keys(formData).length === 0) {
    //   setUpdateUserError("No changes made");
    //   return;
    // }
    // if (imageUplaoding) {
    //   setUpdateUserError("Please wait for image to upload");

    //   return;
    // }
    // try {
    //   dispatch(updateStart());
    //   const res = await fetch(`/api/user/update/${currentUser._id}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });

    //   const data = await res.json();
    //   setFormData({});
    //   if (!res.ok) {
    //     dispatch(updateFailure(data.message));
    //     setUpdateUserError(data.message);
    //   } else {
    //     dispatch(updateSuccess(data));
    //     setUpdateUserSuccess("user's profile updatd successfully");
    //   }
    // } catch (error) {
    //   dispatch(updateFailure(error.message));
    //   setUpdateUserError(error.message);
    // }
  };

  const handleDeleteUser = async () => {
    // setShowModal(false);
    // try {
    //   dispatch(deleteUserStart());
    //   const res = await fetch(`/api/user/delete/${currentUser._id}`, {
    //     method: "DELETE",
    //   });
    //   const data = await res.json();
    //   if (!res.ok) {
    //     dispatch(deleteUserFailure(data.message));
    //   } else {
    //     dispatch(deleteUserSuccess(data));
    //   }
    // } catch (error) {
    //   dispatch(deleteUserFailure(error.message));
    // }
  };

  const handleSignout = async () => {
    // try {
    //   const res = await fetch("/api/user/signout", {
    //     method: "POST",
    //   });
    //   const data = await res.json();
    //   if (!res.ok) {
    //     console.log(data.message);
    //   } else {
    //     dispatch(signoutSuccess());
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
          accept="image/*"
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer 
           overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  } )`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.userPresent.profilePic}
            alt=""
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
            ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }
            `}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.userPresent.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.userPresent.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
        //   defaultValue={currentUser.password}
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
        >
          Update
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      
      <Modal
        // show={showModal}
        // onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            {/* <HiOutlineExclamationCircle
              className="h-14 w-14 text-grey-400
             dark:text-grey-200 mb-4 mx-auto
            "
            /> */}
            <h3 className="mb-5 text-lg text-grey-500 dark:text-grey-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="grey" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile