import TrendSidebar from "@/components/common/trends-sidebar"
import ForYouFeed from "@/components/for-you-feed"
import Editor from "@/components/posts/editor/editor"

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Editor />
        <ForYouFeed />
      </div>
      <TrendSidebar />
    </main>
  )
}
