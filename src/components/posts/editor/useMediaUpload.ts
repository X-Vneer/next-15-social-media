import React, { useState } from "react"

import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "@/components/ui/use-toast"

export type Attachment = {
  file: File
  mediaId?: string
  isUploading: boolean
}

const useMediaUpload = () => {
  const { toast } = useToast()

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>()
  const { startUpload, isUploading } = useUploadThing("attachments", {
    onBeforeUploadBegin: (files) => {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop()

        return new File([file], `attachment_${crypto.randomUUID()}.${extension}`, { type: file.type })
      })
      setAttachments((prev) => [...prev, ...renamedFiles.map((file) => ({ file, isUploading: true }))])
      return renamedFiles
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) => {
        return prev.map((attachment) => {
          const uploadResult = res.find((e) => e.name === attachment.file.name)
          if (uploadResult) {
            return {
              ...attachment,
              mediaId: uploadResult.serverData.mediaId,
              isUploading: false,
            }
          } else {
            return attachment
          }
        })
      })
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((attachment) => !attachment.isUploading))
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      })
    },
  })

  const handleStartUpload = (files: File[]) => {
    if (isUploading) {
      toast({
        title: "Error",
        description: "Please wait for the current upload to finish",
        variant: "destructive",
      })

      return
    }

    if (attachments.length + files.length > 5) {
      toast({
        title: "Error",
        description: "You can only upload a maximum of 5 files",
        variant: "destructive",
      })
      return
    }
    startUpload(files)
  }

  const removeAttachment = (fileName: string) => {
    setAttachments((prev) => prev.filter((file, i) => file.file.name !== fileName))
  }
  const reset = () => {
    setAttachments([])
    setUploadProgress(undefined)
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    uploadProgress,
    removeAttachment,
    reset,
    isUploading,
  }
}

export default useMediaUpload
