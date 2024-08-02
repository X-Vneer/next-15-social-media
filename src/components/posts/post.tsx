"use client"

import React from "react"
import Link from "next/link"
import { useSession } from "@/providers/session-provider"

import { PostData } from "@/lib/prisma/types"
import { formatRelativeDate } from "@/lib/utils"

import { Linkify } from "../ui/linkify"
import UserAvatar from "../ui/user-avatar"
import UserTooltip from "../ui/user-tooltip"
import PostMoreButton from "./post-more-button"

type Props = PostData

const Post = (props: Props) => {
  const { user } = useSession()
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${props.user.username}`}>
            <UserAvatar user={props.user} />
          </Link>
          <div>
            <UserTooltip user={props.user}>
              <Link href={`/users/${props.user.username}`} className="block font-medium hover:underline">
                {props.user.displayName}
              </Link>
            </UserTooltip>
            <Link href={`/posts/${props.id}`} className="block text-sm text-muted-foreground hover:underline">
              {formatRelativeDate(props.createdAt)}
            </Link>
          </div>
        </div>
        {props.user.id === user.id && <PostMoreButton post={props} className="shrink-0 transition-opacity" />}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{props.content}</div>
      </Linkify>
    </article>
  )
}

export default Post
