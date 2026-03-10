"use client";

import { useState } from "react";
import { completeOnboardingAction } from "../actions/onboarding";
import { useRouter } from "next/navigation";
import LogoutButton from "../components/layout/LogoutButton";
import Image from "next/image";

export default function OnboardingPage() {
  const [step, setStep] = useState<"choose" | "team" | "roles" | "member">(
    "choose",
  );
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

  const addRole = () => {
    const lastRole = roles[roles.length - 1];

    if (!lastRole.name.trim()) return;

    setRoles((prev) => [...prev, { name: "", color: "#3b82f6" }]);
  };
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
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={90}
          priority
          className="mx-auto"
        />{" "}
        {step === "choose" && (
          <>
            <h1 className="text-2xl font-bold text-center">
              Welcome to ScheduleMe
            </h1>

            <div className="space-y-3">
              <button
                onClick={() => setStep("team")}
                className="w-full bg-black text-white rounded-lg p-3"
              >
                Create a Team
              </button>

              <button
                onClick={() => setStep("member")}
                className="w-full border rounded-lg p-3"
              >
                Join as a team member
              </button>
            </div>
          </>
        )}
        {/* STEP 1 — TEAM NAME */}
        {step === "team" && (
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
              onClick={() => setStep("roles")}
              className="w-full bg-black text-white rounded-lg p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </>
        )}
        {/* STEP 1 B — TEAM NAME */}
        {step === "member" && (
          <>
            <h1 className="text-2xl font-bold text-center">Join a Team</h1>

            <p className="text-gray-600 text-center">
              To join a team, ask your team admin to send you an invite. You’ll
              receive an email with a link to join.
            </p>

            <button
              onClick={() => setStep("choose")}
              className="w-full border rounded-lg p-3"
            >
              Back
            </button>
          </>
        )}
        {/* STEP 2 — ROLES */}
        {step === "roles" && (
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

              <button onClick={addRole} className="btn ">
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
        <div className="flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
