"use client";
import "./globals.css";
import KeycloakProviderClient from "../components/KeycloakProviderClient";
import UserMenu from "../components/UserMenu";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <KeycloakProviderClient>
          <UserMenu />
          {children}
        </KeycloakProviderClient>
      </body>
    </html>
  );
}
