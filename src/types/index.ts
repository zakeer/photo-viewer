// Define types for our application

export interface User {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
}

export interface Image {
  id: string
  url: string
  title: string
  likes: number
  likedBy: string[]
  comments: Comment[]
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userPhotoURL?: string
  text: string
  createdAt: number // timestamp
}

