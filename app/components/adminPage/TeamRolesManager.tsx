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

  const capitalize = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .roles-wrap {
          font-family: 'DM Mono', monospace;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 520px;
        }

        /* Create row */
        .roles-create {
          display: flex;
          gap: 0;
          align-items: stretch;
        }

        .roles-input {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-right: none;
          color: #f5f0e8;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.06em;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          min-width: 0;
        }

        .roles-input::placeholder { color: rgba(255,255,255,0.48); }
        .roles-input:focus {
          border-color: rgba(250,204,21,0.3);
          background: rgba(250,204,21,0.03);
        }

        .color-swatch-wrap {
          position: relative;
          width: 44px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.18);
          border-right: none;
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          overflow: hidden;
        }

        .color-swatch-preview {
          position: absolute;
          inset: 6px;
          border-radius: 2px;
          pointer-events: none;
        }

        .color-swatch-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .roles-add-btn {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0a0a0a;
          background: #facc15;
          border: none;
          padding: 12px 20px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
        }

        .roles-add-btn:hover:not(:disabled) {
          transform: translate(-1px, -1px);
          box-shadow: 2px 2px 0 rgba(250,204,21,0.25);
        }

        .roles-add-btn:disabled { opacity: 0.25; cursor: not-allowed; }

        /* Roles list */
        .roles-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .role-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.015);
          position: relative;
          transition: background 0.15s, border-color 0.15s;
        }

        .role-row:hover {
          background: rgba(255,255,255,0.025);
        }

        .role-color-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
        }

        .role-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }

        .role-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .role-name {
          font-size: 14px;
          letter-spacing: 0.08em;
          color: #f5f0e8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Edit mode */
        .role-edit-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(250,204,21,0.2);
          color: #f5f0e8;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          padding: 6px 10px;
          outline: none;
          min-width: 0;
        }

        .role-edit-color {
          position: relative;
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
        }

        .role-edit-color input[type="color"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        /* Action buttons */
        .role-actions {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }

        .role-btn {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 5px 12px;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }

        .role-btn.edit {
          color: rgba(255,255,255,0.73);
          border-color: rgba(255,255,255,0.08);
        }
        .role-btn.edit:hover {
          color: #f5f0e8;
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.04);
        }

        .role-btn.save {
          color: #4ade80;
          border-color: rgba(74,222,128,0.2);
        }
        .role-btn.save:hover {
          background: rgba(74,222,128,0.08);
        }

        .role-btn.cancel {
          color: rgba(255,255,255,0.25);
          border-color: rgba(255,255,255,0.06);
        }
        .role-btn.cancel:hover {
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.03);
        }

        .role-btn.delete {
          color: rgba(248,113,113,0.9);
          border-color: rgba(248,113,113,0.1);
        }
        .role-btn.delete:hover {
          color: #f87171;
          border-color: rgba(248,113,113,0.25);
          background: rgba(248,113,113,0.05);
        }

        .roles-empty {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.12);
          padding: 20px 0;
          text-align: center;
          border: 1px dashed rgba(255,255,255,0.06);
        }
      `}</style>

      <div className="roles-wrap">
        {/* Create */}
        <div className="roles-create">
          <input
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !newRole === false &&
              (async () => {
                await createTeamRoleAction(
                  teamId,
                  capitalize(newRole),
                  newColor,
                );
                setNewRole("");
                setNewColor("#facc15");
              })()
            }
            className="roles-input"
            placeholder="New role..."
          />

          <div className="color-swatch-wrap">
            <div
              className="color-swatch-preview"
              style={{ background: newColor }}
            />
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="color-swatch-input"
            />
          </div>

          <button
            disabled={newRole === ""}
            className="roles-add-btn"
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
        <ul className="roles-list">
          {roles.map((role) => {
            const isEditing = editingId === role.id;

            return (
              <li key={role.id} className="role-row">
                <div
                  className="role-color-bar"
                  style={{ background: role.color ?? "#facc15" }}
                />

                {isEditing ? (
                  <>
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="role-edit-input"
                    />
                    <div
                      className="role-edit-color"
                      style={{ background: editColor }}
                      title="Pick color"
                    >
                      <input
                        type="color"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="role-badge">
                    <span
                      className="role-dot"
                      style={{ background: role.color ?? "#facc15" }}
                    />
                    <span className="role-name">{role.name}</span>
                  </div>
                )}

                <div className="role-actions">
                  {" "}
                  {isEditing ? (
                    <>
                      <button
                        className="role-btn save"
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
                        className="role-btn cancel"
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
                        className="role-btn edit"
                        onClick={() => {
                          setEditingId(role.id);
                          setEditValue(role.name);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTeamRoleAction(role.id)}
                        className="role-btn delete"
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
    </>
  );
}
