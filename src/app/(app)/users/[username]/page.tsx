import { cache } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { formatDate } from "date-fns"

// import { User } from "lucia"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { FollowerInfo, getUerDateSelect, UserData } from "@/lib/prisma/types"
import { formatNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/ui/user-avatar"
import TrendSidebar from "@/components/common/trends-sidebar"
import FollowButton from "@/components/follow-button"
import FollowerCount from "@/components/followers-count"
import UserPosts from "@/components/posts/user-posts"

// import { formatNumber, formatRelativeDate } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import UserAvatar from "@/components/ui/user-avatar"
// import FollowButton from "@/components/follow-button"

export const getUser = cache(async (username: string) => {
  console.log("🚀 ~ getUser ~ username:", username)
  const session = await validateRequest()
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
      },
    },
    select: getUerDateSelect(session.user!.id),
  })
  if (!user) notFound()

  return user
})

export async function generateMetadata({
  params: { username },
}: {
  params: { username: string }
}): Promise<Metadata> {
  const user = await getUser(username)
  return {
    title: `${user.displayName} @${user.username}`,
  }
}
export default async function Page({ params }: { params: { username: string } }) {
  const session = await validateRequest()
  if (!session) return <p className="my-10 text-center text-destructive">Not logged in!</p>
  const user = await getUser(params.username)

  return (
    <>
      <UserProfile user={user} loggedInUserId={session.user!.id} />
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="text-center text-2xl font-bold">{user.displayName}&apos;s posts</h2>
      </div>
      <UserPosts userId={user.id} />
    </>
  )
}

interface UserProfileProps {
  user: UserData
  loggedInUserId: string
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByMe: user.followers.some(({ followerId }) => followerId === loggedInUserId),
    isFollowingMe: user.following.some(({ followingId }) => followingId === loggedInUserId),
  }

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        user={user}
        size={210}
        className="mx-auto aspect-square size-full h-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex grow flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts: <span className="font-semibold">{formatNumber(user._count.posts)}</span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">{user.bio}</div>
        </>
      )}
    </div>
  )
}
