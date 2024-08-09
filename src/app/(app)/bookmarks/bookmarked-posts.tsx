"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import kyInstance from "@/lib/ky"
import { PostsPage } from "@/lib/prisma/types"
import InfiniteScrollContainer from "@/components/common/infinite-scroll-container"
import Post from "@/components/posts/post"
import PostsLoadingSkeleton from "@/components/posts/post-loading-skeleton"

export default function Bookmarks() {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["post-feed", "bookmarks"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/v1/posts/bookmarks", pageParam ? { searchParams: { cursor: pageParam } } : {})
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.search.nextCursor,
  })

  const posts = data?.pages.flatMap((page) => page.posts) || []

  if (status === "pending") {
    return <PostsLoadingSkeleton />
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return <p className="text-center text-muted-foreground">You don&apos;t have any bookmarks yet.</p>
  }

  if (status === "error") {
    return <p className="text-center text-destructive">An error occurred while loading bookmarks.</p>
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  )
}
