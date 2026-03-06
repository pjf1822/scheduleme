import { createBlockFromDate } from "@/lib/utils/dates/createBlockFromDate";
import { useState } from "react";
import { Shifts, TeamRoles } from "@/lib/types/dbexports";
import { createShiftAction } from "../../actions/shifts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  selectedDate: string | null;
  teamId: string;
  roles: TeamRoles[];
  onShiftCreated: (newShifts: Shifts[]) => void;
};
const CreateShift = ({
  selectedDate,
  teamId,
  roles,
  onShiftCreated,
}: Props) => {
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedRoleId) return;
    try {
      const { start_time, end_time } = createBlockFromDate(selectedDate);

      const newShifts = await Promise.all(
        Array.from({ length: quantity }, () =>
          createShiftAction(teamId, selectedRoleId, start_time, end_time),
        ),
      );
      onShiftCreated(newShifts);
      setSelectedRoleId("");
      setQuantity(1);
    } catch (error) {
      console.error("Error creating role slot:", error);
    }
  };

  return (
    <Card className=" mt-0 py-2 max-w-xl mx-auto w-full gap-2 bg-[var(--brand-4)] border border-[var(--brand-3)] border-4 ">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium">Create Shifts</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="grid  grid-cols-2 gap-2">
          <div>
            <Label className="pb-2">Role</Label>

            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger className="w-full text-foreground">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="pb-2">Quantity</Label>

            <Select
              value={String(quantity)}
              onValueChange={(val) => setQuantity(Number(val))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          disabled={!selectedRoleId}
          onClick={handleSubmit}
          className="w-full mt-2"
        >
          {quantity > 1 ? "Create Shifts" : "Create Shift"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateShift;
