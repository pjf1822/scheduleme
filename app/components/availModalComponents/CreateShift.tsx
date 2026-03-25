import { createBlockFromDate } from "@/lib/utils/dates/createBlockFromDate";
import { useState } from "react";
import { ShiftWithProfile, TeamRoles } from "@/lib/types/dbexports";
import { createShiftAction } from "../../actions/shifts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  selectedDate: string | null;
  teamId: string;
  roles: TeamRoles[];
  onShiftCreated: (newShifts: ShiftWithProfile[]) => void;
};
const CreateShift = ({
  selectedDate,
  teamId,
  roles,
  onShiftCreated,
}: Props) => {
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedRoleId) return;
    try {
      const { start_time, end_time } = createBlockFromDate(selectedDate);

      const newShifts = await Promise.all(
        Array.from({ length: quantity }, () =>
          createShiftAction(teamId, selectedRoleId, start_time, end_time),
        ),
      );
      onShiftCreated(newShifts);
      setSelectedRoleId("");
      setQuantity(1);
    } catch (error) {
      console.error("Error creating role slot:", error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .cs-wrap {
          font-family: 'DM Mono', monospace;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cs-fields {
          display: grid;
          grid-template-columns: 1fr auto ;
          gap: 20px;
          align-items:start;
        }

        .cs-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cs-label {
          font-size: 14px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          padding-left: 2px;
        }

        /* Custom select */
        .cs-select-wrap {
          position: relative;
        }

        .cs-select {
          width: 100%;
          appearance: none;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f5f0e8;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.06em;
          padding: 11px 36px 11px 14px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }

        .cs-select:focus {
          border-color: rgba(250,204,21,0.3);
          background: rgba(250,204,21,0.03);
        }

        .cs-select option {
          background: #111;
          color: #f5f0e8;
        }

        .cs-select-arrow {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: rgba(255,255,255,0.2);
          font-size: 10px;
        }

        /* Role color preview */
        .cs-role-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 2px;
          height: 16px;
        }

        .cs-role-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .cs-role-name {
          font-size: 9px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          transition: color 0.2s;
        }

        /* Divider between fields */
        .cs-field-sep {
          display: flex;
          align-items: flex-end;
          padding-bottom: 12px;
          color: rgba(255,255,255,0.1);
          font-size: 18px;
          justify-content: center;
        }

        /* Quantity pills */
        .cs-qty-pills {
          display: flex;
          gap: 2px;
          flex-wrap: wrap;
        }

        .cs-qty-pill {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 9px 0;
          width: 36px;
          text-align: center;
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s, color 0.12s;
        }

        .cs-qty-pill:hover {
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6);
        }

        .cs-qty-pill.active {
          background: rgba(250,204,21,0.1);
          border-color: rgba(250,204,21,0.4);
          color: #facc15;
        }
          /* Shadcn select overrides */
.cs-shadcn-trigger {
  width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  color: #f5f0e8;
  font-family: 'DM Mono', monospace;
  font-size: 14px;
  letter-spacing: 0.06em;
  border-radius: 0;
  height: auto;
  padding: 11px 14px;
  transition: border-color 0.15s, background 0.15s;
}

.cs-shadcn-trigger:focus,
.cs-shadcn-trigger[data-state="open"] {
  border-color: rgba(250,204,21,0.3);
  background: rgba(250,204,21,0.03);
  box-shadow: none;
  ring: none;
  outline: none;
}

.cs-shadcn-content {
  background: #111;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 0;
  font-family: 'DM Mono', monospace;
  color: #f5f0e8;
}

.cs-shadcn-item {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.06em;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  border-radius: 0;
}

.cs-shadcn-item[data-highlighted] {
  background: rgba(250,204,21,0.07);
  color: #facc15;
}

/* Shared value layout */
.cs-select-value {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cs-select-swatch {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

        /* Submit */
        .cs-submit {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0a0a0a;
          background: #facc15;
          border: none;
          padding: 13px 28px;
          width: 100%;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .cs-submit:hover:not(:disabled) {
          transform: translate(-2px, -2px);
          box-shadow: 3px 3px 0 rgba(250,204,21,0.2);
        }

        .cs-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cs-submit-count {
          background: rgba(0,0,0,0.15);
          font-size: 10px;
          padding: 2px 8px;
          letter-spacing: 0.1em;
        }

        .dot-anim::after {
          content: '';
          animation: dots 1.2s steps(3, end) infinite;
        }
        @keyframes dots {
          0%   { content: ''; }
          33%  { content: '.'; }
          66%  { content: '..'; }
          100% { content: '...'; }
        }

        @media (max-width: 480px) {
          .cs-fields { grid-template-columns: 1fr; }
          .cs-field-sep { display: none; }
        }
      `}</style>

      <div className="cs-wrap">
        <div className="cs-fields">
          {/* Role */}
          <div className="cs-field">
            <span className="cs-label">Role</span>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger className="cs-shadcn-trigger">
                <SelectValue placeholder="Select role...">
                  {selectedRole && (
                    <span className="cs-select-value">
                      <span
                        className="cs-select-swatch"
                        style={{ background: selectedRole.color ?? "#facc15" }}
                      />
                      {selectedRole.name}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="cs-shadcn-content">
                {roles.map((role) => (
                  <SelectItem
                    key={role.id}
                    value={role.id}
                    className="cs-shadcn-item"
                  >
                    <span className="cs-select-value">
                      <span
                        className="cs-select-swatch"
                        style={{ background: role.color ?? "#facc15" }}
                      />
                      {role.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="cs-role-preview">
              {selectedRole ? (
                <>
                  <span
                    className="cs-role-dot"
                    style={{ background: selectedRole.color ?? "#facc15" }}
                  />
                  <span
                    className="cs-role-name"
                    style={{
                      color: selectedRole.color ?? "rgba(255,255,255,0.2)",
                    }}
                  >
                    {selectedRole.name}
                  </span>
                </>
              ) : (
                <span
                  className="cs-role-dot"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
              )}
            </div>
          </div>

          <div className="cs-field">
            <span className="cs-label">Quantity</span>
            <div className="cs-qty-pills">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  className={`cs-qty-pill${quantity === n ? " active" : ""}`}
                  onClick={() => setQuantity(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          disabled={!selectedRoleId}
          onClick={handleSubmit}
          className="cs-submit"
        >
          {quantity > 1 ? "Create Shifts" : "Create Shift"}
        </Button>
      </div>
    </>
  );
};

export default CreateShift;
