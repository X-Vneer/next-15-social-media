import { createStore } from "zustand/vanilla"

import { BookmarkInfo, LikeInfo } from "@/lib/prisma/types"

export type AppCache = {
  bookmarks: { [key: string]: BookmarkInfo }
  likes: { [key: string]: LikeInfo }
}

export type AppCacheActions = {
  removeBookMark: (id: string) => void
  addBookMark: (id: string) => void
  removeLike: (id: string) => void
  addLike: (id: string) => void
}

export type CacheStore = AppCache & AppCacheActions

export const defaultInitState: AppCache = {
  bookmarks: {},
  likes: {},
}
export const initCacheStore = (): AppCache => {
  return { ...defaultInitState }
}

export const createCacheStore = (initState: AppCache = defaultInitState) => {
  return createStore<CacheStore>()((set, get) => ({
    ...initState,
    removeBookMark(id) {
      set((state) => ({
        bookmarks: { ...state.bookmarks, [id]: { isBookmarkedByMe: false } },
      }))
    },
    removeLike(id) {
      set((state) => ({
        likes: { ...state.likes, [id]: { isLikedByMe: false, likes: (state.likes[id]?.likes ?? 0) - 1 } },
      }))
    },
    addLike(id) {
      set((state) => ({
        likes: { ...state.likes, [id]: { isLikedByMe: true, likes: (state.likes[id]?.likes ?? 0) + 1 } },
      }))
    },
    addBookMark(id) {
      set((state) => ({
        bookmarks: { ...state.bookmarks, [id]: { isBookmarkedByMe: true } },
      }))
    },
  }))
}
