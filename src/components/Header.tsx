import Link from "next/link";
import Logo from "@/components/Logo";

export default function Header() {
  return (
    <header className="flex items-center p-4">
      <div className="flex-1"></div>
      <h2>
        <Link href="/" className="select-none">
          <Logo size="xl" />
        </Link>
      </h2>
      <div className="flex-1"></div>
    </header>
  );
}
