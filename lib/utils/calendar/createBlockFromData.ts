export function createBlockFromDate(dateStr: string) {
  return {
    start_time: new Date(`${dateStr}T00:00:01`).toISOString(),
    end_time: new Date(`${dateStr}T23:59:59`).toISOString(),
  };
}
