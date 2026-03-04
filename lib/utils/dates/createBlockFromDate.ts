export function createBlockFromDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);

  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);

  return {
    start_time: start.toISOString(),
    end_time: end.toISOString(),
  };
}
