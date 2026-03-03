import { createBlockFromDate } from "@/lib/utils/calendar/createBlockFromData";
import React, { useState } from "react";
import { createRoleSlotAction } from "../actions/roleSlots/roleSlotActions";
import { TeamRoles } from "@/lib/types/dbexports";

type Props = {
  selectedDate: string | null;
  teamId: string;
};
const RoleAssignment = ({ selectedDate, teamId }: Props) => {
  const [roleId, setRoleId] = useState("");
  const handleSubmit = async () => {
    if (!selectedDate || !roleId) return;

    try {
      const { start_time, end_time } = createBlockFromDate(selectedDate);

      await createRoleSlotAction(teamId, roleId, start_time, end_time);

      setRoleId("");
    } catch (error) {
      console.error("Error creating role slot:", error);
    }
  };

  return (
    <div className="border-t pt-4 space-y-2">
      <h3 className="font-semibold">Add Role Need</h3>

      <div className="flex gap-2">
        <select
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          className="border p-2 flex-1"
        >
          <option value="">Select role...</option>

          {/* {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))} */}
        </select>

        <button
          disabled={!roleId}
          onClick={handleSubmit}
          className="border px-3"
        ></button>
      </div>
    </div>
  );
};

export default RoleAssignment;
