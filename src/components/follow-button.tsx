"use client"

import React from "react"
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { FollowerInfo } from "@/lib/prisma/types"
import useFollowerInfo from "@/hooks/useFollowerInfo"

import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"

type Props = {
  userId: string
  initialState: FollowerInfo
}

const FollowButton = (props: Props) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data } = useFollowerInfo(props)

  const queryKey: QueryKey = ["follower-info", props.userId]
  const { mutate } = useMutation({
    mutationFn: async () => {
      if (data.isFollowedByMe) {
        return await kyInstance.post("/api/v1/users/" + props.userId + "/unfollow")
      } else {
        return await kyInstance.post("/api/v1/users/" + props.userId + "/follow")
      }
    },
    async onMutate() {
      await queryClient.cancelQueries({ queryKey })
      const currentState = queryClient.getQueryData<FollowerInfo>(queryKey)
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers: (currentState?.followers || 0) + (currentState?.isFollowedByMe ? -1 : 1),
        isFollowedByMe: currentState?.isFollowedByMe ? false : true,
        isFollowingMe: currentState?.isFollowingMe || false,
      }))

      // Optionally return a context containing data to use when for example rolling back
      return { currentState }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.currentState)
      toast({
        variant: "destructive",
        description: "Failed to follow, Please try again.",
      })
    },
  })

  return (
    <Button variant={data.isFollowedByMe ? "secondary" : "default"} onClick={() => mutate()}>
      {data.isFollowedByMe ? "Unfollow" : "Follow"}
    </Button>
  )
}

export default FollowButton
