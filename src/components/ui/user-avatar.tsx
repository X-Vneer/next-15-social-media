"use client"

import React from "react"
import { useSession } from "@/providers/session-provider"

import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

type Props = {
  className?: string
}

const UserAvatar = ({ className }: Props) => {
  const { user } = useSession()
  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatarUrl || ""} />
      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
