import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

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
      const newAvatarUrl = file.url.replace("/f/", `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: newAvatarUrl,
        },
      })

      return { avatarUrl: newAvatarUrl }
    }),
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter
