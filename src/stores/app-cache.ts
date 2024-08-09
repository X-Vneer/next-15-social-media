import { createStore } from "zustand/vanilla"

import { BookmarkInfo } from "@/lib/prisma/types"

export type AppCache = {
  bookmarks: { [key: string]: BookmarkInfo }
}

export type AppCacheActions = {
  removeBookMark: (id: string) => void
  addBookMark: (id: string) => void
}

export type CacheStore = AppCache & AppCacheActions

export const defaultInitState: AppCache = {
  bookmarks: {},
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
    addBookMark(id) {
      set((state) => ({
        bookmarks: { ...state.bookmarks, [id]: { isBookmarkedByMe: true } },
      }))
    },
  }))
}
