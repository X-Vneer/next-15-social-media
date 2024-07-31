import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { FollowerInfo } from "@/lib/prisma/types"

const useFollowerInfo = ({ userId, initialState }: { userId: string; initialState: FollowerInfo }) => {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: async () => {
      return kyInstance.get("/api/v1/users/" + userId + "/followers").json<FollowerInfo>()
    },
    initialData: initialState,
    // to prevent revalidate automatically
    staleTime: Infinity,
  })

  return query
}

export default useFollowerInfo
