import React from "react"
import { UpdateUserProfile, updateUserSchema } from "@/validation/update-user-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { UserData } from "@/lib/prisma/types"
import useUpdateProfileMutation from "@/app/(app)/users/[username]/mutations"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import LoadingButton from "../ui/loading-button"
import { Textarea } from "../ui/textarea"

type Props = {
  user: UserData
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditProfileDialog = ({ user, open, onOpenChange }: Props) => {
  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user?.bio || "",
    },
  })

  const mutation = useUpdateProfileMutation()
  async function onSubmit(values: UpdateUserProfile) {
    mutation.mutate({ values }, { onSuccess: () => onOpenChange(false) })
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type="submit" loading={mutation.isPending}>
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileDialog
