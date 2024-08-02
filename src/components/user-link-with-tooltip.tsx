import React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { HTTPError } from "ky"

import kyInstance from "@/lib/ky"
import { UserData } from "@/lib/prisma/types"

import UserTooltip from "./ui/user-tooltip"

type Props = {
  username: string
  children: React.ReactNode
}

const UserLinkWithTooltip = ({ username, children }: Props) => {
  const query = useQuery({
    queryKey: ["user-data", username],
    queryFn: () => kyInstance(`/api/v1/users/username/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response?.status === 404) return false
      return failureCount < 3
    },
    staleTime: Infinity,
  })

  if (!query.data)
    return (
      <Link href={`/users/${username}`} className="text-primary hover:underline">
        {children}
      </Link>
    )

  return (
    <UserTooltip user={query.data}>
      <Link href={`/users/${username}`} className="text-primary hover:underline">
        {children}
      </Link>
    </UserTooltip>
  )
}

export default UserLinkWithTooltip
