"use client"

import React from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import kyInstance from "@/lib/ky"
import { PostsPage } from "@/lib/prisma/types"

import InfiniteScrollContainer from "./infinite-scroll-container"
import Post from "./posts/post"
import { Button } from "./ui/button"

type Props = {}

const ForYouFeed = (props: Props) => {
  const { data, fetchNextPage, hasNextPage, status, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["posts-feed", "for-you"],
    queryFn: async ({ pageParam }) => {
      return await kyInstance
        .get("/api/v1/posts/for-you", {
          searchParams: {
            cursor: pageParam || "",
          },
        })
        .json<PostsPage>()
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.search.nextCursor,
  })

  if (status === "pending") {
    return (
      <div>
        <Loader2 className="mx-auto my-10 animate-spin" />
      </div>
    )
  }

  if (status === "error") {
    return (
      <div>
        <p className="text-center text-destructive">An error occurred while loading posts</p>
      </div>
    )
  }

  const posts = data.pages.flatMap((page) => page.posts)

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => {
        if (!hasNextPage || isFetching || isFetchingNextPage) return
        fetchNextPage()
      }}>
      {posts.map((post) => {
        return <Post key={post.id} {...post} />
      })}
      {isFetchingNextPage ? <Loader2 className="mx-auto my-5 animate-spin" /> : null}
    </InfiniteScrollContainer>
  )
}

export default ForYouFeed
