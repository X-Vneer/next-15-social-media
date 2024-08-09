import { validateRequest } from "@/lib/lucia"
import Post from "@/components/posts/post"

import { getPost } from "./utils"

type Props = {
  params: {
    postId: string
  }
}

export async function generateMetadata({ params: { postId } }: Props) {
  const session = await validateRequest()
  if (!session.user) return {}

  const post = await getPost(postId, session.user)
  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  }
}
export default async function Page({ params: { postId } }: Props) {
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

// interface UserInfoSidebarProps {
//   user: UserData
// }

// async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
//   const { user: loggedInUser } = await validateRequest()

//   if (!loggedInUser) return null

//   return (
//     <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
//       <div className="text-xl font-bold">About this user</div>
//       <UserTooltip user={user}>
//         <Link href={`/users/${user.username}`} className="flex items-center gap-3">
//           <UserAvatar user={user} className="flex-none" />
//           <div>
//             <p className="line-clamp-1 break-all font-semibold hover:underline">{user.displayName}</p>
//             <p className="line-clamp-1 break-all text-muted-foreground">@{user.username}</p>
//           </div>
//         </Link>
//       </UserTooltip>
//       <Linkify>
//         <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">{user.bio}</div>
//       </Linkify>
//       {user.id !== loggedInUser.id && (
//         <FollowButton
//           userId={user.id}
//           initialState={{
//             followers: user._count.followers,
//             isFollowedByMe: user.followers.some(({ followerId }) => followerId === loggedInUser.id),
//             isFollowingMe: user.following.some(({ followingId }) => followingId === loggedInUser.id),
//           }}
//         />
//       )}
//     </div>
//   )
// }
