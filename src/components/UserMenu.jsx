"use client";

import { useKeycloak } from "@react-keycloak/web";
import Link from "next/link";

export default function UserMenu() {
  const { keycloak } = useKeycloak();

  if (!keycloak?.authenticated) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "30px",
        zIndex: 999,
      }}
    >
      <Link href="/profile">
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "white",
            border: "2px solid #d4d4d4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          <span style={{ fontSize: "20px" }}>👤</span>
        </div>
      </Link>
    </div>
  );
}



