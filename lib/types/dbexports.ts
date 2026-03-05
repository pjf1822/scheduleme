import { Database } from "./database";

export type BusyBlock = Database["public"]["Tables"]["busy_blocks"]["Row"];

export type BusyBlockInsert =
  Database["public"]["Tables"]["busy_blocks"]["Insert"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type TeamMember = Database["public"]["Tables"]["team_members"]["Row"] & {
  profiles: Pick<Profile, "display_name" | "avatar_url"> | null;
};
export type TeamRoles = Database["public"]["Tables"]["team_roles"]["Row"];

export type Shifts = Database["public"]["Tables"]["shifts"]["Row"] & {
  profiles: Pick<Profile, "display_name" | "avatar_url"> | null;
};
