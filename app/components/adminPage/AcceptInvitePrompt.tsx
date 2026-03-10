"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type Props = {
  token: string;
  teamName: string;
};

export default function AcceptInvitePrompt({ token, teamName }: Props) {
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-4)]">
      <div className="border rounded-xl p-8 max-w-md w-full flex flex-col items-center gap-6 bg-[var(--brand-3)]">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={90}
            priority
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-semibold">You've been invited!</h1>
        </div>

        <Button
          onClick={handleAccept}
          size="lg"
          className="w-full flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 19-7.3 19-20 0-1.3-.1-2.3-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.7-3.4-11.3-8l-6.6 5.1C9.5 39.7 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.3-6.1 6.6l6.3 5.2C39.5 36.7 43 31 43 24c0-1.3-.1-2.3-.4-3.5z"
            />
          </svg>
          Accept with Google
        </Button>

        <p className="text-xs text-black text-center">
          By accepting, you'll be added to the team and signed in with Google.
        </p>
      </div>
    </div>
  );
}
