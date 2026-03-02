import { useState } from "react";
import {
  createTeamRoleAction,
  deleteTeamRoleAction,
} from "../settings/actions";

type Role = {
  id: string;
  name: string;
};

type Props = {
  roles: Role[];
  teamId: string;
};

export default function TeamRoles({ roles, teamId }: Props) {
  const [newRole, setNewRole] = useState("");

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">Team Roles</h1>

      {/* Create */}
      <div className="flex gap-2">
        <input
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="border p-2 flex-1"
          placeholder="New role..."
        />

        <button
          className="border px-3"
          onClick={async () => {
            await createTeamRoleAction(teamId, newRole);
            setNewRole("");
          }}
        >
          Add
        </button>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {roles.map((role) => (
          <li key={role.id} className="flex justify-between border p-2">
            <span>{role.name}</span>

            <button
              onClick={() => deleteTeamRoleAction(role.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
