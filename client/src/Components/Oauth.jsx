import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useState } from "react";

function Oauth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth(app);

  const handleGoogleClick = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        setError(data.message || 'Google login failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        type="button"
        className="bg-black text-white dark:bg-black dark:text-white w-full"
        onClick={handleGoogleClick}
        disabled={loading}
      >
        <AiFillGoogleCircle className="w-6 h-6 mr-2" />
        {loading ? 'Signing in...' : 'Sign-In with Google'}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default Oauth;