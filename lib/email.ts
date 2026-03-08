import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendInviteEmail({
  email,
  token,
  teamName,
}: {
  email: string;
  token: string;
  teamName: string;
}) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite?token=${token}`;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: `You're invited to join ${teamName}`,
    html: `
  <div style="background:#f5f5f5;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:40px;border:1px solid #e5e5e5;">
      
      <h1 style="margin:0 0 16px 0;font-size:22px;color:#111;">
        You're invited to join <strong>${teamName}</strong>
      </h1>

      <p style="margin:0 0 28px 0;color:#444;font-size:15px;line-height:1.6;">
        Someone on the team invited you to collaborate.  
        Click the button below to accept your invite.
      </p>

      <a 
        href="${inviteUrl}" 
        style="
          display:inline-block;
          background:#000;
          color:#fff;
          padding:14px 26px;
          border-radius:8px;
          text-decoration:none;
          font-weight:600;
          font-size:14px;
        "
      >
        Accept Invite
      </a>

      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #eee;font-size:13px;color:#777;">
        <p style="margin:0;">This invite expires in 7 days.</p>
        <p style="margin:6px 0 0 0;">
          If the button doesn't work, copy this link:
        </p>
        <p style="word-break:break-all;margin:6px 0 0 0;color:#555;">
          ${inviteUrl}
        </p>
      </div>

    </div>

    <div style="max-width:520px;margin:16px auto 0 auto;text-align:center;font-size:12px;color:#999;">
      Sent from ${process.env.NEXT_PUBLIC_APP_URL}
    </div>

  </div>
  `,
  });
}
