import React from "react";
import { AppFooter } from "../layout/AppFooter";
import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar,
} from "@carbon/react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#161616",
      }}
    >
      {/* IBM-like masthead */}
      <Header aria-label="Articulate">
        <HeaderMenuButton aria-label="Menu" isCollapsible={false} />
        <HeaderName href="#">Articulate</HeaderName>
        <HeaderGlobalBar />
      </Header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", paddingTop: 48 }}>
        {/* Left panel */}
        <div
          style={{
            width: 456,
            background: "#0b0b0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            borderRight: "1px solid #262626",
          }}
        >
          <div style={{ width: "20rem" }}>{children}</div>
        </div>
        {/* Right gradient panel (hidden on small screens) */}
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "none",
            background: "#161616",
          }}
          className="auth-right-panel"
        />
      </div>

      <AppFooter />

      {/* Gradient styles */}
      <style>
        {`
        @media (min-width: 992px) {
          .auth-right-panel { display: block; }
          .auth-right-panel::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(60% 60% at 50% 50%, rgba(138,63,252,0.35), rgba(18,194,233,0.15)),
                        linear-gradient(135deg, #c471ed 0%, #f64f59 25%, #12c2e9 50%, #c471ed 75%, #f64f59 100%);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
          }
          .auth-right-panel::after {
            content: '';
            position: absolute;
            inset: 0;
            background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 50px, rgba(255,255,255,0.03) 51px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 50px, rgba(255,255,255,0.03) 51px);
            opacity: 0.1;
          }
        }
        @keyframes gradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%}}
        `}
      </style>
    </div>
  );
}
