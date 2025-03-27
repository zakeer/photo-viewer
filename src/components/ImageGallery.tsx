"use client"

import type React from "react"
import { useEffect } from "react"
import ImageCard from "./ImageCard"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { useAuth } from "@/context/AuthContext"
import { fetchImages } from "@/store/slices/imagesSlice"

const ImageGallery: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((state) => state.images)
  console.log({ items, loading, error })
  const { currentUser } = useAuth()

  useEffect(() => {
    dispatch(fetchImages())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((image) => (
          <ImageCard key={image.id} image={image} currentUser={currentUser} />
        ))}
      </div>
    </div>
  )
}

export default ImageGallery

