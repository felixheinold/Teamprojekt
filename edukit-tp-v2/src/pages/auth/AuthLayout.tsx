// src/components/AuthLayout.tsx
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="d-flex flex-column flex-lg-row min-vh-100">
    <div
      className="flex-fill d-none d-lg-block"
      style={{
        background: "linear-gradient(180deg, #4a8f5c, #78ba84)",
        minHeight: "100vh",
      }}
    />

    <div className="flex-fill p-5 d-flex flex-column justify-content-center">
      <div style={{ width: "100%" }}>{children}</div>
    </div>
  </div>
);

export default AuthLayout;
