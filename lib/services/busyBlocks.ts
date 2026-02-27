import { getBusyBlocksByUserId, insertBusyBlock } from "@/lib/db/busyBlocks";
import { createClient } from "../supabase/server";

export async function getCurrentUserBusyBlocks() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const busyBlocks = await getBusyBlocksByUserId(user.id);

  return busyBlocks;
}

export async function addBusyBlock(params: { startTime: Date; endTime: Date }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  if (params.endTime <= params.startTime) {
    throw new Error("End time must be after start time");
  }

  return insertBusyBlock({
    userId: user.id,
    startTime: params.startTime.toISOString(),
    endTime: params.endTime.toISOString(),
  });
}
