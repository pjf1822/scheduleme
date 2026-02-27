import { Database } from "./database";

export type BusyBlock = Database["public"]["Tables"]["busy_blocks"]["Row"];

export type BusyBlockInsert =
  Database["public"]["Tables"]["busy_blocks"]["Insert"];
