import React, { useState, useEffect } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
} from "./firebase";
import { signInWithCustomToken, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [cToken, setCToken] = useState("");
  const [fToken, setFToken] = useState(null);
  const [copied, setCopied] = useState(false);
  const [clients, setClients] = useState([]);
  const [newClientName, setNewClientName] = useState("");
  const [newClientToken, setNewClientToken] = useState("");

  // Track Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("firebaseClients");
    if (stored) {
      try {
        setClients(JSON.parse(stored));
      } catch (_) {
        setClients([]);
      }
    }
  }, []);

  const handleSignInWithCustomToken = async () => {
    try {
      // Example: Fetch the custom token from your backend
      // const response = await fetch(
      //   "http://localhost:3000/auth/get-custom-token",
      //   {
      //     method: "GET",
      //     // or POST if needed
      //   }
      // );
      // const data = await response.json();
      // const { customToken } = data;

      // 4. Sign in with the custom token
      await signInWithCustomToken(auth, cToken);
    } catch (error) {
      console.error("SignInWithCustomToken Error:", error);
    }
  };

  // Sign in with Email/Password
  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Email Sign-In Error:", error);
    }
  };

  // Sign in Anonymously
  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Anonymous Sign-In Error:", error);
    }
  };

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

  const persistClients = (list) => {
    setClients(list);
    localStorage.setItem("firebaseClients", JSON.stringify(list));
  };

  const addClient = () => {
    if (!newClientName || !newClientToken) return;
    const updated = [...clients, { name: newClientName, token: newClientToken }];
    persistClients(updated);
    setNewClientName("");
    setNewClientToken("");
  };

  const removeClient = (index) => {
    const updated = clients.filter((_, i) => i !== index);
    persistClients(updated);
  };

  const signInClient = async (token) => {
    try {
      await signInWithCustomToken(auth, token);
    } catch (error) {
      console.error("SignInWithCustomToken Error:", error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Firebase Auth Demo</h1>
      {user ? (
        <>
          <p>Signed in as: {user.uid}</p>
          <button onClick={callProtectedEndpoint}>
            Call Protected Endpoint
          </button>
          {serverMessage && (
            <pre style={{ background: "#f4f4f4", padding: "10px" }}>
              {serverMessage}
            </pre>
          )}
          <button onClick={handleShowFToken}>Show Token</button>
          {fToken && (
            <>
              <pre style={{ background: "#f4f4f4", padding: "10px" }}>
                {fToken}
              </pre>
              <button onClick={copyToClipboard}>Copy</button>
            </>
          )}
          <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
            Logout
          </button>
        </>
      ) : (
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
            <button onClick={handleSignInWithCustomToken}>
              Go Custom Token
            </button>
          </div>
          <div>
            <h2>Saved Clients</h2>
            {clients.map((c, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <strong>{c.name}</strong>
                <button
                  onClick={() => signInClient(c.token)}
                  style={{ marginLeft: 8 }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => removeClient(idx)}
                  style={{ marginLeft: 4 }}
                >
                  Remove
                </button>
              </div>
            ))}
            <div>
              <input
                placeholder="Name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                style={{ marginRight: 8 }}
              />
              <input
                placeholder="Token"
                value={newClientToken}
                onChange={(e) => setNewClientToken(e.target.value)}
                style={{ marginRight: 8 }}
              />
              <button onClick={addClient}>Add</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
