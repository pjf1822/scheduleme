"use server";

import { removeBusyBlock } from "@/lib/services/busyBlocks";
import { revalidatePath } from "next/cache";

export async function removeBusyBlockAction(id: string) {
  await removeBusyBlock(id);

  revalidatePath("/dashboard");
}
