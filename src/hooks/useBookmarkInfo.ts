import React, { useState } from "react"
import { useCache } from "@/stores/app-cache-provider"

import { BookmarkInfo } from "@/lib/prisma/types"

type Args = {
  postId: string
  initialState: BookmarkInfo
}

const useBookmarkInfo = (Args: Args) => {
  const cache = useCache((state) => state)
  const [isBookmarkedByMe, setIsBookmarkedByMe] = useState(
    cache.bookmarks[Args.postId]
      ? cache.bookmarks[Args.postId].isBookmarkedByMe
      : Args.initialState.isBookmarkedByMe,
  )

  const { removeBookMark, addBookMark } = cache

  const toggleBookmark = () => {
    if (isBookmarkedByMe) {
      removeBookMark(Args.postId)
      setIsBookmarkedByMe(false)
    } else {
      addBookMark(Args.postId)
      setIsBookmarkedByMe(true)
    }
  }

  return {
    isBookmarkedByMe,
    toggleBookmark,
  }
}

export default useBookmarkInfo
