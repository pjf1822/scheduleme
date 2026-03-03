"use client";
import { useState } from "react";
import {
  createTeamRoleAction,
  deleteTeamRoleAction,
  updateTeamRoleAction,
} from "../actions/settings/teamRoles";
import { TeamRoles } from "@/lib/types/dbexports";
type Props = {
  roles: TeamRoles[];
  teamId: string;
};
export default function TeamRolesManager({ roles, teamId }: Props) {
  const [newRole, setNewRole] = useState("");
  const [newColor, setNewColor] = useState("#000000");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editColor, setEditColor] = useState("#000000");

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

        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-12 h-10 border"
        />
        <button
          disabled={newRole === ""}
          className="border px-3"
          onClick={async () => {
            const capitalized = newRole
              .trim()
              .toLowerCase()
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            await createTeamRoleAction(teamId, capitalized, newColor);
            setNewRole("");
            setNewColor("#000000");
          }}
        >
          Add
        </button>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {roles.map((role) => {
          const isEditing = editingId === role.id;

          return (
            <li key={role.id} className="flex justify-between border p-2 gap-2">
              {isEditing ? (
                <>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border p-1 flex-1"
                  />
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-10 h-8"
                  />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: role.color || "#000000" }}
                  />
                  <span>{role.name}</span>
                </div>
              )}

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      className="text-green-600"
                      onClick={async () => {
                        const capitalized = editValue
                          .trim()
                          .toLowerCase()
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ");

                        await updateTeamRoleAction(
                          role.id,
                          capitalized,
                          editColor,
                        );

                        setEditingId(null);
                        setEditValue("");
                      }}
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditValue("");
                        setEditColor(role.color || "#000000");
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(role.id);
                        setEditValue(role.name);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTeamRoleAction(role.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
