"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import kyInstance from "@/lib/ky"
import { PostsPage } from "@/lib/prisma/types"

import InfiniteScrollContainer from "../common/infinite-scroll-container"
import Post from "./post"
import PostsLoadingSkeleton from "./post-loading-skeleton"

interface UserPostsProps {
  userId: string
}

export default function UserPosts({ userId }: UserPostsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["post-feed", "user-posts", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(`/api/v1/users/${userId}/posts`, pageParam ? { searchParams: { cursor: pageParam } } : {})
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.search.nextCursor,
  })

  const posts = data?.pages.flatMap((page) => page.posts) || []

  if (status === "pending") {
    return <PostsLoadingSkeleton />
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return <p className="text-center text-muted-foreground">This user hasn&apos;t posted anything yet.</p>
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
