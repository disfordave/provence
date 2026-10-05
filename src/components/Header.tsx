import Logo from "@/components/Logo";
import Link from "next/link";
import ThemeColorButton from "@/components/ThemeColorButton";
import SearchBar from "@/components/SearchBar";

export default function Header() {
  return (
    <>
      <header className="flex items-center gap-4 p-4">
        <div className="flex-1">
          <ThemeColorButton />
        </div>
        <h2 className="">
          <Link href="/" className="select-none">
            <div className="hidden sm:block">
              <Logo size="xl" />
            </div>
            <div className="block sm:hidden">
              <Logo size="xl" showLogoOnly />
            </div>
          </Link>
        </h2>
        <div className="flex flex-1 justify-end">
          <SearchBar />
        </div>
      </header>
    </>
  );
}
