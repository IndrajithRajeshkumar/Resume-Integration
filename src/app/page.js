"use client";

import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";

export default function Dashboard() {
  const { keycloak, initialized } = useKeycloak();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait until Keycloak finishes initializing
    if (!initialized) return;

    // If initialized AND not logged in → THEN redirect
    if (!keycloak?.authenticated) {
      keycloak.login();
    } else {
      // When logged in → show page
      setReady(true);
    }
  }, [initialized, keycloak]);

  // While Keycloak loads -> show nothing
  if (!ready) return null;

  const user = keycloak.tokenParsed || {};

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>
        Welcome {user?.given_name || "User"} 👋
      </h1>

      <p style={{ color: "#444" }}>
        You are logged in using Keycloak.
      </p>
    </div>
  );
}




