import { PostData } from "@/lib/prisma/types"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import LoadingButton from "../ui/loading-button"
import useDeletePostMutation from "./useDeletePostMutation"

type Props = {
  post: PostData
  open: boolean
  onClose: () => void
}

export default function DeletePostDialog({ post, open, onClose }: Props) {
  const mutation = useDeletePostMutation()

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
            loading={mutation.isPending}>
            Delete
          </LoadingButton>
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
