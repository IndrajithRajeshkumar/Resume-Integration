"use client";

import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";

export default function KeycloakProviderClient({ children }) {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      {children}
    </ReactKeycloakProvider>
  );
}

