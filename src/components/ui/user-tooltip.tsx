"use client"

import React from "react"
import Link from "next/link"
import { useSession } from "@/providers/session-provider"

import { FollowerInfo, UserData } from "@/lib/prisma/types"

import FollowButton from "../follow-button"
import FollowerCount from "../followers-count"
import { Linkify } from "./linkify"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import UserAvatar from "./user-avatar"

type Props = {
  children: React.ReactNode
  user: UserData
}

const UserTooltip = ({ children, user }: Props) => {
  const {
    user: { id: loggedInUserId },
  } = useSession()
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByMe: user.followers.some(({ followerId }) => followerId === loggedInUserId),
    isFollowingMe: user.following.some(({ followingId }) => followingId === loggedInUserId),
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={60} user={user} className="h-20 w-20" />
              </Link>
              {loggedInUserId !== user.id && <FollowButton userId={user.id} initialState={followerInfo} />}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">{user.displayName}</div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">{user.bio}</div>
              </Linkify>
            )}
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default UserTooltip
