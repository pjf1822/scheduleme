"use client";

import { createInvite } from "@/app/actions/invites";
import { useState } from "react";

type Props = {
  teamId: string;
  teamName: string;
};

const InviteUsers = ({ teamId, teamName }: Props) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleInvite = async () => {
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      await createInvite(teamId, email, teamName);
      setStatus("success");
      setEmail("");
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e.message ?? "Something went wrong");
    }
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3">
      <p className="font-medium">Invite a team member</p>

      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleInvite()}
          className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-1)]"
        />
        <button
          onClick={handleInvite}
          disabled={status === "loading" || !email}
          className="px-4 py-2 rounded-md bg-[var(--brand-1)] text-white text-sm font-medium disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Send Invite"}
        </button>
      </div>

      {status === "success" && (
        <p className="text-sm text-green-600">Invite sent to {email} ✓</p>
      )}
      {status === "error" && <p className="text-sm text-red-500">{errorMsg}</p>}
    </div>
  );
};

export default InviteUsers;
