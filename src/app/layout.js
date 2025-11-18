"use client";

import React from "react";
import KeycloakProviderClient from "@/components/KeycloakProviderClient";
import UserMenu from "@/components/UserMenu";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#f4f4f4",
          fontFamily: "Inter, sans-serif",
          minHeight: "100vh",
          overflowX: "hidden",
          animation: "fadeIn 0.4s ease",
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0px); }
          }
        `}</style>

        <KeycloakProviderClient>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: "70px",
              background: "white",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "0 35px",
              boxShadow: "0px 2px 15px rgba(0,0,0,0.08)",
              zIndex: 1000,
            }}
          >
            <UserMenu />
          </div>

          <div style={{ paddingTop: "85px" }}>{children}</div>
        </KeycloakProviderClient>
      </body>
    </html>
  );
}


