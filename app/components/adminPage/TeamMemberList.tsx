import { TeamMember } from "@/lib/types/dbexports";
import React from "react";
import { MemberAvatar } from "../uiPieces/MemberAvatar";

type Props = {
  teamMembers: TeamMember[];
};
const TeamMemberList = ({ teamMembers }: Props) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold pb-2">Team Members</h1>

      <ul className="list bg-base-100 rounded-box border border-base-300">
        {teamMembers.map((member) => (
          <li key={member.user_id} className="list-row items-center">
            <MemberAvatar
              avatarUrl={member?.profiles?.avatar_url ?? undefined}
              name={member?.profiles?.display_name}
              size="lg"
            />

            <div className="list-col-grow">
              <div className="font-medium">
                {member.profiles?.display_name ?? "Unknown"}
              </div>
              <div className="text-sm opacity-60">Team Member</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamMemberList;
