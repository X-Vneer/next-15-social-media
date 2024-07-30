"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { PostData } from "@/lib/prisma/types"

import Post from "./posts/post"

type Props = {}

const ForYouFeed = (props: Props) => {
  const query = useQuery<PostData[]>({
    queryKey: ["posts-feed", "for-you"],
    queryFn: async () => {
      const res = await fetch("/api/v1/posts/for-you")
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`)
      }
      return res.json()
    },
  })

  if (query.status === "pending") {
    return (
      <div className="my-20">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    )
  }

  if (query.status === "error") {
    return (
      <div>
        <p className="text-center text-destructive">An error occurred while loading posts</p>
      </div>
    )
  }

  return (
    <>
      {query.data.map((post) => {
        return <Post key={post.id} {...post} />
      })}
    </>
  )
}

export default ForYouFeed
