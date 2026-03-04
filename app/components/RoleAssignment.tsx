import { createBlockFromDate } from "@/lib/utils/dates/createBlockFromDate";
import { useState } from "react";
import { createRoleSlotAction } from "../actions/roleSlots/roleSlotActions";
import { TeamRoles } from "@/lib/types/dbexports";

type Props = {
  selectedDate: string | null;
  teamId: string;
  roles: TeamRoles[];
};
const RoleAssignment = ({ selectedDate, teamId, roles }: Props) => {
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedRoleId) return;
    try {
      const { start_time, end_time } = createBlockFromDate(selectedDate);

      for (let i = 0; i < quantity; i++) {
        await createRoleSlotAction(
          teamId,
          selectedRoleId,
          start_time,
          end_time,
        );
      }

      setSelectedRoleId("");
      setQuantity(1);
    } catch (error) {
      console.error("Error creating role slot:", error);
    }
  };

  return (
    <div className="border-t pt-4 space-y-2">
      <h3 className="font-semibold">Add Role Need</h3>

      <div className="flex gap-2">
        <select
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
        >
          <option value="">Select role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <button
          disabled={!selectedRoleId}
          onClick={handleSubmit}
          className="border px-3"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RoleAssignment;
