import { redirect } from "next/navigation"
import ReactQueryProvider from "@/providers/react-query-provider"
import { SessionProvider } from "@/providers/session-provider"

import { validateRequest } from "@/lib/lucia"
import Navbar from "@/components/common/header"
import SideBar from "@/components/common/side-bar"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const result = await validateRequest()
  if (!result.user) redirect("/login")
  return (
    <ReactQueryProvider>
      <SessionProvider value={result}>
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <SideBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <SideBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </SessionProvider>
    </ReactQueryProvider>
  )
}
