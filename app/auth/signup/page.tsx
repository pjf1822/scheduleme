"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/confirm`,
        data: {
          display_name: displayName,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm your account.");
      router.push("/");
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/confirm`,
      },
    });

    if (error) alert(error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSignup}
        className="flex w-full max-w-md flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold">Create Account</h1>

        <input
          type="email"
          placeholder="Email"
          required
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Display name"
          required
          className="border p-2"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2"
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="border p-2"
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
}
