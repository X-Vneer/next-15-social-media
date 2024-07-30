"use client"

import React from "react"
import { useSession } from "@/providers/session-provider"
import { User } from "lucia"

import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

type Props = {
  className?: string
  user?: Omit<User, "id" | "googleId">
}

const UserAvatar = ({ className, user }: Props) => {
  const session = useSession()

  user ??= session.user
  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatarUrl || ""} />
      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
