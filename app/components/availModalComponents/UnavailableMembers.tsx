import { TeamMember } from "@/lib/types/dbexports";
import Image from "next/image";
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
            <Image
              src={member?.profiles?.avatar_url || "/default-avatar.png"}
              width={48}
              height={48}
              className="rounded-full object-cover grayscale"
              alt="avatar"
            />
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
