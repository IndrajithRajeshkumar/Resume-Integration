"use client";

import React, { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { keycloak } = useKeycloak();
  const router = useRouter();
  const user = keycloak?.tokenParsed || {};
  const [open, setOpen] = useState(false);

  if (!keycloak?.authenticated) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <img
        src="/profile-icon.svg"
        onClick={() => setOpen(!open)}
        style={{
          width: 45,
          height: 45,
          borderRadius: "50%",
          border: "2px solid #0078ff",
          cursor: "pointer",
          transition: "0.25s ease",
          transform: open ? "scale(1.05)" : "scale(1)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 55,
          right: 0,
          background: "white",
          padding: "12px",
          borderRadius: "12px",
          boxShadow: "0px 8px 30px rgba(0,0,0,0.15)",
          width: "190px",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0px)" : "translateY(-10px)",
          pointerEvents: open ? "auto" : "none",
          transition: "0.25s ease-in-out",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            marginBottom: 8,
            color: "#0078ff",
            transition: "0.2s",
          }}
        >
          {user?.given_name || "User"}
        </div>

        <div
          onClick={() => router.push("/profile")}
          style={menuItem}
        >
          My Account
        </div>

        <div
          onClick={() => keycloak.logout()}
          style={{ ...menuItem, color: "#e63946" }}
        >
          Logout
        </div>
      </div>
    </div>
  );
}

const menuItem = {
  padding: "10px",
  cursor: "pointer",
  borderRadius: "8px",
  transition: "0.2s ease",
  fontSize: "15px",
  color: "#222",
};
