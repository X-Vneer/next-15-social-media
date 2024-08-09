"use client"

import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Heart } from "lucide-react"

import kyInstance from "@/lib/ky"
import { LikeInfo } from "@/lib/prisma/types"
import { cn } from "@/lib/utils"
import useLikeInfo from "@/hooks/useLikeInfo"

import { useToast } from "../ui/use-toast"

type Props = {
  postId: string
  initialState: LikeInfo
}

const LikeButton = ({ postId, initialState }: Props) => {
  const { toast } = useToast()
  const { LikeInfo, toggleLike } = useLikeInfo({ postId, initialState })

  const endPointUrl = "/api/v1/posts/" + postId + "/reactions"

  const { mutate } = useMutation({
    mutationFn: async (isLikedByMe: boolean) => {
      if (!isLikedByMe) {
        const response = await kyInstance.post(endPointUrl).json()
        return response
      } else {
        const response = await kyInstance.delete(endPointUrl).json()
        return response
      }
    },
    async onMutate() {
      toggleLike()
    },
    onError: (error, variables, context) => {
      console.log("🚀 ~ LikeButton ~ error:", error)
      toast({
        variant: "destructive",
        description: "Failed to like post, Please try again.",
      })
      toggleLike()
    },
  })

  return (
    <button onClick={() => mutate(LikeInfo.isLikedByMe)} className="flex items-center gap-1">
      <Heart className={cn("size-5", LikeInfo.isLikedByMe && "fill-red-500 text-red-500")} />
      <span className="text-sm font-medium tabular-nums">
        {LikeInfo.likes}
        <span className="hidden sm:inline">{LikeInfo.likes === 1 ? " like" : " likes"}</span>
      </span>
    </button>
  )
}

export default LikeButton
