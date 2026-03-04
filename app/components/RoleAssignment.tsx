import { createBlockFromDate } from "@/lib/utils/dates/createBlockFromDate";
import { useState } from "react";
import { Shifts, TeamRoles } from "@/lib/types/dbexports";
import { createShiftAction } from "../actions/shifts/shiftActions";

type Props = {
  selectedDate: string | null;
  teamId: string;
  roles: TeamRoles[];
  onShiftCreated: (newShifts: Shifts[]) => void;
};
const RoleAssignment = ({
  selectedDate,
  teamId,
  roles,
  onShiftCreated,
}: Props) => {
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedRoleId) return;
    try {
      const { start_time, end_time } = createBlockFromDate(selectedDate);

      const newShifts: Shifts[] = [];

      for (let i = 0; i < quantity; i++) {
        const shift = await createShiftAction(
          teamId,
          selectedRoleId,
          start_time,
          end_time,
        );
        newShifts.push(shift);
      }
      onShiftCreated(newShifts);

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
