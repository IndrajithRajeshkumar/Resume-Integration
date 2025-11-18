"use client";

import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak from "keycloak-js";

// TODO: Replace with TL's Keycloak values
const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ||"profile-dashboard",
  clientId: "react-frontend",
});

export default function KeycloakProviderClient({ children }) {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
      }}
    >
      {children}
    </ReactKeycloakProvider>
  );
}
