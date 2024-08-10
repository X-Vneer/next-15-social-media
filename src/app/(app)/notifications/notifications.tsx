"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import kyInstance from "@/lib/ky"
import { NotificationPage } from "@/lib/prisma/types"
import InfiniteScrollContainer from "@/components/common/infinite-scroll-container"
import PostsLoadingSkeleton from "@/components/posts/post-loading-skeleton"

import Notification from "./notification"

export default function Notifications() {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["post-feed", "Notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/v1/notifications", pageParam ? { searchParams: { cursor: pageParam } } : {})
        .json<NotificationPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.search.curser,
  })

  const notifications = data?.pages.flatMap((page) => page.notifications) || []

  if (status === "pending") {
    return <PostsLoadingSkeleton />
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return <p className="text-center text-muted-foreground">You don&apos;t have any notifications yet.</p>
  }

  if (status === "error") {
    return <p className="text-center text-destructive">An error occurred while loading notifications.</p>
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  )
}
