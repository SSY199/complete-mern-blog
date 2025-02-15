import { Alert, Button, Label, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice.js";
import Oauth from "../Components/OAuth";

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signInFailure('All fields are required'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-purple-400 dark:bg-black flex items-center justify-center">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1 text-center md:text-left">
          <Link to={"/"}>
            <h1 className="font-bold dark:text-white text-4xl">
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-lg text-black">DEV</span>NINJAS
            </h1>
          </Link>
          <p className="mt-4 text-lg dark:text-white animate-typing">
            Welcome back to Dev-Ninjas! Sign in to access your account, read the latest articles, and engage with our community of developers.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4 bg-purple-600 dark:bg-gray-800 p-4 rounded-lg" onSubmit={handleSubmit}>
            {/* email */}
            <div className="mb-4">
              <Label value="Your Email" className="font-bold"></Label>
              <TextInput type="email" id="email" onChange={handleChange} placeholder="name@gmail.com" />
            </div>
            <div className="mb-4">
              <Label value="Password" className="font-bold"></Label>
              <TextInput type="password" id="password" onChange={handleChange} placeholder="********" />
            </div>
            <Button gradientDuoTone="purpleToBlue" type="submit" disabled={loading} className="text-black">
              {
                loading ? (
                  <>
                    <Spinner size="md" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Sign In"
                )
              }
            </Button>
            <Oauth></Oauth>
          </form>
          <div className="flex justify-center gap-3 mt-4">
            <span>Dont have an Account?</span>
            <Link to="/signup" className="text-blue-600">Sign-Up</Link>
          </div>
            {errorMessage && (
              <Alert className="text-center mt-3" color="failure">
                {errorMessage}
              </Alert>
            )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;