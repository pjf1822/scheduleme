"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    router.push("/dashboard");
    router.refresh();

    if (!error) {
      alert("Password updated!");
    }
  };
  return (
    <div>
      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Update Password</button>
    </div>
  );
};

export default ResetPassword;
