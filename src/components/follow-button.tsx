import React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

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

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (data.isFollowedByMe) {
        return await kyInstance.post("/api/v1/users/" + props.userId + "/unfollow")
      } else {
        return await kyInstance.post("/api/v1/users/" + props.userId + "/follow")
      }
    },
  })

  return (
    <Button variant={data.isFollowedByMe ? "secondary" : "default"} onClick={() => mutate()}>
      {data.isFollowedByMe ? "Unfollow" : "Follow"}
    </Button>
  )
}

export default FollowButton
