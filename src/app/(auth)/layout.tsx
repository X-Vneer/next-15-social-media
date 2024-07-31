import { redirect } from "next/navigation"

import { validateRequest } from "@/lib/lucia"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await validateRequest()
  if (user) redirect("/")

  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex w-full max-w-[64rem] overflow-hidden rounded-lg bg-card shadow-xl lg:h-full lg:max-h-[40rem]">
        {children}
      </div>
    </main>
  )
}
