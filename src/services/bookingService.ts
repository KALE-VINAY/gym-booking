// src/services/bookingService.ts

import { db } from '@/config/firebase';
import { 
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  // Timestamp
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

      const bookingData: Omit<Booking, 'id'> = {
        userId,
        gymId,
        planId: plan.id,
        startDate: startDate,
        endDate: endDate,
        status: 'active',
        userDetails
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
        bookings.push({ id: doc.id, ...doc.data() } as Booking);
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
        bookings.push({ id: doc.id, ...doc.data() } as Booking);
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
  }
};