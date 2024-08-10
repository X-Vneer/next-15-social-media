import { Metadata } from "next"

import Notifications from "./notifications"

export const metadata: Metadata = {
  title: "Notifications",
}

export default function Page() {
  return (
    <div className="w-full min-w-0 space-y-5">
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Notifications</h1>
      </div>
      <Notifications />
    </div>
  )
}
