"use client"

import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Heart } from "lucide-react"

import kyInstance from "@/lib/ky"
import { LikeInfo } from "@/lib/prisma/types"
import { cn } from "@/lib/utils"

import { useToast } from "../ui/use-toast"

type Props = {
  postId: string
  initialState: LikeInfo
}

const LikeButton = ({ postId, initialState }: Props) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const queryKey: QueryKey = ["like-info", postId]
  const endPointUrl = "/api/v1/posts/" + postId + "/reactions"
  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      return kyInstance.get(endPointUrl).json<LikeInfo>()
    },
    initialData: initialState,
    // to prevent revalidate automatically
    staleTime: Infinity,
  })
  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!data.isLikedByMe) {
        const response = await kyInstance.post(endPointUrl).json()
        return response
      } else {
        const response = await kyInstance.delete(endPointUrl).json()
        return response
      }
    },
    async onMutate() {
      await queryClient.cancelQueries({ queryKey })
      const currentState = queryClient.getQueryData<LikeInfo>(queryKey)
      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes: (currentState?.likes || 0) + (currentState?.isLikedByMe ? -1 : 1),
        isLikedByMe: !currentState?.isLikedByMe,
      }))

      // Optionally return a context containing data to use when for example rolling back
      return { currentState }
    },
    onError: (error, variables, context) => {
      console.log("🚀 ~ LikeButton ~ error:", error)
      queryClient.setQueryData(queryKey, context?.currentState)
      toast({
        variant: "destructive",
        description: "Failed to like post, Please try again.",
      })
    },
  })

  return (
    <button onClick={() => mutate()} className="flex items-center gap-1">
      <Heart className={cn("size-5", data.isLikedByMe && "fill-red-500 text-red-500")} />
      <span className="text-sm font-medium tabular-nums">
        {data.likes}
        <span className="hidden sm:inline">{data.likes === 1 ? " like" : " likes"}</span>
      </span>
    </button>
  )
}

export default LikeButton
