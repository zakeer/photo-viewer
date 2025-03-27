import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Image, Comment } from "../../../../image-gallery/src/types"
import { addCommentToImage, addLike, fetchImageById, fetchImagesFromDB, removeLike } from "@/services/gallery-services"

interface ImagesState {
  items: Image[]
  loading: boolean
  error: string | null
}

const initialState: ImagesState = {
  items: [],
  loading: false,
  error: null,
}

// For demo purposes, we'll use a mock API to fetch images
// In a real app, you would fetch from Firebase
export const fetchImages = createAsyncThunk("images/fetchImages", async () => {
  return await fetchImagesFromDB();

})

export const toggleLike = createAsyncThunk(
  "images/toggleLike",
  async ({ imageId, userId }: { imageId: string; userId: string }) => {
    const image = await fetchImageById(imageId);
    const isLiked = image.likedBy.includes(userId);
    
    if (isLiked) {
      await removeLike(imageId, userId);
    } else {
      await addLike(imageId, userId);
    }
    
    return { imageId, userId, isLiked };
  }
);

export const addComment = createAsyncThunk(
  "images/addComment",
  async ({ imageId, comment }: { imageId: string; comment: Comment }) => {
    await addCommentToImage(imageId, comment);
    return { imageId, comment };
  }
);

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchImages.fulfilled, (state, action: PayloadAction<Image[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch images"
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { imageId, userId, isLiked } = action.payload;
        const image = state.items.find(img => img.id === imageId);
        if (image) {
          if (isLiked) {
            image.likedBy = image.likedBy.filter(id => id !== userId);
            image.likes = image.likes - 1;
          } else {
            image.likedBy.push(userId);
            image.likes = image.likes + 1;
          }
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { imageId, comment } = action.payload;
        const image = state.items.find(img => img.id === imageId);
        if (image) {
          image.comments.push(comment);
        }
      });
  },
})

export default imagesSlice.reducer

