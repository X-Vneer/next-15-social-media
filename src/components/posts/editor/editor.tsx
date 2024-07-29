"use client"

import React from "react"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/ui/user-avatar"

import { submitPost } from "./actions"

import "./style.css"

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

  const onSubmit = async () => {
    await submitPost(input)
    myEditor?.commands.clearContent()
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
      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={!input.trim()} className="min-w-20">
          Post
        </Button>
      </div>
    </div>
  )
}

export default Editor
