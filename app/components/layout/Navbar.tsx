import Link from "next/link";
import LogoutButton from "./LogoutButton";

const Navbar = ({
  userRole,
  email,
}: {
  userRole: string | null;
  email: string;
}) => {
  return (
    <nav className="w-full border-b bg-brand-2 mb-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-0 py-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold">
            Home
          </Link>
          <span className="text-muted-foreground">{email}</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {userRole === "admin" && (
            <Link href="/admin" className="btn w-32 rounded-full">
              Admin
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
