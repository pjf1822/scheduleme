import { TeamMember } from "@/lib/types/dbexports";
import React from "react";
import { MemberAvatar } from "../uiPieces/MemberAvatar";

type Props = {
  teamMembers: TeamMember[];
};
const TeamMemberList = ({ teamMembers }: Props) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Team Members</h1>

      <div className="grid gap-3">
        {teamMembers.map((member) => (
          <div
            key={member.user_id}
            className="flex items-center gap-3 border rounded-lg p-3 bg-[var(--brand-4)]"
          >
            <MemberAvatar
              avatarUrl={member?.profiles?.avatar_url ?? undefined}
              name={member?.profiles?.display_name}
              size="lg"
            />

            <div>
              <p className="font-medium">
                {member.profiles?.display_name ?? "Unknown"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMemberList;
