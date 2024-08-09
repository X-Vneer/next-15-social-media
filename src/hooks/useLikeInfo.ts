import { useCache } from "@/stores/app-cache-provider"

import { LikeInfo } from "@/lib/prisma/types"

type Args = {
  postId: string
  initialState: LikeInfo
}

const useLikeInfo = (Args: Args) => {
  const cache = useCache((state) => ({
    addLike: state.addLike,
    removeLike: state.removeLike,
    likes: state.likes,
  }))
  const LikeInfo = cache.likes[Args.postId] ?? Args.initialState

  const { removeLike, addLike } = cache

  const toggleLike = () => {
    console.log("toggle like")
    if (LikeInfo.isLikedByMe) {
      removeLike(Args.postId)
    } else {
      addLike(Args.postId)
    }
  }

  return {
    LikeInfo,
    toggleLike,
  }
}

export default useLikeInfo
