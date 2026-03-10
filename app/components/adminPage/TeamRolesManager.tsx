"use client";
import { useState } from "react";

import { TeamRoles } from "@/lib/types/dbexports";
import {
  createTeamRoleAction,
  deleteTeamRoleAction,
  updateTeamRoleAction,
} from "../../actions/teamRoles";
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
    <div className="max-w-xl bg-[var(--brand-3)] space-y-6 border border-[var(--brand-1)] border-3 rounded-box mt-4 p-2">
      <h1 className="text-xl font-semibold pt-8">Team Roles</h1>

      {/* Create */}
      <div className="flex gap-2">
        <input
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="input border p-2 flex-1"
          placeholder="New role..."
        />

        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-12 h-10 border  bg-[var(--brand-3)]"
        />
        <button
          disabled={newRole === ""}
          className="btn border px-3"
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
      <ul className="list bg-base-100 rounded-box border border-base-300">
        {roles.map((role) => {
          const isEditing = editingId === role.id;

          return (
            <li
              key={role.id}
              className="list-row flex justify-between items-center"
            >
              {isEditing ? (
                <>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="input border p-1 flex-1"
                  />
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-10 h-8 bg-[var(--brand-3)]"
                  />
                </>
              ) : (
                <div
                  className="badge badge-outline flex items-center gap-2"
                  style={{ borderColor: role.color ?? "#000" }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: role.color || "#000" }}
                  />
                  {role.name}
                </div>
              )}

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      className="btn text-green-600"
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
                      className="btn"
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
                      className="btn"
                      onClick={() => {
                        setEditingId(role.id);
                        setEditValue(role.name);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTeamRoleAction(role.id)}
                      className="btn text-red-500"
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
