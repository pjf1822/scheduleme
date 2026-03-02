import { getBusyBlocksByUserId, insertBusyBlock } from "@/lib/db/busyBlocks";
import { createClient } from "../supabase/server";
// FOR USER
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

export async function addBusyBlock(params: {
  start_time: string;
  end_time: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const startTime = new Date(params.start_time);
  const endTime = new Date(params.end_time);

  if (endTime <= startTime) {
    throw new Error("End time must be after start time");
  }

  return insertBusyBlock({
    userId: user.id,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  });
}

import { deleteBusyBlock } from "@/lib/db/busyBlocks";

export async function removeBusyBlock(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  return deleteBusyBlock(id);
}

//FOR ADMIN
export async function getBusyBlocksByUserIds(userIds: string[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("busy_blocks")
    .select("*")
    .in("user_id", userIds);

  if (error) throw error;

  return data;
}
