import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserShift } from "@/lib/types/dbexports";

type Props = {
  shift: UserShift | null;
  onClose: () => void;
};

const EventDetailModal = ({ shift, onClose }: Props) => {
  if (!shift) return null;

  return (
    <Dialog open={!!shift} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{shift.teams?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p>
            <strong>Start:</strong>{" "}
            {new Date(shift.start_time).toLocaleString()}
          </p>

          <p>
            <strong>End:</strong> {new Date(shift.end_time).toLocaleString()}
          </p>

          <p>
            <strong>Assigned to:</strong> {shift.profiles?.display_name}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;
