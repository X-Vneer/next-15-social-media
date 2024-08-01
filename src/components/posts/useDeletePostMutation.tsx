import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"

import { PostData, PostsPage } from "@/lib/prisma/types"

import { useToast } from "../ui/use-toast"
import { deletePost } from "./actions"

const useDeletePostMutation = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathName = usePathname()

  const mutation = useMutation({
    mutationFn: deletePost,
    async onSuccess(deletedPost) {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      }
      // here we cancel any ongoing queries to prevent bugs with infinite scroll
      await queryClient.cancelQueries(queryFilter)
      // here we mutate the cash directly for better performance
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(queryFilter, (oldData) => {
        if (!oldData) return
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => {
            return {
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
              search: page.search,
            }
          }),
        }
      })
      toast({
        description: "Post deleted successfully",
      })

      if (pathName === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`)
      }
    },
    onError(error: any) {
      console.log("🚀 ~ onError ~ error:", error)
      toast({
        variant: "destructive",
        description: "Failed to delete post, Please try again.",
      })
    },
  })

  return mutation
}

export default useDeletePostMutation
