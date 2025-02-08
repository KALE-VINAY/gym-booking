// // src/services/gymService.ts

// import { db, storage } from '@/config/firebase';
// import { 
//   collection,
//   doc,
//   getDocs,
//   getDoc,
//   addDoc,
//   query,
//   where,
//   updateDoc,
//   deleteDoc
// } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { Gym, Location } from '@/types';

// export const gymService = {
//   async getGyms(location: Location): Promise<Gym[]> {
//     try {
//       const gymsRef = collection(db, 'gyms');
//       const q = location === 'ALL' 
//         ? gymsRef 
//         : query(gymsRef, where('location', '==', location));
      
//       const querySnapshot = await getDocs(q);
//       const gyms: Gym[] = [];
      
//       querySnapshot.forEach((doc) => {
//         gyms.push({ id: doc.id, ...doc.data() } as Gym);
//       });
      
//       return gyms;
//     } catch (error) {
//       console.error('Error fetching gyms:', error);
//       throw error;
//     }
//   },

//   async getGymById(id: string): Promise<Gym | null> {
//     try {
//       const gymDoc = await getDoc(doc(db, 'gyms', id));
//       if (!gymDoc.exists()) return null;
//       return { id: gymDoc.id, ...gymDoc.data() } as Gym;
//     } catch (error) {
//       console.error('Error fetching gym:', error);
//       throw error;
//     }
//   },

//   async getGymsByOwner(ownerId: string): Promise<Gym[]> {
//     try {
//       const gymsRef = collection(db, 'gyms');
//       const q = query(gymsRef, where('ownerId', '==', ownerId));
      
//       const querySnapshot = await getDocs(q);
//       const gyms: Gym[] = [];
      
//       querySnapshot.forEach((doc) => {
//         gyms.push({ id: doc.id, ...doc.data() } as Gym);
//       });
      
//       return gyms;
//     } catch (error) {
//       console.error('Error fetching owner gyms:', error);
//       throw error;
//     }
//   },

//   async createGym(gym: Omit<Gym, 'id'>, images: File[]): Promise<string> {
//     try {
//       // Upload images first
//       const imageUrls = await Promise.all(
//         images.map(async (image) => {
//           const storageRef = ref(storage, `gyms/${Date.now()}_${image.name}`);
//           await uploadBytes(storageRef, image);
//           return getDownloadURL(storageRef);
//         })
//       );

//       // Create gym document with image URLs
//       const gymDoc = await addDoc(collection(db, 'gyms'), {
//         ...gym,
//         images: imageUrls,
//         createdAt: new Date().toISOString(),
//       });

//       return gymDoc.id;
//     } catch (error) {
//       console.error('Error creating gym:', error);
//       throw error;
//     }
//   },

//    async updateGym(id: string, data: Partial<Gym>): Promise<void> {
//     try {
//       await updateDoc(doc(db, 'gyms', id), {
//         ...data,
//         updatedAt: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error('Error updating gym:', error);
//       throw error;
//     }
//   },

//   async deleteGym(id: string): Promise<void> {
//     try {
//       await deleteDoc(doc(db, 'gyms', id));
//     } catch (error) {
//       console.error('Error deleting gym:', error);
//       throw error;
//     }
//   }
// };

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
      
      const gymData = gymDoc.data();
      // Ensure plans are properly formatted
      const formattedPlans = (gymData.plans || []).map((plan: { id: string; name: string; duration: string; price: number }) => ({
        id: plan.id,
        name: plan.name,
        duration: plan.duration,
        price: Number(plan.price)
      }));

      return {
        id: gymDoc.id,
        ...gymData,
        plans: formattedPlans
      } as Gym;
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
        const gymData = doc.data();
        // Ensure plans are properly formatted
        const formattedPlans = (gymData.plans || []).map((plan: { id: string; name: string; duration: string; price: number }) => ({
          id: plan.id,
          name: plan.name,
          duration: plan.duration,
          price: Number(plan.price)
        }));

        gyms.push({
          id: doc.id,
          ...gymData,
          plans: formattedPlans
        } as Gym);
      });
      
      return gyms;
    } catch (error) {
      console.error('Error fetching owner gyms:', error);
      throw error;
    }
  },

  // async createGym(gymData: Omit<Gym, 'id'>, images: File[]): Promise<string> {
  //   try {
  //     // Validate required fields
  //     if (!gymData.name || !gymData.location || !images.length) {
  //       throw new Error('Missing required fields');
  //     }

  //     // Validate and format plans
  //     const formattedPlans = (gymData.plans || []).map((plan: GymPlan) => ({
  //       id: plan.id,
  //       name: plan.name.trim(),
  //       duration: plan.duration.trim(),
  //       price: Number(plan.price)
  //     }));

  //     // Upload images
  //     const imageUrls = await Promise.all(
  //       images.map(async (image) => {
  //         const storageRef = ref(storage, `gyms/${Date.now()}_${image.name}`);
  //         await uploadBytes(storageRef, image);
  //         return getDownloadURL(storageRef);
  //       })
  //     );

  //     // Prepare gym data
  //     const gym = {
  //       ...gymData,
  //       plans: formattedPlans,
  //       images: imageUrls,
  //       facilities: gymData.facilities || [],
  //       equipment: (gymData.equipment || []).filter(item => item.trim() !== ''),
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString()
  //     };

  //     // Create gym document
  //     const gymDoc = await addDoc(collection(db, 'gyms'), gym);
  //     return gymDoc.id;
  //   } catch (error) {
  //     console.error('Error creating gym:', error);
  //     throw error;
  //   }
  // },
  async createGym(gymData: Partial<Gym>, images: File[]): Promise<string> {
    try {
      // Validate required fields
      if (!gymData.name || !gymData.location) {
        throw new Error('Missing required fields');
      }

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
        ...gymData,
        images: imageUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return gymDoc.id;
    } catch (error) {
      console.error('Error creating gym:', error);
      throw error;
    }
  },
  async updateGym(id: string, data: Partial<Gym>): Promise<void> {
    try {
      // Format plans if they exist in the update data
      const updateData = { ...data };
      if (updateData.plans) {
        updateData.plans = updateData.plans.map(plan => ({
          id: plan.id,
          name: plan.name.trim(),
          duration: plan.duration as 'day' | 'month' | '3months' | '6months' | 'year',
          price: Number(plan.price),
          // isActive: plan.isActive
        }));
      }

      await updateDoc(doc(db, 'gyms', id), {
        ...updateData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating gym:', error);
      throw error;
    }
  },

  async deleteGym(id: string): Promise<void> {
    try {
      // Get gym data to delete images
      const gymDoc = await getDoc(doc(db, 'gyms', id));
      if (gymDoc.exists()) {
        const gymData = gymDoc.data();
        // Delete images from storage
        if (gymData.images && gymData.images.length > 0) {
          await Promise.all(
            gymData.images.map(async (imageUrl: string) => {
              try {
                const imageRef = ref(storage, imageUrl);
                await deleteDoc(doc(db, imageRef.fullPath));
              } catch (error) {
                console.error('Error deleting image:', error);
              }
            })
          );
        }
      }

      // Delete gym document
      await deleteDoc(doc(db, 'gyms', id));
    } catch (error) {
      console.error('Error deleting gym:', error);
      throw error;
    }
  }
};