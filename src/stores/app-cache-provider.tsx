"use client"

import { createContext, useContext, useRef, type ReactNode } from "react"
import { createCacheStore, initCacheStore, type CacheStore } from "@/stores/app-cache"
import { useStore, type StoreApi } from "zustand"
import { useShallow } from "zustand/react/shallow"

export const CacheStoreContext = createContext<StoreApi<CacheStore> | null>(null)

export interface CacheStoreProviderProps {
  children: ReactNode
}

export const CacheStoreProvider = ({ children }: CacheStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CacheStore>>()
  if (!storeRef.current) {
    storeRef.current = createCacheStore(initCacheStore())
  }

  return <CacheStoreContext.Provider value={storeRef.current}>{children}</CacheStoreContext.Provider>
}

export const useCache = <T,>(selector: (store: CacheStore) => T): T => {
  const cache = useContext(CacheStoreContext)

  if (!cache) {
    throw new Error(`useCache must be use within CacheStoreProvider`)
  }

  return useStore(cache, useShallow(selector))
}
