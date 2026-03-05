"use server";

import { addBusyBlock, removeBusyBlock } from "@/lib/services/busyBlocks";
import { revalidatePath } from "next/cache";

// 2
export async function addBusyBlockAction(params: {
  start_time: string;
  end_time: string;
}) {
  await addBusyBlock(params);

  revalidatePath("/dashboard");
}
// 3
export async function removeBusyBlockAction(id: string) {
  await removeBusyBlock(id);

  revalidatePath("/dashboard");
}
