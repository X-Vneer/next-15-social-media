import { Metadata } from "next"

import Bookmarks from "./bookmarked-posts"

export const metadata: Metadata = {
  title: "Bookmarks",
}

export default function Page() {
  return (
    <div className="w-full min-w-0 space-y-5">
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
      </div>
      <Bookmarks />
    </div>
  )
}
