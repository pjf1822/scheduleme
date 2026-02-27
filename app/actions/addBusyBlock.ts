"use server";

import { addBusyBlock } from "@/lib/services/busyBlocks";
import { revalidatePath } from "next/cache";

export async function addBusyBlockAction(params: {
  startTime: Date;
  endTime: Date;
}) {
  await addBusyBlock(params);

  revalidatePath("/dashboard");
}
