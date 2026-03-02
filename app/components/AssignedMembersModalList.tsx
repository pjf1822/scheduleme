import { TeamSchedule } from "@/lib/types/dbexports";

type Props = {
  assignedMembers: TeamSchedule[];
  onRemove: (block: TeamSchedule) => void;
};

export default function AssignedMembersModalList({
  assignedMembers,
  onRemove,
}: Props) {
  if (assignedMembers.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Assigned</h3>

      <ul className="space-y-2">
        {assignedMembers.map((block) => (
          <li
            key={block.id}
            className="p-2 border rounded flex justify-between items-center"
          >
            <span>{block.user_id}</span>

            <button
              className="text-sm border rounded px-2 py-1 hover:bg-gray-100"
              onClick={() => onRemove(block)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
