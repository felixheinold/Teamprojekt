// src/components/AuthLayout.tsx
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="d-flex flex-column flex-lg-row min-vh-100">
    <div className="flex-fill bg-success-subtle d-none d-lg-block" />
    <div className="flex-fill bg-white p-5 d-flex flex-column justify-content-center">
      <div style={{ maxWidth: "400px", width: "100%" }}>
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
