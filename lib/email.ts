import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite?token=${token}`;
  console.log("📧 INVITE URL::", inviteUrl);
  return; // skip email for now
  //   const { error } = await resend.emails.send({
  //     from: "onboarding@resend.dev", // ✅ works without a verified domain
  //     to: email,
  //     subject: "You've been invited to join a team",
  //     html: `
  //       <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
  //         <h2>You've been invited!</h2>
  //         <p>Click below to accept your invite.</p>
  //         <a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;border-radius:6px;text-decoration:none;">
  //           Accept Invite
  //         </a>
  //         <p style="color:#666;font-size:14px;margin-top:24px;">Expires in 7 days.</p>
  //       </div>
  //     `,
  //   });

  //   if (error) throw new Error(`Email failed: ${error.message}`);
}
