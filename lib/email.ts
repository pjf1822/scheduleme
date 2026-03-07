import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // your gmail
    pass: process.env.GMAIL_APP_PASSWORD, // app password (not your real password)
  },
});

export async function sendInviteEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite?token=${token}`;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "You've been invited to join a team",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>You've been invited!</h2>
        <p>Click below to accept your invite.</p>
        <a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;border-radius:6px;text-decoration:none;">
          Accept Invite
        </a>
        <p style="color:#666;font-size:14px;margin-top:24px;">Expires in 7 days.</p>
      </div>
    `,
  });
}
