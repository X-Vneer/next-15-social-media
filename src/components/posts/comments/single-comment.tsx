import Link from "next/link"
import { useSession } from "@/providers/session-provider"

import { commentData } from "@/lib/prisma/types"
import { formatRelativeDate } from "@/lib/utils"
import UserAvatar from "@/components/ui/user-avatar"
import UserTooltip from "@/components/ui/user-tooltip"

interface CommentProps {
  comment: commentData
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useSession()

  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar user={comment.user} size={30} />
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.user}>
            <Link href={`/users/${comment.user.username}`} className="font-medium hover:underline">
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">{formatRelativeDate(comment.createdAt)}</span>
        </div>
        <div>{comment.content}</div>
      </div>
      {/* {comment.user.id === user.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )} */}
    </div>
  )
}