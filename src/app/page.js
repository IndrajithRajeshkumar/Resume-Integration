"use client";

import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { keycloak, initialized } = useKeycloak();
  const router = useRouter();

  const [description, setDescription] = useState("");

  // Load saved + template description
  useEffect(() => {
    const saved = localStorage.getItem("dashboardDescription");
    if (saved) setDescription(saved);

    const selected = localStorage.getItem("dashboardDescription");
    if (selected) {
      setDescription(selected);
    }
  }, []);

  // Keycloak auth guard
  useEffect(() => {
    if (!initialized) return;
    if (!keycloak.authenticated) {
      keycloak.login();
    }
  }, [initialized, keycloak?.authenticated]);

  const goToTemplates = () => router.push("/templates");

  // 🚀 MAKE TEMPLATE BUTTON LOGIC
  const handleMakeTemplate = () => {
    localStorage.setItem("makeTemplateDescription", description);
    router.push("/templates");
  };

  if (!initialized) return null;
  if (!keycloak.authenticated) return null;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT DESCRIPTION PANEL */}
      <div
        style={{
          width: "320px",
          borderRight: "1px solid #eee",
          padding: "20px",
          background: "#fafafa",
        }}
      >
        <h3>Description</h3>

        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            localStorage.setItem("dashboardDescription", e.target.value);
          }}
          placeholder="Write a note…"
          style={{
            width: "100%",
            height: "380px",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            resize: "none",
            background: "white",
            marginTop: "10px",
            marginBottom: "18px",
            fontSize: "15px",
            lineHeight: "1.6",
          }}
        />

        {/* BUTTONS SIDE BY SIDE */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          {/* Templates Button */}
          <button
            onClick={goToTemplates}
            style={{
              flex: 1,
              padding: "10px",
              background: "#ef4444",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Templates
          </button>

          {/* Make Template Button */}
          {description.trim().length > 0 && (
            <button
              onClick={handleMakeTemplate}
              style={{
                flex: 1,
                padding: "10px",
                background: "#3b82f6",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Make Template
            </button>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: 1, padding: "40px" }}>
        <h1>Welcome {keycloak?.tokenParsed?.given_name} 👋</h1>
        <p>You are logged in using Keycloak.</p>
      </div>
    </div>
  );
}













