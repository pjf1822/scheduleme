import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { acceptInvite } from "@/app/actions/invites";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();
  const inviteToken = request.cookies.get("invite_token")?.value;

  async function handleInviteAndRedirect(destination: string) {
    const response = NextResponse.redirect(`${origin}${destination}`);

    if (inviteToken) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        try {
          await acceptInvite(inviteToken, user.id);
        } catch (e) {
          console.error("Failed to accept invite:", e);
        }
      }
      response.cookies.delete("invite_token");
    }

    return response;
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return handleInviteAndRedirect(next);
    }
  }

  if (token_hash && type) {
    console.log("so we didnt go in here right");
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return handleInviteAndRedirect(next);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
