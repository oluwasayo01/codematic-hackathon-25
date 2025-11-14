import { useState } from "react";
import { TextInput, PasswordInput, Button, InlineLoading } from "@carbon/react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { signUp } from "../../stores/auth.actions";
import { Link } from "react-router-dom";

export function SignUpForm() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      await dispatch<any>(signUp(email, password));
    } catch (err: any) {
      setError(err?.message ?? "Sign up failed");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: "1rem" }}>
        <TextInput
          id="displayName"
          labelText="Display Name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName((e.target as HTMLInputElement).value)}
          required
        />
        <TextInput
          id="email"
          labelText="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          required
        />
        <PasswordInput
          id="password"
          labelText="Password"
          value={password}
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          required
        />
        <PasswordInput
          id="confirm"
          labelText="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm((e.target as HTMLInputElement).value)}
          required
        />
        {error && <div style={{ color: "#fa4d56", fontSize: 12 }}>{error}</div>}
        <Button type="submit" disabled={isLoading} style={{ width: "100%" }}>
          {isLoading ? (
            <InlineLoading description="Creating account..." />
          ) : (
            "Create account"
          )}
        </Button>
      </form>
      <div style={{ marginTop: "1rem", fontSize: 12, opacity: 0.8 }}>
        Already have an account? <Link to="/auth">Sign in</Link>
      </div>
    </div>
  );
}
