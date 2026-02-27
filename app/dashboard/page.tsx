import {
  addBusyBlock,
  getCurrentUserBusyBlocks,
} from "@/lib/services/busyBlocks";

const page = async () => {
  const busyBlocks = await getCurrentUserBusyBlocks();

  console.log(busyBlocks);
  async function handleAdd() {
    "use server";

    await addBusyBlock({
      startTime: new Date("2026-03-01T00:00:00"),
      endTime: new Date("2026-03-05T00:00:00"),
    });
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <form action={handleAdd}>
        <button type="submit">Add Test Busy Block</button>
      </form>
    </div>
  );
};

export default page;
