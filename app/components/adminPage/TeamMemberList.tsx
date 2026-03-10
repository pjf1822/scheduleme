import { TeamMember } from "@/lib/types/dbexports";
import { MemberAvatar } from "../uiPieces/MemberAvatar";

type Props = {
  teamMembers: TeamMember[];
  adminUserId: string | null;
};
const TeamMemberList = ({ teamMembers, adminUserId }: Props) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold pb-2">Team Members</h1>

      <ul className="list bg-[var(--brand-3)] rounded-box border border-[var(--brand-1)] border-3">
        {teamMembers.map((member) => {
          const isAdmin = member.user_id === adminUserId;

          return (
            <li key={member.id} className="list-row items-center">
              <MemberAvatar
                avatarUrl={member?.profiles?.avatar_url ?? undefined}
                name={member?.profiles?.display_name}
                size="lg"
              />

              <div className="list-col-grow">
                <div className="font-medium flex items-center gap-2">
                  {member.profiles?.display_name ?? "Unknown"}

                  {isAdmin && (
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-300">
                      Admin
                    </span>
                  )}
                </div>

                <div className="text-sm opacity-60">Team Member</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TeamMemberList;
