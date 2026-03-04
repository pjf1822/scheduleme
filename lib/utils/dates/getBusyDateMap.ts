type BusyBlock = {
  id: string;
  start_time: string | Date;
  end_time: string | Date;
};
function toDateKey(date: Date) {
  return date.toLocaleDateString("en-CA");
}

export function getBusyDateMap(busyBlocks: BusyBlock[]) {
  const map = new Map<string, string>();

  busyBlocks.forEach((block) => {
    const start = new Date(block.start_time);
    const end = new Date(block.end_time);

    const current = new Date(start);
    current.setHours(0, 0, 0, 0);
    while (current <= end) {
      map.set(toDateKey(current), block.id);
      current.setDate(current.getDate() + 1);
    }
  });

  return map;
}
