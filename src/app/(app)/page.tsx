import { Tabs, TabsContent } from "@radix-ui/react-tabs"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import TrendSidebar from "@/components/common/trends-sidebar"
import FollowingFeed from "@/components/following-feed"
import ForYouFeed from "@/components/for-you-feed"
import Editor from "@/components/posts/editor/editor"

export default function Page() {
  return (
    <>
      <Editor />
      <Tabs defaultValue="for-you">
        <TabsList className="mb-2">
          <TabsTrigger value="for-you">For You</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you">
          <ForYouFeed />
        </TabsContent>
        <TabsContent value="following">
          <FollowingFeed />
        </TabsContent>
      </Tabs>
    </>
  )
}
