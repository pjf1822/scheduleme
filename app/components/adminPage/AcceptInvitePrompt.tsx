"use client";

import { createClient } from "@/lib/supabase/client";

type Props = {
  token: string;
};

export default function AcceptInvitePrompt({ token }: Props) {
  const handleAccept = async () => {
    document.cookie = `invite_token=${token}; path=/; max-age=600; SameSite=Lax`;

    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border rounded-xl p-8 max-w-md w-full flex flex-col items-center gap-6 bg-[var(--brand-4)]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">You've been invited!</h1>
          <p className="text-gray-500 mt-2">
            You've been invited to join{" "}
            {/* <span className="font-medium text-black">{teamName}</span> */}
          </p>
        </div>

        <button
          onClick={handleAccept}
          className="w-full py-3 px-6 rounded-lg bg-[var(--brand-1)] text-white font-medium"
        >
          Accept with Google
        </button>

        <p className="text-xs text-gray-400 text-center">
          By accepting, you'll be added to the team and signed in with Google.
        </p>
      </div>
    </div>
  );
}
