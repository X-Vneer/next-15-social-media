import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Bookmark } from "lucide-react"

import kyInstance from "@/lib/ky"
import { BookmarkInfo } from "@/lib/prisma/types"
import { cn } from "@/lib/utils"
import useBookmarkInfo from "@/hooks/useBookmarkInfo"

import { useToast } from "../ui/use-toast"

interface BookmarkButtonProps {
  postId: string
  initialState: BookmarkInfo
}

export default function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {
  const { toast } = useToast()
  const { isBookmarkedByMe, toggleBookmark } = useBookmarkInfo({ postId, initialState })

  const { mutate } = useMutation({
    mutationFn: (isBookmarkedByMe: boolean) => {
      return isBookmarkedByMe
        ? kyInstance.delete(`/api/v1/posts/${postId}/bookmarks`)
        : kyInstance.post(`/api/v1/posts/${postId}/bookmarks`)
    },
    onMutate: async () => {
      toast({
        description: `Post ${isBookmarkedByMe ? "un" : ""}bookmarked`,
      })
      toggleBookmark()
      return { previousState: isBookmarkedByMe }
    },

    onError(error, variables, context) {
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      })
      toggleBookmark()
    },
  })

  return (
    <button title="Bookmark" onClick={() => mutate(isBookmarkedByMe)} className="flex items-center gap-2">
      <Bookmark className={cn("size-5", isBookmarkedByMe && "fill-primary text-primary")} />
    </button>
  )
}
