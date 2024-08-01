"use client"

import React, { useState } from "react"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import UserAvatar from "@/components/ui/user-avatar"

import { submitPost } from "./actions"

import "./style.css"

import { useSession } from "@/providers/session-provider"
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"

import { PostData, PostsPage } from "@/lib/prisma/types"
import LoadingButton from "@/components/ui/loading-button"
import { useToast } from "@/components/ui/use-toast"

type Props = {}

const Editor = (props: Props) => {
  const myEditor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's in your head",
      }),
    ],
  })

  const input =
    myEditor?.getText({
      blockSeparator: "\n",
    }) || ""

  const { user } = useSession()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { error, isPending, mutate } = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      if ("error" in newPost) {
        throw Error(newPost.error)
      }

      // query filter is a queryKey that select user for-you feeds and user-posts for logged in user when posting a new post
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate: (query) => {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") && query.queryKey.includes(user.id))
          )
        },
      } satisfies QueryFilters

      // here we cancel any ongoing queries to prevent bugs with infinite scroll
      await queryClient.cancelQueries(queryFilter)
      // here we mutate the cash directly for better performance
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(queryFilter, (oldData) => {
        const firstPage = oldData?.pages[0]
        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                posts: [newPost, ...firstPage.posts],
                search: firstPage.search,
              },
              ...oldData.pages.slice(1),
            ],
          }
        }

        // if there was NO first page we invalidate queries to fetch the first page
        // incase we canceled the query we need to fetch the first page
        queryClient.invalidateQueries({
          queryKey: queryFilter.queryKey,
          predicate: (query) => {
            return queryFilter.predicate(query) && !query.state.data
          },
        })
      })
      myEditor?.commands.clearContent()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: "Failed to post, Please try again.",
      })
    },
  })

  function onSubmit() {
    mutate(input)
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar />
        <EditorContent
          editor={myEditor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      {error ? (
        <span className="text-sm font-semibold text-red-600">{error.message || "something went wrong!"}</span>
      ) : null}
      <div className="flex justify-end">
        <LoadingButton loading={isPending} onClick={onSubmit} disabled={!input.trim()} className="min-w-20">
          Post
        </LoadingButton>
      </div>
    </div>
  )
}

export default Editor
