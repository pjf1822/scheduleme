import { TeamMember } from "@/lib/types/dbexports";
import { MemberAvatar } from "../uiPieces/MemberAvatar";

type Props = {
  members: TeamMember[];
  title: string;
  variant?: "available" | "unavailable";
};

const ModalMembersSection = ({
  members,
  title,
  variant = "available",
}: Props) => {
  const isUnavailable = variant === "unavailable";

  return (
    <>
      <h3 className="font-semibold">{title}</h3>

      <ul className="flex gap-3 overflow-x-auto pb-2">
        {members.map((member) => (
          <li
            key={member.id}
            className={`flex-shrink-0 flex flex-col items-center gap-2 p-2 ${
              isUnavailable ? "opacity-60" : "p-3"
            }`}
          >
            <div
              className={`${
                isUnavailable
                  ? "grayscale"
                  : "p-[2px] rounded-full border border-gray-200 hover:border-black transition"
              }`}
            >
              <MemberAvatar member={member} size="xl" />
            </div>

            <span className="text-xs text-center leading-tight">
              {member?.profiles?.display_name}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ModalMembersSection;
