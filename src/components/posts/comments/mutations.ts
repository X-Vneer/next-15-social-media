import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"

import { commentData, CommentPage } from "@/lib/prisma/types"
import { useToast } from "@/components/ui/use-toast"

import { createComment } from "./actions"

export const useSubmitCommentMutation = (postId: string) => {
  const { toast } = useToast()

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: async (newComment) => {
      if ("error" in newComment) {
        throw Error(newComment.error)
      }
      const queryKey: QueryKey = ["comments", postId]
      await queryClient.cancelQueries({ queryKey })
      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(queryKey, (oldData) => {
        const firstPage = oldData?.pages[0]
        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                comments: [...firstPage.comments, newComment],
                search: firstPage.search,
              },
              ...oldData.pages.slice(1),
            ],
          }
        }
        queryClient.invalidateQueries({ queryKey, predicate: (query) => !query.state.data })
      })
      toast({
        title: "Comment created",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: "Failed to comment, Please try again.",
      })
    },
  })

  return mutation
}
