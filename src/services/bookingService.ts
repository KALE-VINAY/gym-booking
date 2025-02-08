// // src/services/bookingService.ts

// import { db } from '@/config/firebase';
// import { 
//   collection,
//   doc,
//   addDoc,
//   getDocs,
//   query,
//   where,
//   updateDoc,
//   // Timestamp
// } from 'firebase/firestore';
// import { Booking, GymPlan } from '@/types';

// export const bookingService = {
//   async createBooking(
//     userId: string,
//     gymId: string,
//     plan: GymPlan,
//     startDate: Date,
//     userDetails: { name: string; email: string }
//   ): Promise<string> {
//     try {
//       // Calculate end date based on plan duration
//       const endDate = new Date(startDate);
//       switch (plan.duration) {
//         case 'day':
//           endDate.setDate(endDate.getDate() + 1);
//           break;
//         case '3months':
//           endDate.setMonth(endDate.getMonth() + 3);
//           break;
//         case '6months':
//           endDate.setMonth(endDate.getMonth() + 6);
//           break;
//         case 'year':
//           endDate.setFullYear(endDate.getFullYear() + 1);
//           break;
//       }

//       const otp = this.generateOTP(); // Generate OTP

//       const bookingData: Omit<Booking, 'id'> = {
//         userId,
//         gymId,
//         planId: plan.id,
//         startDate: startDate,
//         endDate: endDate,
//         status: 'active',
//         otp, // Include OTP
//         userDetails: { ...userDetails, id: userId } // Include user ID
//       };

//       const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
//       return bookingRef.id;
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       throw error;
//     }
//   },

//   async getUserBookings(userId: string): Promise<Booking[]> {
//     try {
//       const q = query(collection(db, 'bookings'), where('userId', '==', userId));
//       const querySnapshot = await getDocs(q);
      
//       const bookings: Booking[] = [];
//       querySnapshot.forEach((doc) => {
//         bookings.push({ id: doc.id, ...doc.data() } as Booking);
//       });
      
//       return bookings;
//     } catch (error) {
//       console.error('Error fetching user bookings:', error);
//       throw error;
//     }
//   },

//   async getGymBookings(gymId: string): Promise<Booking[]> {
//     try {
//       const q = query(collection(db, 'bookings'), where('gymId', '==', gymId));
//       const querySnapshot = await getDocs(q);
      
//       const bookings: Booking[] = [];
//       querySnapshot.forEach((doc) => {
//         bookings.push({ id: doc.id, ...doc.data() } as Booking);
//       });
      
//       return bookings;
//     } catch (error) {
//       console.error('Error fetching gym bookings:', error);
//       throw error;
//     }
//   },

//   async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
//     try {
//       await updateDoc(doc(db, 'bookings', bookingId), { status });
//     } catch (error) {
//       console.error('Error updating booking status:', error);
//       throw error;
//     }
//   },
//     // New functionality: Generate OTP
//     generateOTP(): string {
//       return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
//     }
 


// };



// import { db } from '@/config/firebase';
// import { 
//   collection, 
//   doc, 
//   addDoc, 
//   getDocs, 
//   query, 
//   where, 
//   updateDoc,
//   Timestamp
// } from 'firebase/firestore';
// import { Booking, GymPlan } from '@/types';

// export const bookingService = {
//   async createBooking(
//     userId: string,
//     gymId: string,
//     plan: GymPlan,
//     startDate: Date,
//     userDetails: { name: string; email: string }
//   ): Promise<string> {
//     try {
//       // Calculate end date based on plan duration
//       const endDate = new Date(startDate);
//       switch (plan.duration) {
//         case 'day':
//           endDate.setDate(endDate.getDate() + 1);
//           break;
//         case '3months':
//           endDate.setMonth(endDate.getMonth() + 3);
//           break;
//         case '6months':
//           endDate.setMonth(endDate.getMonth() + 6);
//           break;
//         case 'year':
//           endDate.setFullYear(endDate.getFullYear() + 1);
//           break;
//       }

//       const otp = this.generateOTP();
      
//       // Determine initial status based on start date
//       const status = this.calculateBookingStatus(startDate, endDate);

//       const bookingData: Omit<Booking, 'id'> = {
//         userId,
//         gymId,
//         planId: plan.id,
//         startDate: startDate,
//         endDate: endDate,
//         status,
//         otp,
//         userDetails: {
//           ...userDetails,
//           id: userId
//         }
//       };

//       const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
//       return bookingRef.id;
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       throw error;
//     }
//   },

//   async getUserBookings(userId: string): Promise<Booking[]> {
//     try {
//       const q = query(collection(db, 'bookings'), where('userId', '==', userId));
//       const querySnapshot = await getDocs(q);
//       const bookings: Booking[] = [];
      
//       querySnapshot.forEach((doc) => {
//         const bookingData = doc.data();
//         const startDate = bookingData.startDate instanceof Timestamp 
//           ? bookingData.startDate.toDate() 
//           : new Date(bookingData.startDate);
        
//         const endDate = bookingData.endDate instanceof Timestamp 
//           ? bookingData.endDate.toDate() 
//           : new Date(bookingData.endDate);

//         const updatedStatus = this.calculateBookingStatus(startDate, endDate);
        
//         // If status has changed, update it in Firebase
//         if (updatedStatus !== bookingData.status) {
//           this.updateBookingStatus(doc.id, updatedStatus);
//         }
        
//         bookings.push({
//           id: doc.id,
//           ...bookingData,
//           startDate,
//           endDate,
//           status: updatedStatus
//         } as Booking);
//       });
      
//       return bookings;
//     } catch (error) {
//       console.error('Error fetching user bookings:', error);
//       throw error;
//     }
//   },

//   async getGymBookings(gymId: string): Promise<Booking[]> {
//     try {
//       const q = query(collection(db, 'bookings'), where('gymId', '==', gymId));
//       const querySnapshot = await getDocs(q);
//       const bookings: Booking[] = [];
      
//       querySnapshot.forEach((doc) => {
//         const bookingData = doc.data();
//         const startDate = bookingData.startDate instanceof Timestamp 
//           ? bookingData.startDate.toDate() 
//           : new Date(bookingData.startDate);
        
//         const endDate = bookingData.endDate instanceof Timestamp 
//           ? bookingData.endDate.toDate() 
//           : new Date(bookingData.endDate);

//         const updatedStatus = this.calculateBookingStatus(startDate, endDate);
        
//         // If status has changed, update it in Firebase
//         if (updatedStatus !== bookingData.status) {
//           this.updateBookingStatus(doc.id, updatedStatus);
//         }
        
//         bookings.push({
//           id: doc.id,
//           ...bookingData,
//           startDate,
//           endDate,
//           status: updatedStatus
//         } as Booking);
//       });
      
//       return bookings;
//     } catch (error) {
//       console.error('Error fetching gym bookings:', error);
//       throw error;
//     }
//   },

//   async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
//     try {
//       await updateDoc(doc(db, 'bookings', bookingId), { status });
//     } catch (error) {
//       console.error('Error updating booking status:', error);
//       throw error;
//     }
//   },

//   // Helper function to calculate booking status based on dates
//   calculateBookingStatus(startDate: Date, endDate: Date): Booking['status'] {
//     const currentDate = new Date();
    
//     // Reset time portions to compare just the dates
//     const startDateTime = new Date(startDate);
//     startDateTime.setHours(0, 0, 0, 0);
    
//     const endDateTime = new Date(endDate);
//     endDateTime.setHours(23, 59, 59, 999);
    
//     const currentDateTime = new Date(currentDate);
//     currentDateTime.setHours(0, 0, 0, 0);
    
//     if (currentDateTime < startDateTime) {
//       return 'upcoming';
//     } else if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
//       return 'active';
//     } else {
//       return 'completed';
//     }
//   },

//   // Generate OTP
//   generateOTP(): string {
//     return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
//   }
// };





// import { db } from '@/config/firebase';
// import { 
//   collection, 
//   doc, 
//   addDoc, 
//   getDocs, 
//   query, 
//   where, 
//   updateDoc,
//   Timestamp
// } from 'firebase/firestore';
// import { Booking, GymPlan } from '@/types';

// export const bookingService = {
//   async createBooking(
//     userId: string,
//     gymId: string,
//     plan: GymPlan,
//     startDate: Date,
//     userDetails: { name: string; email: string }
//   ): Promise<string> {
//     try {
//       // Calculate end date based on plan duration
//       const endDate = new Date(startDate);
      
//       // First set the start date to beginning of the day
//       startDate.setHours(0, 0, 0, 0);
      
//       switch (plan.duration) {
//         case 'day':
//           // For daily plan, end date is same day at 23:59:59
//           endDate.setHours(23, 59, 59, 999);
//           break;
//         case 'month':
//           // Add 1 month, set to last millisecond of the day
//           endDate.setMonth(endDate.getMonth() + 1);
//           endDate.setDate(endDate.getDate() - 1);
//           endDate.setHours(23, 59, 59, 999);
//           break;
//         case '3months':
//           endDate.setMonth(endDate.getMonth() + 3);
//           endDate.setDate(endDate.getDate() - 1);
//           endDate.setHours(23, 59, 59, 999);
//           break;
//         case '6months':
//           endDate.setMonth(endDate.getMonth() + 6);
//           endDate.setDate(endDate.getDate() - 1);
//           endDate.setHours(23, 59, 59, 999);
//           break;
//         case 'year':
//           endDate.setFullYear(endDate.getFullYear() + 1);
//           endDate.setDate(endDate.getDate() - 1);
//           endDate.setHours(23, 59, 59, 999);
//           break;
//         default:
//           // Default to end of selected day
//           endDate.setHours(23, 59, 59, 999);
//       }

//       const otp = this.generateOTP();
//       const status = this.calculateBookingStatus(startDate, endDate);

//       const bookingData: Omit<Booking, 'id'> = {
//         userId,
//         gymId,
//         planId: plan.id,
//         startDate: startDate,
//         endDate: endDate,
//         status,
//         otp,
//         userDetails: {
//           ...userDetails,
//           id: userId
//         }
//       };

//       // Convert dates to Firestore Timestamps before saving
//       const firestoreBookingData = {
//         ...bookingData,
//         startDate: Timestamp.fromDate(startDate),
//         endDate: Timestamp.fromDate(endDate)
//       };

//       const bookingRef = await addDoc(collection(db, 'bookings'), firestoreBookingData);
//       return bookingRef.id;
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       throw error;
//     }
//   },

//   async getUserBookings(userId: string): Promise<Booking[]> {
//     try {
//       const q = query(collection(db, 'bookings'), where('userId', '==', userId));
//       const querySnapshot = await getDocs(q);
//       const bookings: Booking[] = [];
      
//       querySnapshot.forEach((doc) => {
//         const bookingData = doc.data();
        
//         // Ensure proper date conversion from Firestore
//         const startDate = bookingData.startDate instanceof Timestamp 
//           ? bookingData.startDate.toDate() 
//           : new Date(bookingData.startDate);
        
//         const endDate = bookingData.endDate instanceof Timestamp 
//           ? bookingData.endDate.toDate() 
//           : new Date(bookingData.endDate);

//         const updatedStatus = this.calculateBookingStatus(startDate, endDate);
        
//         // If status has changed, update it in Firebase
//         if (updatedStatus !== bookingData.status) {
//           this.updateBookingStatus(doc.id, updatedStatus);
//         }
        
//         bookings.push({
//           id: doc.id,
//           ...bookingData,
//           startDate,
//           endDate,
//           status: updatedStatus
//         } as Booking);
//       });
      
//       return bookings.sort((a, b) => (b.startDate ? b.startDate.getTime() : 0) - (a.startDate ? a.startDate.getTime() : 0));
//     } catch (error) {
//       console.error('Error fetching user bookings:', error);
//       throw error;
//     }
//   },

//   async getGymBookings(gymId: string): Promise<Booking[]> {
//     try {
//       const q = query(collection(db, 'bookings'), where('gymId', '==', gymId));
//       const querySnapshot = await getDocs(q);
//       const bookings: Booking[] = [];
      
//       querySnapshot.forEach((doc) => {
//         const bookingData = doc.data();
        
//         // Ensure proper date conversion from Firestore
//         const startDate = bookingData.startDate instanceof Timestamp 
//           ? bookingData.startDate.toDate() 
//           : new Date(bookingData.startDate);
        
//         const endDate = bookingData.endDate instanceof Timestamp 
//           ? bookingData.endDate.toDate() 
//           : new Date(bookingData.endDate);

//         const updatedStatus = this.calculateBookingStatus(startDate, endDate);
        
//         // If status has changed, update it in Firebase
//         if (updatedStatus !== bookingData.status) {
//           this.updateBookingStatus(doc.id, updatedStatus);
//         }
        
//         bookings.push({
//           id: doc.id,
//           ...bookingData,
//           startDate,
//           endDate,
//           status: updatedStatus
//         } as Booking);
//       });
      
//       return bookings.sort((a, b) => (b.startDate ? b.startDate.getTime() : 0) - (a.startDate ? a.startDate.getTime() : 0));
//     } catch (error) {
//       console.error('Error fetching gym bookings:', error);
//       throw error;
//     }
//   },

//   async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
//     try {
//       await updateDoc(doc(db, 'bookings', bookingId), { status });
//     } catch (error) {
//       console.error('Error updating booking status:', error);
//       throw error;
//     }
//   },

//   calculateBookingStatus(startDate: Date, endDate: Date): Booking['status'] {
//     const currentDate = new Date();
    
//     // Reset time portions to compare just the dates
//     const startDateTime = new Date(startDate);
//     startDateTime.setHours(0, 0, 0, 0);
    
//     const endDateTime = new Date(endDate);
//     endDateTime.setHours(23, 59, 59, 999);
    
//     const currentDateTime = new Date(currentDate);
//     currentDateTime.setHours(0, 0, 0, 0);
    
//     if (currentDateTime < startDateTime) {
//       return 'upcoming';
//     } else if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
//       return 'active';
//     } else {
//       return 'completed';
//     }
//   },

//   generateOTP(): string {
//     return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
//   }
// };


import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs,
  getDoc,
  query, 
  where, 
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { Booking, GymPlan, Gym } from '@/types';
import { gymService } from '@/services/gymService'; // Import gymService

// First, let's define proper interfaces for our data
interface UserDetails {
  id: string;
  name: string;
  email: string;
}

interface BookingData extends Omit<Booking, 'id'> {
  userId: string;
  gymId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: Booking['status'];
  otp: string;
  userDetails: UserDetails;
  gym: Gym; // Add gym property
  plan: GymPlan; // Add plan property
}

export const bookingService = {
  async createBooking(
    userId: string,
    gymId: string,
    plan: GymPlan,
    startDate: Date,
    userDetails: { name: string; email: string }
  ): Promise<string> {
    try {
      // Calculate end date based on plan duration
      const endDate = new Date(startDate);
      
      // First set the start date to beginning of the day
      startDate.setHours(0, 0, 0, 0);
      
      switch (plan.duration) {
        case 'day':
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'month':
          endDate.setMonth(endDate.getMonth() + 1);
          endDate.setDate(endDate.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
          break;
        case '3months':
          endDate.setMonth(endDate.getMonth() + 3);
          endDate.setDate(endDate.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
          break;
        case '6months':
          endDate.setMonth(endDate.getMonth() + 6);
          endDate.setDate(endDate.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'year':
          endDate.setFullYear(endDate.getFullYear() + 1);
          endDate.setDate(endDate.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
          break;
        default:
          endDate.setHours(23, 59, 59, 999);
      }

      const otp = this.generateOTP();
      const status = this.calculateBookingStatus(startDate, endDate);

            // Fetch gym details
            const gym = await gymService.getGymById(gymId);
            if (!gym) {
              throw new Error(`Gym with ID ${gymId} not found`);
            }

      const bookingData: BookingData = {
        userId,
        gymId,
        planId: plan.id,
        startDate: startDate,
        endDate: endDate,
        status,
        otp,
        userDetails: {
          id: userId,
          ...userDetails
        },
        gym, // Set gym property
        plan // Set plan property
      };

      // Convert dates to Firestore Timestamps before saving
      const firestoreBookingData = {
        ...bookingData,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate)
      };

      const bookingRef = await addDoc(collection(db, 'bookings'), firestoreBookingData);
      return bookingRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const q = query(collection(db, 'bookings'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];
      
      querySnapshot.forEach((doc) => {
        const bookingData = doc.data();
        
        // Ensure proper date conversion from Firestore
        const startDate = bookingData.startDate instanceof Timestamp 
          ? bookingData.startDate.toDate() 
          : new Date(bookingData.startDate);
        
        const endDate = bookingData.endDate instanceof Timestamp 
          ? bookingData.endDate.toDate() 
          : new Date(bookingData.endDate);

        const updatedStatus = this.calculateBookingStatus(startDate, endDate);
        
        // If status has changed, update it in Firebase
        if (updatedStatus !== bookingData.status) {
          this.updateBookingStatus(doc.id, updatedStatus);
        }
        
        bookings.push({
          id: doc.id,
          ...bookingData,
          startDate,
          endDate,
          status: updatedStatus
        } as Booking);
      });
      
      return bookings.sort((a, b) => (b.startDate ? b.startDate.getTime() : 0) - (a.startDate ? a.startDate.getTime() : 0));
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  getBookingById: async (bookingId: string) => {
    try {
      const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
      if (!bookingDoc.exists()) return null;
      
      const bookingData = bookingDoc.data();
      return {
        id: bookingDoc.id,
        ...bookingData
      } as Booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }
,
  async getGymBookings(gymId: string): Promise<Booking[]> {
    try {
      const q = query(collection(db, 'bookings'), where('gymId', '==', gymId));
      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];
      
      querySnapshot.forEach((doc) => {
        const bookingData = doc.data();
        
        // Ensure proper date conversion from Firestore
        const startDate = bookingData.startDate instanceof Timestamp 
          ? bookingData.startDate.toDate() 
          : new Date(bookingData.startDate);
        
        const endDate = bookingData.endDate instanceof Timestamp 
          ? bookingData.endDate.toDate() 
          : new Date(bookingData.endDate);

        const updatedStatus = this.calculateBookingStatus(startDate, endDate);
        
        // If status has changed, update it in Firebase
        if (updatedStatus !== bookingData.status) {
          this.updateBookingStatus(doc.id, updatedStatus);
        }
        
        bookings.push({
          id: doc.id,
          ...bookingData,
          startDate,
          endDate,
          status: updatedStatus
        } as Booking);
      });
      
      return bookings.sort((a, b) => (b.startDate ? b.startDate.getTime() : 0) - (a.startDate ? a.startDate.getTime() : 0));
    } catch (error) {
      console.error('Error fetching gym bookings:', error);
      throw error;
    }
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  calculateBookingStatus(startDate: Date, endDate: Date): Booking['status'] {
    const currentDate = new Date();
    
    // Reset time portions to compare just the dates
    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);
    
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    
    const currentDateTime = new Date(currentDate);
    currentDateTime.setHours(0, 0, 0, 0);
    
    if (currentDateTime < startDateTime) {
      return 'upcoming';
    } else if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
      return 'active';
    } else {
      return 'completed';
    }
  },

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
};