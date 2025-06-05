import React, { useState, useEffect } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { createAuth } from "../firebase";

function SavedClients({ setAuth }) {
  const [clients, setClients] = useState([]);
  const [newClientName, setNewClientName] = useState("");
  const [newClientToken, setNewClientToken] = useState("");
  const [newClientConfig, setNewClientConfig] = useState("");

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

  const persistClients = (list) => {
    setClients(list);
    localStorage.setItem("firebaseClients", JSON.stringify(list));
  };

  const addClient = () => {
    if (!newClientName || !newClientToken || !newClientConfig) return;
    let configObj;
    try {
      configObj = JSON.parse(newClientConfig);
    } catch (e) {
      console.error("Invalid config JSON", e);
      return;
    }
    const updated = [
      ...clients,
      { name: newClientName, token: newClientToken, config: configObj },
    ];
    persistClients(updated);
    setNewClientName("");
    setNewClientToken("");
    setNewClientConfig("");
  };

  const removeClient = (index) => {
    const updated = clients.filter((_, i) => i !== index);
    persistClients(updated);
  };

  const signInClient = async (client) => {
    try {
      const newAuth = createAuth(client.config);
      setAuth(newAuth);
      await signInWithCustomToken(newAuth, client.token);
    } catch (error) {
      console.error("SignInWithCustomToken Error:", error);
    }
  };

  return (
    <div>
      <h2>Saved Clients</h2>
      {clients.map((c, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <strong>{c.name}</strong>
          <button onClick={() => signInClient(c)} style={{ marginLeft: 8 }}>
            Sign In
          </button>
          <button onClick={() => removeClient(idx)} style={{ marginLeft: 4 }}>
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
        <textarea
          placeholder="Firebase config JSON"
          value={newClientConfig}
          onChange={(e) => setNewClientConfig(e.target.value)}
          style={{ marginRight: 8, display: "block", width: "100%" }}
          rows={3}
        />
        <button onClick={addClient}>Add</button>
      </div>
    </div>
  );
}

export default SavedClients;
