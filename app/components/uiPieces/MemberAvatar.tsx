import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamMember } from "@/lib/types/dbexports";

type Props = {
  member?: TeamMember;
  avatarUrl?: string;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-16 w-16",
};

export function MemberAvatar({ member, avatarUrl, name, size = "md" }: Props) {
  const src = member?.profiles?.avatar_url || avatarUrl;
  const displayName = member?.profiles?.display_name || name;

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={src} />
      <AvatarFallback>{displayName?.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );
}
