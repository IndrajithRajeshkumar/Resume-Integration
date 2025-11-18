"use client";

import React, { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { keycloak } = useKeycloak();
  const router = useRouter();
  const user = keycloak?.tokenParsed || {};

  const [profileImage, setProfileImage] = useState("/profile-icon.svg");

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setProfileImage(URL.createObjectURL(f));
  };

  if (!keycloak?.authenticated) {
    return (
      <div style={centerBox}>
        <button onClick={() => keycloak.login()} style={loginButton}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={pageWrap}>
      <div style={cardContainer}>

        {/* PROFILE IMAGE */}
        <div style={imageSection}>
          <input
            type="file"
            id="pf"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <label htmlFor="pf">
            <img
              src={profileImage}
              alt="profile"
              style={profilePic}
            />
          </label>

          <button
            onClick={() => document.getElementById("pf").click()}
            style={photoButton}
          >
            Change Photo
          </button>
        </div>

        {/* INFO SECTION */}
        <div style={infoSection}>
          <h2 style={title}>My Account</h2>

          <Field label="First Name" value={user?.given_name} readOnly />
          <Field label="Last Name" value={user?.family_name} readOnly />
          <Field label="Email" value={user?.email} readOnly />

          {/* BUTTON ROW */}
          <div style={buttonRow}>
            <button onClick={() => router.push("/")} style={backButton}>
              ← Back
            </button>

            <button onClick={() => keycloak.logout()} style={logoutButton}>
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* REUSABLE FIELD COMPONENT -------------------------------------------- */

function Field({ label, value, readOnly }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      <input value={value || ""} readOnly={readOnly} style={inputBox} />
    </div>
  );
}

/* STYLES ----------------------------------------------------------------*/

const pageWrap = {
  padding: "40px",
  animation: "fadeIn 0.5s ease",
};

const cardContainer = {
  maxWidth: "900px",
  margin: "0 auto",
  display: "flex",
  gap: "40px",
  padding: "35px",
  background: "white",
  borderRadius: "16px",
  boxShadow: "0 6px 30px rgba(0,0,0,0.12)",
  transition: "0.3s",
};

/* LEFT SIDE */
const imageSection = {
  width: "240px",
  textAlign: "center",
};

const profilePic = {
  width: "170px",
  height: "170px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #e1e1e1",
  cursor: "pointer",
  transition: "0.3s ease",
};

/* RIGHT SIDE */
const infoSection = {
  flex: 1,
  paddingRight: "20px",
};

const title = {
  fontSize: "28px",
  marginBottom: "20px",
  fontWeight: 700,
};

/* FIELD LABELS */
const labelStyle = {
  display: "block",
  fontSize: "15px",
  fontWeight: 600,
  marginBottom: "6px",
};

const inputBox = {
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #ccc",
  background: "#f7f7f7",
  fontSize: "15px",
};

/* BUTTON BAR */
const buttonRow = {
  marginTop: "20px",
  display: "flex",
  gap: "12px",
};

/* GLOW ANIMATIONS */
const backButton = {
  background: "#0078ff",
  color: "white",
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  transition: "0.25s ease",
};

backButton["&:hover"] = {
  boxShadow: "0 0 12px rgba(0, 120, 255, 0.6)",
};

const logoutButton = {
  background: "#e63946",
  color: "white",
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  transition: "0.25s ease",
};

logoutButton["&:hover"] = {
  boxShadow: "0 0 12px rgba(230, 57, 70, 0.6)",
};

const photoButton = {
  marginTop: "15px",
  background: "#0078ff",
  color: "white",
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  transition: "0.25s ease",
};

photoButton["&:hover"] = {
  boxShadow: "0 0 12px rgba(0, 120, 255, 0.6)",
};

/* LOGIN CENTER BOX */
const loginButton = {
  background: "#0078ff",
  color: "white",
  padding: "12px 20px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  transition: "0.25s ease",
};

const centerBox = {
  height: "80vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};




