"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore"
import { db } from "../firebase/config"
import type { Image, Comment } from "../types"

// Hook for fetching images from Firestore
export const useImages = () => {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)

    const q = query(collection(db, "images"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const imageList: Image[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          imageList.push({
            id: doc.id,
            url: data.url,
            title: data.title,
            likes: data.likes || 0,
            likedBy: data.likedBy || [],
            comments: data.comments || [],
          })
        })

        setImages(imageList)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching images:", err)
        setError(err.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  return { images, loading, error }
}

// Functions for interacting with Firestore
export const toggleLikeInFirestore = async (imageId: string, userId: string) => {
  const imageRef = doc(db, "images", imageId)

  // Check if the user has already liked the image
  const imageDoc = await doc(db, "images", imageId).get()
  const imageData = imageDoc.data()

  if (imageData && imageData.likedBy && imageData.likedBy.includes(userId)) {
    // User has already liked the image, so unlike it
    await updateDoc(imageRef, {
      likes: imageData.likes - 1,
      likedBy: arrayRemove(userId),
    })
  } else {
    // User hasn't liked the image yet, so like it
    await updateDoc(imageRef, {
      likes: (imageData?.likes || 0) + 1,
      likedBy: arrayUnion(userId),
    })
  }
}

export const addCommentToFirestore = async (
  imageId: string,
  userId: string,
  userName: string,
  userPhotoURL: string | undefined,
  text: string,
) => {
  const imageRef = doc(db, "images", imageId)

  const newComment: Comment = {
    id: Date.now().toString(),
    userId,
    userName,
    userPhotoURL,
    text,
    createdAt: Date.now(),
  }

  await updateDoc(imageRef, {
    comments: arrayUnion(newComment),
  })

  return newComment
}

