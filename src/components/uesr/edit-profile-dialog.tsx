"use client"

import React, { ElementRef, useRef, useState } from "react"
import Image from "next/image"
import { UpdateUserProfile, updateUserSchema } from "@/validation/update-user-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Camera } from "lucide-react"
import { useForm } from "react-hook-form"
import Resizer from "react-image-file-resizer"

import { UserData } from "@/lib/prisma/types"
import useUpdateProfileMutation from "@/app/(app)/users/[username]/mutations"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import LoadingButton from "../ui/loading-button"
import { Textarea } from "../ui/textarea"
import UserAvatar from "../ui/user-avatar"
import CropImageDialog from "./crop-image-dialog"

type Props = {
  user: UserData
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditProfileDialog = ({ user, open, onOpenChange }: Props) => {
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null)

  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user?.bio || "",
    },
  })

  const mutation = useUpdateProfileMutation()
  async function onSubmit(values: UpdateUserProfile) {
    const newAvatarFile = croppedAvatar ? new File([croppedAvatar], `avatar_${user.id}.webp`) : undefined

    mutation.mutate(
      { values, avatar: newAvatarFile },
      {
        onSuccess: () => {
          setCroppedAvatar(null)
          onOpenChange(false)
        },
      },
    )
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Avatar</Label>

          <AvatarInput
            src={croppedAvatar ? URL.createObjectURL(croppedAvatar) : user.avatarUrl || undefined}
            onImageCropped={setCroppedAvatar}
          />
        </div>
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

type AvatarInputProps = {
  src?: string
  onImageCropped: (blob: Blob | null) => void
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>()

  const fileInputRef = useRef<ElementRef<"input">>(null)
  function onImageSelected(image: File | undefined) {
    if (!image) return

    // A Resizer to resize images

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "webp",
      100,
      0,
      (blob) => {
        setImageToCrop(blob as File)
      },
      "blob",
    )
  }

  return (
    <>
      <input
        title="Choose a new avatar"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        className="sr-only hidden"
      />
      <button
        title="update avatar"
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block">
        {src ? (
          <Image
            src={src}
            alt="avatar preview"
            width={150}
            height={150}
            className="size-32 flex-none rounded-full object-cover"
          />
        ) : (
          <UserAvatar size={120} className="aspect-square h-[150px] w-[150px] bg-muted" />
        )}
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera size={24} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined)
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
          }}
        />
      )}
    </>
  )
}
