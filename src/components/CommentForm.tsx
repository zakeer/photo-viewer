"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import type { User } from "@/types"

interface CommentFormProps {
  imageId: string
  currentUser: User | null
  onAddComment: (imageId: string, text: string) => void
  isLoading?: boolean
}

const CommentForm: React.FC<CommentFormProps> = ({
  imageId,
  currentUser,
  onAddComment,
  isLoading = false,
}) => {
  const [comment, setComment] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    onAddComment(imageId, comment.trim())
    setComment("")
  }

  if (!currentUser) {
    return (
      <div className="text-sm text-muted-foreground text-center py-2">
        Sign in to leave a comment
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser.photoURL || undefined} />
          <AvatarFallback>
            {currentUser.displayName?.[0] || "A"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !comment && setIsFocused(false)}
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
        </div>
      </div>

      {(isFocused || comment) && (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setComment("")
              setIsFocused(false)
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!comment.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Comment"
            )}
          </Button>
        </div>
      )}
    </form>
  )
}

export default CommentForm

