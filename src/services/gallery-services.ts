import { collection, updateDoc, doc, getDocs, query, orderBy, Timestamp, arrayUnion, increment, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Comment } from '@/types';

const IMAGES_COLLECTION = 'images';

export const fetchImagesFromDB = async () => {
    try {
        const imagesRef = collection(db, IMAGES_COLLECTION);
        const q = query(imagesRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);

        
        const images = querySnapshot.docs.map(doc => {
            const docData = {...doc.data()}
            delete docData.timestamp
            return ({
                id: doc.id,
                ...docData,
                url: docData?.url,
                title: docData?.title,
                likedBy: docData?.likedBy || [],
                likes: docData?.likes || [],
                comments: docData?.comments || [],
                likeCount: docData?.likes?.length || 0
            })
        });
        return images;

    } catch (error) {
        console.error('Error fetching images:', error);
        throw (error as Error).message;
    }
};

export const fetchImageById = async (imageId: string) => {
  try {
    const imageRef = doc(db, IMAGES_COLLECTION, imageId);
    const imageDoc = await getDoc(imageRef);
    if (!imageDoc.exists()) {
      throw new Error('Image not found');
    }
    return {
      id: imageDoc.id,
      ...imageDoc.data(),
      likedBy: imageDoc.data()?.likedBy || [],
      likes: imageDoc.data()?.likes || 0,
      comments: imageDoc.data()?.comments || [],
    };
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

export const addLike = async (imageId: string, userId: string) => {
  try {
    const imageRef = doc(db, IMAGES_COLLECTION, imageId);
    await updateDoc(imageRef, {
      likedBy: arrayUnion(userId),
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error adding like:', error);
    throw error;
  }
};

export const removeLike = async (imageId: string, userId: string) => {
  try {
    const imageRef = doc(db, IMAGES_COLLECTION, imageId);
    await updateDoc(imageRef, {
      likedBy: arrayRemove(userId),
      likes: increment(-1)
    });
  } catch (error) {
    console.error('Error removing like:', error);
    throw error;
  }
};

export const addCommentToImage = async (imageId: string, comment: Comment) => {
  try {
    const imageRef = doc(db, IMAGES_COLLECTION, imageId);
    await updateDoc(imageRef, {
      comments: arrayUnion({
        ...comment,
        timestamp: Timestamp.now()
      })
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};