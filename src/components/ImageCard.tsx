import type React from "react"
import type { Image, User } from "../types"
import { Card } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import LikeButton from "./LikeButton"
import CommentList from "./CommentList"
import CommentForm from "./CommentForm"
import { useAppDispatch } from "@/hooks/use-redux"
import { addComment, toggleLike } from "@/store/slices/imagesSlice"

interface ImageCardProps {
  image: Image
  currentUser: User | null
}

const ImageCard: React.FC<ImageCardProps> = ({ image, currentUser }) => {
  const dispatch = useAppDispatch()
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [isCommentLoading, setIsCommentLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isLiked = currentUser ? image.likedBy.includes(currentUser.uid) : false

  const handleToggleLike = async (imageId: string) => {
    if (!currentUser) {
      toast.error("Please sign in to like images")
      return
    }

    try {
      setIsLikeLoading(true)
      await dispatch(
        toggleLike({
          imageId,
          userId: currentUser.uid,
        }),
      ).unwrap()
    } catch (error) {
      toast.error("Failed to update like")
    } finally {
      setIsLikeLoading(false)
    }
  }

  const handleAddComment = async (imageId: string, text: string) => {
    if (!currentUser) {
      toast.error("Please sign in to comment")
      return
    }

    try {
      setIsCommentLoading(true)
      await dispatch(
        addComment({
          imageId,
          comment: {
            userId: currentUser.uid,
            userName: currentUser.displayName || "Anonymous",
            userPhotoURL: currentUser.photoURL || undefined,
            text,
            createdAt: Date.now(),
            id: currentUser.uid + Date.now(),
          },
        }),
      ).unwrap()
      toast.success("Comment added successfully")
    } catch (error) {
      toast.error("Failed to add comment")
    } finally {
      setIsCommentLoading(false)
    }
  }


  return (
    <>
      <Card className="overflow-hidden relative p-0">
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={image.url || "/placeholder.svg"}
          alt={image.title}
          className={cn(
            "w-full aspect-square object-cover",
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />

        {/* Always visible overlay content */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="font-medium text-white line-clamp-1 mb-2 pt-8">
            {image.title}
          </h3>

          <div className="flex items-center gap-4">
            <LikeButton
              imageId={image.id}
              likes={image.likes}
              isLiked={isLiked}
              currentUser={currentUser}
              onToggleLike={handleToggleLike}
              isLoading={isLikeLoading}
              variant="overlay"
            />

            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-white hover:!text-dark"
              onClick={() => setIsModalOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{image.comments.length}</span>
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] h-[600px] p-0 gap-0 overflow-hidden">
          <div className="flex h-full">
            <div className="w-1/2 relative bg-black flex items-center">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-1/2 flex flex-col h-full">
              <div className="p-4 border-b">
                <h3 className="font-medium">{image.title}</h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                <CommentList comments={image.comments} />
              </ScrollArea>
              <div className="p-4 border-t">
                <CommentForm
                  imageId={image.id}
                  currentUser={currentUser}
                  onAddComment={handleAddComment}
                  isLoading={isCommentLoading}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ImageCard

