"use client";

import { useState } from "react";
import { completeOnboardingAction } from "../actions/onboarding";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [roles, setRoles] = useState<{ name: string; color: string }[]>([
    { name: "", color: "#3b82f6" },
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateRoleName = (index: number, value: string) => {
    setRoles((prev) =>
      prev.map((r, i) => (i === index ? { ...r, name: value } : r)),
    );
  };

  const updateRoleColor = (index: number, color: string) => {
    setRoles((prev) => prev.map((r, i) => (i === index ? { ...r, color } : r)));
  };

  const addRole = () =>
    setRoles((prev) => [...prev, { name: "", color: "#3b82f6" }]);
  const removeRole = (index: number) => {
    setRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRoleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (roles[index].name.trim() === "") return;

      addRole();

      setTimeout(() => {
        const inputs =
          document.querySelectorAll<HTMLInputElement>("[data-role]");
        inputs[index + 1]?.focus();
      }, 0);
    }
  };
  const validRoles = roles
    .map((r) => ({ name: r.name.trim(), color: r.color }))
    .filter((r) => r.name);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 border rounded-xl space-y-6">
        {/* STEP 1 — TEAM NAME */}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold">Create your team</h1>

            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team name"
              className="w-full border rounded-lg p-3"
            />

            <button
              disabled={!teamName.trim()}
              onClick={() => setStep(2)}
              className="w-full bg-black text-white rounded-lg p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 — ROLES */}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold">Create roles</h1>

            <div className="space-y-2">
              {roles.map((role, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    data-role
                    value={role.name}
                    onChange={(e) => updateRoleName(index, e.target.value)}
                    onKeyDown={(e) => handleRoleKeyDown(e, index)}
                    placeholder="e.g. driver"
                    className="flex-1 border rounded-lg p-3"
                  />
                  <input
                    type="color"
                    value={role.color}
                    onChange={(e) => updateRoleColor(index, e.target.value)}
                    className="w-10 h-10 border rounded"
                  />

                  {roles.length > 1 && (
                    <button
                      onClick={() => removeRole(index)}
                      className="px-3 text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addRole}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add role
              </button>
            </div>

            <button
              disabled={loading}
              onClick={async () => {
                setLoading(true);

                try {
                  await completeOnboardingAction({
                    teamName,
                    roles: validRoles,
                  });

                  router.push("/dashboard");
                } catch (e) {
                  console.error(e);
                  setLoading(false);
                }
              }}
              className="w-full bg-black text-white rounded-lg p-3"
            >
              {loading ? "Creating..." : "Create Team"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
