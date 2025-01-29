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



import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { Booking, GymPlan } from '@/types';

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
      switch (plan.duration) {
        case 'day':
          endDate.setDate(endDate.getDate() + 1);
          break;
        case '3months':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case '6months':
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        case 'year':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }

      const otp = this.generateOTP();
      
      // Determine initial status based on start date
      const status = this.calculateBookingStatus(startDate, endDate);

      const bookingData: Omit<Booking, 'id'> = {
        userId,
        gymId,
        planId: plan.id,
        startDate: startDate,
        endDate: endDate,
        status,
        otp,
        userDetails: {
          ...userDetails,
          id: userId
        }
      };

      const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
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
      
      return bookings;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  async getGymBookings(gymId: string): Promise<Booking[]> {
    try {
      const q = query(collection(db, 'bookings'), where('gymId', '==', gymId));
      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];
      
      querySnapshot.forEach((doc) => {
        const bookingData = doc.data();
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
      
      return bookings;
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

  // Helper function to calculate booking status based on dates
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

  // Generate OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }
};