import { redirect } from "next/navigation"
import { SessionProvider } from "@/providers/session-provider"

import { validateRequest } from "@/lib/lucia"
import Navbar from "@/components/common/header"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const result = await validateRequest()
  if (!result.user) redirect("/login")
  return (
    <SessionProvider value={result}>
      <Navbar />
      {children}
    </SessionProvider>
  )
}
