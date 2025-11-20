"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useKeycloak } from "@react-keycloak/web";

export default function ProfilePage() {
  const { keycloak, initialized } = useKeycloak();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!initialized) return;

    if (!keycloak.authenticated) {
      keycloak.login();
      return;
    }

    const token = keycloak.tokenParsed;

    setUserInfo({
      firstName: token?.given_name,
      lastName: token?.family_name,
      email: token?.email,
    });
  }, [initialized, keycloak]);

  if (!initialized || !keycloak.authenticated || !userInfo) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "480px",
          background: "white",
          padding: "30px",
          borderRadius: "18px",
          boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        {/* Profile Picture */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "#e0e7ff",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "50px",
              color: "#4f46e5",
              fontWeight: "600",
            }}
          >
            {userInfo.firstName?.[0]}
          </div>
        </div>

        {/* User Details */}
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#1e293b",
          }}
        >
          Profile Information
        </h2>

        <div style={{ textAlign: "left", marginBottom: "25px" }}>
          <p style={{ marginBottom: "10px", fontSize: "1rem" }}>
            <strong>First Name:</strong> {userInfo.firstName}
          </p>
          <p style={{ marginBottom: "10px", fontSize: "1rem" }}>
            <strong>Last Name:</strong> {userInfo.lastName}
          </p>
          <p style={{ marginBottom: "10px", fontSize: "1rem" }}>
            <strong>Email:</strong> {userInfo.email}
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          
          {/* BACK BUTTON WITH ANIMATION */}
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              background: "#475569",
              color: "white",
              border: "none",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            ← Back
          </button>

          {/* LOGOUT BUTTON WITH ANIMATION */}
          <button
            onClick={() => keycloak.logout()}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              background: "#ef4444",
              color: "white",
              border: "none",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}



