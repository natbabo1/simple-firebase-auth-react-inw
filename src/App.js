import React, { useState, useEffect } from "react";
import { createAuth, defaultConfig, onAuthStateChanged } from "./firebase";
import { signOut } from "firebase/auth";
import SignInForms from "./components/SignInForms";
import SavedClients from "./components/SavedClients";
import UserPanel from "./components/UserPanel";

// Initialize default Firebase auth
const initialAuth = createAuth(defaultConfig);

function App() {
  const [auth, setAuth] = useState(initialAuth);
  const [user, setUser] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [fToken, setFToken] = useState(null);
  const [copied, setCopied] = useState(false);

  // Track Auth State
  useEffect(() => {
    if (!auth) return undefined;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [auth]);



  // Call the protected route
  const callProtectedEndpoint = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken(); // get ID token from Firebase
      const response = await fetch(
        "http://localhost:3120/b-with-you/admin/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setServerMessage(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Protected route error:", error.stack);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out Error:", error);
    }
  };

  const handleShowFToken = async () => {
    try {
      const token = await user.getIdToken(); // get ID token from Firebase

      setFToken(token);
    } catch (error) {
      setFToken("NO");
      console.error("FToken Error:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 sec
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };


  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Firebase Auth Demo</h1>
      {user ? (
        <UserPanel
          user={user}
          serverMessage={serverMessage}
          fToken={fToken}
          copied={copied}
          onProtected={callProtectedEndpoint}
          onShowToken={handleShowFToken}
          onCopyToken={copyToClipboard}
          onLogout={handleLogout}
        />
      ) : (
        <>
          <SignInForms auth={auth} />
          <SavedClients setAuth={setAuth} />
        </>
      )}
    </div>
  );
}

export default App;
