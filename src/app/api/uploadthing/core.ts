import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError, UTApi } from "uploadthing/server"

import { validateRequest } from "@/lib/lucia"
import prisma from "@/lib/prisma"

const f = createUploadthing()

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const session = await validateRequest()
      if (!session.user) throw new UploadThingError("Unauthorized")

      return { user: session.user }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl
      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]

        await new UTApi().deleteFiles(key)
      }
      const newAvatarUrl = file.url.replace("/f/", `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: newAvatarUrl,
        },
      })

      return { avatarUrl: newAvatarUrl }
    }),

  attachments: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const session = await validateRequest()
      if (!session.user) throw new UploadThingError("Unauthorized")

      return { user: session.user }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const url = file.url.replace("/f/", `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)
      const media = await prisma.media.create({
        data: {
          url,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      })

      return { mediaId: media.id }
    }),
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter
