import { UserShift } from "@/lib/types/dbexports";

export function createShiftDateMap(shifts: UserShift[]) {
  const map = new Map<string, UserShift[]>();

  shifts.forEach((shift) => {
    const dateKey = new Date(shift.start_time).toLocaleDateString("en-CA");

    if (!map.has(dateKey)) {
      map.set(dateKey, []);
    }

    map.get(dateKey)!.push(shift);
  });

  return map;
}
