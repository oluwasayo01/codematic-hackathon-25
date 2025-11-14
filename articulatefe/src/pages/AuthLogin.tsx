import { AuthForm } from "../components/auth/AuthForm";

// This page composes the IBM-like left panel framing, while AuthForm handles the actual inputs & submission
export function AuthLogin() {
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Sign in to Articulate App</h2>
      <AuthForm />
    </div>
  );
}
