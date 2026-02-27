import {
  addBusyBlock,
  getCurrentUserBusyBlocks,
} from "@/lib/services/busyBlocks";
import CalendarComp from "../components/CalendarComp";

const page = async () => {
  const busyBlocks = await getCurrentUserBusyBlocks();

  return (
    <div>
      <h1>Dashboard</h1>
      <CalendarComp busyBlocks={busyBlocks} />
    </div>
  );
};

export default page;
