import React, { useState } from "react"
import { useCache } from "@/stores/app-cache-provider"

import { BookmarkInfo } from "@/lib/prisma/types"

type Args = {
  postId: string
  initialState: BookmarkInfo
}

const useBookmarkInfo = (Args: Args) => {
  const cache = useCache((state) => state)

  const bookmarkInfo = cache.bookmarks[Args.postId] ?? Args.initialState

  const { removeBookMark, addBookMark } = cache

  const toggleBookmark = () => {
    if (bookmarkInfo.isBookmarkedByMe) {
      removeBookMark(Args.postId)
    } else {
      addBookMark(Args.postId)
    }
  }

  return {
    isBookmarkedByMe: bookmarkInfo.isBookmarkedByMe,
    toggleBookmark,
  }
}

export default useBookmarkInfo
