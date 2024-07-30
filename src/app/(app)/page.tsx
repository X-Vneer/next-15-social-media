import prisma from "@/lib/prisma"
import { postDataInclude } from "@/lib/prisma/types"
import Editor from "@/components/posts/editor/editor"
import Post from "@/components/posts/post"

export default async function Page() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  })
  return (
    <main className="w-full min-w-0">
      <div className="w-full min-w-0 space-y-5">
        <Editor />

        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </main>
  )
}
