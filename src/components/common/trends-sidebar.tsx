import React, { Suspense } from "react"
import { unstable_cache } from "next/cache"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"
import { getUerDateSelect } from "@/lib/prisma/types"
import { formatNumber } from "@/lib/utils"

import FollowButton from "../follow-button"
import UserAvatar from "../ui/user-avatar"

type Props = {}

const TrendSidebar = (props: Props) => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  )
}

const WhoToFollow = async () => {
  const { user } = await validateRequest()
  if (!user) return null

  const usersToFollow = await prisma.user.findMany({
    select: getUerDateSelect(user.id),
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    take: 5,
  })

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <Link href={`/users/${user.username}`} className="flex items-center gap-3">
            <UserAvatar user={user} />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">{user.displayName}</p>
              <p className="line-clamp-1 break-all text-muted-foreground">@{user.username}</p>
            </div>
          </Link>
          <FollowButton
            userId={user.id}
            initialState={{
              isFollowedByMe: user.followers.some((e) => e.followerId === user.id),
              followers: user._count.followers,
              isFollowingMe: user.following.some((e) => e.followingId === user.id),
            }}
          />
        </div>
      ))}
    </div>
  )
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
    SELECT LOWER(unnest(regexp_matches(content,'#[[:alnum:]_]+'))) AS hashtag, COUNT(*) AS count
    FROM posts
    GROUP BY (hashtag)
    ORDER BY count DESC, hashtag ASC
    LIMIT 5
    `

    return result.map((row) => ({ hashtag: row.hashtag, count: Number(row.count) }))
  },
  ["trending-topics"],
  { revalidate: 3 * 60 * 60 },
)

const TrendingTopics = async () => {
  const trendingTopics = await getTrendingTopics()

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1]

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p className="line-clamp-1 break-all font-semibold hover:underline" title={hashtag}>
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        )
      })}
    </div>
  )
}

export default TrendSidebar
