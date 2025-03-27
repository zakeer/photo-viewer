"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Heart, Loader2 } from "lucide-react"
import type { User } from "../types"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  imageId: string
  likes: number
  isLiked: boolean
  currentUser: User | null
  onToggleLike: (imageId: string) => void
  isLoading?: boolean
  variant?: 'default' | 'overlay'
}

const LikeButton: React.FC<LikeButtonProps> = ({
  imageId,
  likes,
  isLiked,
  onToggleLike,
  isLoading,
  variant = 'default'
}) => {
  const buttonClass = variant === 'overlay' 
    ? "text-white hover:!text-foreground" 
    : "text-foreground"

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("gap-1", buttonClass, isLiked && "text-red-500")}
      onClick={() => onToggleLike(imageId)}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
      )}
      <span>{likes}</span>
    </Button>
  )
}

export default LikeButton

