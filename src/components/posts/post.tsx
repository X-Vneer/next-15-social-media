"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "@/providers/session-provider"
import { Media } from "@prisma/client"

import { PostData } from "@/lib/prisma/types"
import { cn, formatRelativeDate } from "@/lib/utils"

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

      {!!props.attachments.length && <MediaPreviews attachments={props.attachments} />}
    </article>
  )
}

export default Post

interface MediaPreviewsProps {
  attachments: Media[]
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div className={cn("flex flex-col gap-3", attachments.length > 1 && "sm:grid sm:grid-cols-2")}>
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  )
}

interface MediaPreviewProps {
  media: Media
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    )
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video src={media.url} controls className="mx-auto size-fit max-h-[30rem] rounded-2xl" />
      </div>
    )
  }

  return <p className="text-destructive">Unsupported media type</p>
}
