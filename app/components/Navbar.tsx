import Link from "next/link";
import LogoutButton from "./LogoutButton";

const Navbar = ({
  userRole,
  email,
}: {
  userRole: string | null;
  email: string | null;
}) => {
  return (
    <div>
      {userRole === "admin" && <Link href="/admin">Admin</Link>}
      {email}
      <Link href="dashboard">home</Link>
      <LogoutButton />
    </div>
  );
};

export default Navbar;
