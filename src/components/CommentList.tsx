import type React from "react"
import type { Comment } from "../types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface CommentListProps {
  comments: Comment[]
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">No comments yet</p>
  }

  return (
    <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={comment.userPhotoURL} alt={comment.userName} />
            <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-sm">{comment.userName}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentList

