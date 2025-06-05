import React from "react";

function UserPanel({
  user,
  serverMessage,
  fToken,
  copied,
  onProtected,
  onShowToken,
  onCopyToken,
  onLogout,
}) {
  return (
    <>
      <p>Signed in as: {user.uid}</p>
      <button onClick={onProtected}>Call Protected Endpoint</button>
      {serverMessage && (
        <pre style={{ background: "#f4f4f4", padding: "10px" }}>{serverMessage}</pre>
      )}
      <button onClick={onShowToken}>Show Token</button>
      {fToken && (
        <>
          <pre style={{ background: "#f4f4f4", padding: "10px" }}>{fToken}</pre>
          <button onClick={onCopyToken}>{copied ? "Copied!" : "Copy"}</button>
        </>
      )}
      <button onClick={onLogout} style={{ marginLeft: "1rem" }}>
        Logout
      </button>
    </>
  );
}

export default UserPanel;
