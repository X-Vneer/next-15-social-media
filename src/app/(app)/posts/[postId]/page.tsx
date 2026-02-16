import { Metadata } from "next"

import { validateRequest } from "@/lib/lucia"
import Post from "@/components/posts/post"

import { getPost } from "./utils"

type Props = {
  params: Promise<{
    postId: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params
  const session = await validateRequest()
  if (!session.user) return {}

  const post = await getPost(postId, session.user)
  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  }
}
export default async function Page({ params }: Props) {
  const { postId } = await params
  const session = await validateRequest()
  if (!session.user) return <p className="my-10 text-center text-destructive">Not logged in!</p>
  const post = await getPost(postId, session.user)

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post {...post} />
      </div>
    </main>
  )
}
