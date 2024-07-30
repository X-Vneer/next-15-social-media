"use client"

import React, { useState } from "react"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import UserAvatar from "@/components/ui/user-avatar"

import { submitPost } from "./actions"

import "./style.css"

import LoadingButton from "@/components/ui/loading-button"

type Props = {}

const Editor = (props: Props) => {
  const myEditor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's in your head",
      }),
    ],
  })

  const input =
    myEditor?.getText({
      blockSeparator: "\n",
    }) || ""

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const onSubmit = async () => {
    try {
      setError("")
      setIsLoading(true)
      await submitPost(input)
      myEditor?.commands.clearContent()
    } catch (error) {
      setError("something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar />
        <EditorContent
          editor={myEditor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      {error ? <span className="text-sm font-semibold text-red-600">{error}</span> : null}
      <div className="flex justify-end">
        <LoadingButton loading={isLoading} onClick={onSubmit} disabled={!input.trim()} className="min-w-20">
          Post
        </LoadingButton>
      </div>
    </div>
  )
}

export default Editor
