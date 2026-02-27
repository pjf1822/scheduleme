import Link from "next/link";
import LogoutButton from "./LogoutButton";

const Navbar = ({ userRole }: { userRole: string | null }) => {
  return (
    <div>
      {userRole === "admin" && <Link href="/admin">Admin</Link>}
      <Link href="dashboard">home</Link>
      <LogoutButton />
    </div>
  );
};

export default Navbar;
