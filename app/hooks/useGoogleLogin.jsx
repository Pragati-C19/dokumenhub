// Login button hook

'use client'; // Add this directive to make it a Client Component

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../utils/firebase/firebase-init";
import { useRouter } from 'next/navigation'

const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()

  const loginWithGoogle = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("fn: loginWithGoogle(): result.user", result.user);

        const userData = {
          username: user.displayName,
          email: user.email,
          auth_uid: user.uid,
          profile_image: user.photoURL,
        };

        router.push('/homepage')
        
        return fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      })
      .then((response) => {
        console.log("Response status:", response);
        if (!response.ok) {
          throw new Error("Failed to save user in the database.");
        }
        console.log("User Login successfully.");
        return response.json();
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { loginWithGoogle, loading, error };
};

export default useGoogleLogin;
