"use client"

import { FollowerInfo } from "@/lib/prisma/types"
import { formatNumber } from "@/lib/utils"
import useFollowerInfo from "@/hooks/useFollowerInfo"

interface FollowerCountProps {
  userId: string
  initialState: FollowerInfo
}

export default function FollowerCount({ userId, initialState }: FollowerCountProps) {
  const { data } = useFollowerInfo({ userId, initialState })

  return (
    <span>
      Followers: <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  )
}
