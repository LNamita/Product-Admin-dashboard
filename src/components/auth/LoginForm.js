"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/services/authService";
import { setSession } from "@/lib/token";
import useSubmitGuard from "@/hooks/useSubmitGuard";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

// Only allow redirects back into this app (blocks "//evil.com").
function safeNext(value) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/products";
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(
    searchParams.get("expired") ? "Your session expired. Please log in again." : ""
  );

  const [submit, loading] = useSubmitGuard(async () => {
    setError("");
    try {
      const { accessToken, ...user } = await login(username.trim(), password);
      setSession(accessToken, {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      });
      router.replace(safeNext(searchParams.get("next")));
      router.refresh();
    } catch (err) {
      setError(err.status === 400 ? "Wrong username or password." : err.message);
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (!username.trim()) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) submit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <TextField
        label="Username"
        name="username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={fieldErrors.username}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
      />
      <Button type="submit" loading={loading} className="w-full">
        {loading ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-xs text-slate-500">
        Demo: <code>emilys</code> / <code>emilyspass</code>
      </p>
    </form>
  );
}
