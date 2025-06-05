import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithCustomToken,
} from "firebase/auth";

function SignInForms({ auth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cToken, setCToken] = useState("");

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email Sign-In Error:", error);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Anonymous Sign-In Error:", error);
    }
  };

  const handleSignInWithCustomToken = async () => {
    try {
      await signInWithCustomToken(auth, cToken);
    } catch (error) {
      console.error("SignInWithCustomToken Error:", error);
    }
  };

  return (
    <>
      <div>
        <h2>Sign In with Email/Password</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleEmailSignIn}>Sign In</button>
      </div>
      <div>
        <h2>Or Sign In Anonymously</h2>
        <button onClick={handleAnonymousSignIn}>Go Anonymous</button>
      </div>
      <div>
        <h2>Sign In Custom Token</h2>
        <input
          placeholder="Customer token"
          value={cToken}
          onChange={(e) => setCToken(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleSignInWithCustomToken}>Go Custom Token</button>
      </div>
    </>
  );
}

export default SignInForms;
