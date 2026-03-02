"use server";

import { removeTeamScheduleBlock } from "@/lib/services/teamSchedule";

export async function removeTeamScheduleBlockAction(blockId: string) {
  await removeTeamScheduleBlock(blockId);
}
