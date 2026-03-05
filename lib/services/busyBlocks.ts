import {
  deleteBusyBlock,
  fetchBusyBlocksByUserIds,
  fetchBusyBlocksByUserId,
  insertBusyBlock,
} from "@/lib/db/busyBlocks";
import { createClient } from "../supabase/server";
// FOR USER
//. 1
export async function getCurrentUserBusyBlocks() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const busyBlocks = await fetchBusyBlocksByUserId(user.id);

  return busyBlocks;
}
//. 2
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
//. 3
export async function removeBusyBlock(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  return deleteBusyBlock(id);
}

//FOR ADMIN
//. 4
export async function getBusyBlocksByUserIds(userIds: string[]) {
  return fetchBusyBlocksByUserIds(userIds);
}
