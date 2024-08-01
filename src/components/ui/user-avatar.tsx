"use client"

import React from "react"
import { useSession } from "@/providers/session-provider"
import { User } from "lucia"
import { User as UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

type Props = {
  className?: string
  user?: Omit<User, "id" | "googleId">
  size?: number
}

const UserAvatar = ({ className, user, size }: Props) => {
  const session = useSession()

  user ??= session.user
  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatarUrl || ""} />
      <AvatarFallback>
        <UserIcon size={size || 24} strokeWidth={1} />
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
