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
  console.log(shift);

  const date = new Date(shift.start_time).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <Dialog open={!!shift} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[var(--brand-3)]">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold">
            {shift.teams?.name}
          </DialogTitle>

          {shift.roles?.name && (
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: shift.roles.color ?? "#64748b" }}
              />
              <p className="text-sm text-muted-foreground">
                {shift.roles.name}
              </p>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-4 mt-4 bg-[var(--brand-4)] p-2 rounded-lg">
          {/* Time */}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Shift Date
            </p>
            <p className="text-sm font-medium">{date}</p>
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
