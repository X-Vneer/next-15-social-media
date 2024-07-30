import React from "react"
import Link from "next/link"

import { PostData } from "@/lib/prisma/types"
import { formatRelativeDate } from "@/lib/utils"

import UserAvatar from "../ui/user-avatar"

type Props = PostData

const Post = (props: Props) => {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Link href={`/users/${props.user.username}`}>
          <UserAvatar user={props.user} />
        </Link>
        <div>
          <Link href={`/users/${props.user.username}`} className="block font-medium hover:underline">
            {props.user.displayName}
          </Link>
          <Link href={`/posts/${props.id}`} className="block text-sm text-muted-foreground hover:underline">
            {formatRelativeDate(props.createdAt)}
          </Link>
        </div>
      </div>
      <div className="whitespace-pre-line break-words">{props.content}</div>
    </article>
  )
}

export default Post
