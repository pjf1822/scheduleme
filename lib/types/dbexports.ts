import { Database } from "./database";

export type BusyBlock = Database["public"]["Tables"]["busy_blocks"]["Row"];

export type BusyBlockInsert =
  Database["public"]["Tables"]["busy_blocks"]["Insert"];

export type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

export type TeamSchedule = Database["public"]["Tables"]["team_schedule"]["Row"];
export type TeamRoles = Database["public"]["Tables"]["team_roles"]["Row"];
