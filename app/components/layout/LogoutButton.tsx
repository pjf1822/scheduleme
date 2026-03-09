"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh(); // important for SSR
  };

  return (
    <button className="btn w-32 rounded-full" onClick={handleLogout}>
      Logout
    </button>
  );
}
