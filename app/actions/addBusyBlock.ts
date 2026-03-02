"use server";

import { addBusyBlock } from "@/lib/services/busyBlocks";
import { revalidatePath } from "next/cache";

export async function addBusyBlockAction(params: {
  start_time: string;
  end_time: string;
}) {
  await addBusyBlock(params);

  revalidatePath("/dashboard");
}
