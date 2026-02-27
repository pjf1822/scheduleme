export function createBusyBlockFromDate(dateStr: string) {
  return {
    startTime: new Date(`${dateStr}T00:00:01`),
    endTime: new Date(`${dateStr}T23:59:59`),
  };
}
