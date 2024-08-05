import { useSession } from "@/providers/session-provider"
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"

import { PostsPage } from "@/lib/prisma/types"
import { useToast } from "@/components/ui/use-toast"

import { submitPost } from "./actions"

const useSubmitPostMutation = () => {
  const { user } = useSession()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  return useMutation({
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
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: "Failed to post, Please try again.",
      })
    },
  })
}

export default useSubmitPostMutation
