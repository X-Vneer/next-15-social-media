import { redirect } from "next/navigation"
import ReactQueryProvider from "@/providers/react-query-provider"
import { SessionProvider } from "@/providers/session-provider"

import { validateRequest } from "@/lib/lucia"
import Navbar from "@/components/common/header"
import SideBar from "@/components/common/side-bar"
import TrendSidebar from "@/components/common/trends-sidebar"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const result = await validateRequest()
  if (!result.user) redirect("/login")
  return (
    <ReactQueryProvider>
      <SessionProvider value={result}>
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <SideBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          <main className="flex min-h-[110vh] w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">{children}</div>
            <TrendSidebar />
          </main>
        </div>
        <SideBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </SessionProvider>
    </ReactQueryProvider>
  )
}
