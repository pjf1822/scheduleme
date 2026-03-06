import { Database } from "./database";

// BUSY BLOCKS
export type BusyBlock = Database["public"]["Tables"]["busy_blocks"]["Row"];

export type BusyBlockInsert =
  Database["public"]["Tables"]["busy_blocks"]["Insert"];

// PROFILE
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// TEAM MEMBERS
export type TeamMember = Database["public"]["Tables"]["team_members"]["Row"] & {
  profiles: Pick<Profile, "display_name" | "avatar_url"> | null;
};
export type TeamRoles = Database["public"]["Tables"]["team_roles"]["Row"];

// SHIFTS
export type Shift = Database["public"]["Tables"]["shifts"]["Row"];

export type ShiftWithProfile = Shift & {
  profiles: Pick<Profile, "display_name" | "avatar_url"> | null;
};
export type UserShift = ShiftWithProfile & {
  teams: { name: string } | null;
  roles: { name: string } | null;
};
