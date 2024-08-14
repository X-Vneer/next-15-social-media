"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import kyInstance from "@/lib/ky"
import { PostsPage } from "@/lib/prisma/types"
import InfiniteScrollContainer from "@/components/common/infinite-scroll-container"
import Post from "@/components/posts/post"
import PostsLoadingSkeleton from "@/components/posts/post-loading-skeleton"

interface SearchResultsProps {
  query: string
}

export default function SearchResults({ query }: SearchResultsProps) {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["post-feed", "search", query],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get("/api/v1/search", {
            searchParams: {
              q: query,
              ...(pageParam ? { cursor: pageParam } : {}),
            },
          })
          .json<PostsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.search.nextCursor,
      gcTime: 0,
    })

  const posts = data?.pages.flatMap((page) => page.posts) || []

  if (status === "pending") {
    return <PostsLoadingSkeleton />
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return <p className="text-center text-muted-foreground">No posts found for this query.</p>
  }

  if (status === "error") {
    return <p className="text-center text-destructive">An error occurred while loading posts.</p>
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
