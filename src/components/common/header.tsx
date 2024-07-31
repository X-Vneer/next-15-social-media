import Link from "next/link"

import SearchInput from "../ui/search-input"
import UserButton from "./user-button"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-5 py-3 sm:gap-5">
        <Link href="/" className="text-xl font-bold text-primary sm:text-2xl">
          bugbook
        </Link>
        <SearchInput />
        <UserButton className="shrink-0 sm:ms-auto" />
      </div>
    </header>
  )
}
