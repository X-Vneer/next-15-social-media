import React from "react"
import { useRouter } from "next/navigation"
import { type UpdateUserProfile as UpdateUserProfileType } from "@/validation/update-user-schema"
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"

import { PostsPage } from "@/lib/prisma/types"
import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "@/components/ui/use-toast"

import { UpdateUserProfile } from "./actions"

const useUpdateProfileMutation = () => {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { startUpload: startAvatarUpload } = useUploadThing("avatar")
  const mutation = useMutation({
    mutationFn: async ({ values, avatar }: { values: UpdateUserProfileType; avatar?: File }) => {
      return Promise.all([
        UpdateUserProfile(values),
        avatar ? startAvatarUpload([avatar]) : Promise.resolve(),
      ])
    },

    async onSuccess([updatedUser, uploadResult], variables, context) {
      const newAvatarUrl = uploadResult?.[0]?.url
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(queryFilter, (oldData) => {
        if (!oldData) return
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => {
            return {
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      ...(newAvatarUrl && { avatarUrl: newAvatarUrl }),
                    },
                  }
                }
                return post
              }),
              search: page.search,
            }
          }),
        }
      })

      // to update user profile server component
      router.refresh()
      toast({
        description: "Profile updated successfully",
      })
    },
  })

  return mutation
}

export default useUpdateProfileMutation
