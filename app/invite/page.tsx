import { createClient } from "@/lib/supabase/server";
import { acceptInvite } from "@/app/actions/invites";
import { redirect } from "next/navigation";
import AcceptInvitePrompt from "../components/adminPage/AcceptInvitePrompt";
import { getInviteByToken } from "@/lib/db/invites";
import Image from "next/image";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function InvitePage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) redirect("/login");

  const supabase = await createClient();

  const invite = await getInviteByToken(token);

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Invalid Invite</h1>
          <p className="text-gray-500 mt-2">
            This invite is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  // Already logged in — accept immediately
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await acceptInvite(token, user.id);
    redirect("/dashboard");
  }

  return <AcceptInvitePrompt token={token} teamName={invite.team_name} />;
}
