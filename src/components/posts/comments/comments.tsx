"use client"

import React from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import kyInstance from "@/lib/ky"
import { CommentPage, PostData } from "@/lib/prisma/types"
import { Button } from "@/components/ui/button"

import CommentInput from "./comment-input"
import Comment from "./single-comment"

type Props = PostData

const Comments = (post: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetching, status } = useInfiniteQuery({
    queryKey: ["comments", post.id],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(`/api/v1/posts/${post.id}/comments`, pageParam ? { searchParams: { cursor: pageParam } } : {})
        .json<CommentPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.search.curser,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  })

  const comments = data?.pages.flatMap((page) => page.comments) || []

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}>
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">An error occurred while loading comments.</p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}

export default Comments
