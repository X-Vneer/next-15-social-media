import prisma from "@/lib/prisma"
import { postDataInclude } from "@/lib/prisma/types"
import TrendSidebar from "@/components/common/trends-sidebar"
import Editor from "@/components/posts/editor/editor"
import Post from "@/components/posts/post"

export default async function Page() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  })
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Editor />

        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
      <TrendSidebar />
    </main>
  )
}
