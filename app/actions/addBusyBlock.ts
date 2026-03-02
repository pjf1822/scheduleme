"use server";

import { addBusyBlock } from "@/lib/services/busyBlocks";
import { revalidatePath } from "next/cache";

export async function addBusyBlockAction(params: {
  start_time: Date;
  end_time: Date;
}) {
  await addBusyBlock(params);

  revalidatePath("/dashboard");
}
