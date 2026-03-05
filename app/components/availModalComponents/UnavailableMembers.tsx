import { TeamMember } from "@/lib/types/dbexports";
import { MemberAvatar } from "../uiPieces/MemberAvatar";
type Props = { unavailableMembers: TeamMember[] };

const UnavailableMembers = ({ unavailableMembers }: Props) => {
  return (
    <>
      <h3 className="font-semibold text-red-500">Unavailable</h3>
      <ul className="flex gap-3 overflow-x-auto pb-2">
        {unavailableMembers.map((member) => (
          <li
            key={member.id}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-3 border border-red-200 rounded w-24 opacity-50"
          >
            <div className="grayscale">
              <MemberAvatar member={member} />
            </div>

            <span className="text-sm text-center">
              {member?.profiles?.display_name}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UnavailableMembers;
