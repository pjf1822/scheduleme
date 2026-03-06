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

  const start = new Date(shift.start_time).toLocaleString();
  const end = new Date(shift.end_time).toLocaleString();

  return (
    <Dialog open={!!shift} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold">
            {shift.teams?.name}
          </DialogTitle>

          {shift.roles?.name && (
            <p className="text-sm text-muted-foreground">{shift.roles.name}</p>
          )}
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Time */}
          <div className="rounded-lg border p-3 bg-muted/30">
            <p className="text-sm font-medium">Shift Time</p>
            <p className="text-sm text-muted-foreground">{start}</p>
            <p className="text-sm text-muted-foreground">{end}</p>
          </div>

          {/* Assigned User */}
          {shift.profiles && (
            <div className="flex items-center gap-3 border-t pt-4">
              {shift.profiles.avatar_url && (
                <img
                  src={shift.profiles.avatar_url}
                  alt={shift.profiles.display_name ?? ""}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}

              <div>
                <p className="text-sm font-medium">
                  {shift.profiles.display_name}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;
