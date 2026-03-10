import Link from "next/link";
import LogoutButton from "./LogoutButton";
import Image from "next/image";

const Navbar = ({
  userRole,
  email,
}: {
  userRole: string | null;
  email: string;
}) => {
  return (
    <nav className="w-full border-b bg-brand-2 mb-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-start gap-2 sm:gap-6 text-center sm:text-left">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={90}
              priority
            />
          </Link>
          <span className="text-muted-foreground truncate max-w-[180px] sm:max-w-none">
            {email}
          </span>
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-4 text-sm">
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
