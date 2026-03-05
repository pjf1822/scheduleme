import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  member?: any;
  avatarUrl?: string;
  name?: string;
  size?: string;
};

export function MemberAvatar({
  member,
  avatarUrl,
  name,
  size = "h-8 w-8",
}: Props) {
  const src = member?.profiles?.avatar_url || avatarUrl;
  const displayName = member?.profiles?.display_name || name;

  return (
    <Avatar className={size}>
      <AvatarImage src={src} />
      <AvatarFallback>{displayName?.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );
}
