"use client"

import { createContext, useContext } from "react"
import { Session, User } from "lucia"

type SessionType = { user: User; session: Session } | null
export const sessionContext = createContext<SessionType>(null)

export const SessionProvider = ({ children, value }: { children: React.ReactNode; value: SessionType }) => {
  return <sessionContext.Provider value={value}>{children}</sessionContext.Provider>
}

export const useSession = () => {
  const value = useContext(sessionContext)
  if (!value) throw new Error("useSession must be used within a SessionProvider")
  return value
}
