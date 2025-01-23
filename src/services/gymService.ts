// src/services/gymService.ts

import { db, storage } from '@/config/firebase';
import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Gym, Location } from '@/types';

export const gymService = {
  async getGyms(location: Location): Promise<Gym[]> {
    try {
      const gymsRef = collection(db, 'gyms');
      const q = location === 'ALL' 
        ? gymsRef 
        : query(gymsRef, where('location', '==', location));
      
      const querySnapshot = await getDocs(q);
      const gyms: Gym[] = [];
      
      querySnapshot.forEach((doc) => {
        gyms.push({ id: doc.id, ...doc.data() } as Gym);
      });
      
      return gyms;
    } catch (error) {
      console.error('Error fetching gyms:', error);
      throw error;
    }
  },

  async getGymById(id: string): Promise<Gym | null> {
    try {
      const gymDoc = await getDoc(doc(db, 'gyms', id));
      if (!gymDoc.exists()) return null;
      return { id: gymDoc.id, ...gymDoc.data() } as Gym;
    } catch (error) {
      console.error('Error fetching gym:', error);
      throw error;
    }
  },

  async getGymsByOwner(ownerId: string): Promise<Gym[]> {
    try {
      const gymsRef = collection(db, 'gyms');
      const q = query(gymsRef, where('ownerId', '==', ownerId));
      
      const querySnapshot = await getDocs(q);
      const gyms: Gym[] = [];
      
      querySnapshot.forEach((doc) => {
        gyms.push({ id: doc.id, ...doc.data() } as Gym);
      });
      
      return gyms;
    } catch (error) {
      console.error('Error fetching owner gyms:', error);
      throw error;
    }
  },

  async createGym(gym: Omit<Gym, 'id'>, images: File[]): Promise<string> {
    try {
      // Upload images first
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `gyms/${Date.now()}_${image.name}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        })
      );

      // Create gym document with image URLs
      const gymDoc = await addDoc(collection(db, 'gyms'), {
        ...gym,
        images: imageUrls,
        createdAt: new Date().toISOString(),
      });

      return gymDoc.id;
    } catch (error) {
      console.error('Error creating gym:', error);
      throw error;
    }
  },

   async updateGym(id: string, data: Partial<Gym>): Promise<void> {
    try {
      await updateDoc(doc(db, 'gyms', id), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating gym:', error);
      throw error;
    }
  },

  async deleteGym(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'gyms', id));
    } catch (error) {
      console.error('Error deleting gym:', error);
      throw error;
    }
  }
};