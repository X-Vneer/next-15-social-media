import { redirect } from "next/navigation"

import { validateRequest } from "@/lib/lucia"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await validateRequest()
  if (user) redirect("/")

  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-lg bg-card shadow-xl">
        {children}
      </div>
    </main>
  )
}
