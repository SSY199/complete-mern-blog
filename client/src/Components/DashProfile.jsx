import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { updateStart, updateSuccess, updateFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess } from "../redux/User/userSlice.js";

function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", action: null });
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setImageFileUploadError('Please upload an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setImageFileUploadError('File size must be less than 2MB');
        return;
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  const uploadImage = async () => {
    setIsUploading(true);
    setImageFileUploadError(null);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // Replace with your upload preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setImageFileUrl(data.secure_url);
      setFormData((prev) => ({
        ...prev,
        profilePicture: data.secure_url, // Store the Cloudinary image URL
      }));
    } catch (error) {
      setImageFileUploadError('Failed to upload image');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    // Validate username length
    if (formData.username && (formData.username.length < 7 || formData.username.length > 15)) {
      setUpdateUserError("Username must be between 7 to 15 characters");
      return;
    }

    // Validate password length
    if (formData.password && formData.password.length < 6) {
      setUpdateUserError("Password must be at least 6 characters long");
      return;
    }

    // Check if no changes were made
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }

    // Check if image is still uploading
    if (isUploading) {
      setUpdateUserError("Please wait for the image to finish uploading");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        alert("User deleted successfully");
        navigate("/");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const openModal = (title, message, action) => {
    setModalContent({ title, message, action });
    setShowModal(true);
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
          {isUploading && (
            <CircularProgressbar
              value={0} // Progress tracking not supported
              text="Uploading..."
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, 0.5)`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="USER"
            className={`rounded-full w-full h-full object-cover border-3 border-[lightgray] ${isUploading && 'opacity-60'}`}
          />
        </div>
        {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline disabled={loading || isUploading}>
          {loading ? "Loading..." : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={'/createpost'}>
            <Button type="button" gradientDuoTone="purpleToPink" className="w-full">
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-600 flex justify-between mt-5">
        <span onClick={() => openModal("Delete Account", "Are you sure you want to delete your account?", handleDeleteUser)} className="cursor-pointer">Delete Account</span>
        <span onClick={() => openModal("Sign Out", "Are you sure you want to sign out?", handleSignOut)} className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-300 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-600 dark:text-gray-400">{modalContent.message}</h3>
            <div className="flex justify-center gap-6">
              <Button color="failure" onClick={modalContent.action}>Yes, I am sure</Button>
              <Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashProfile;