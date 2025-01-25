'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/bookingService';
import { gymService } from '@/services/gymService';
import { Booking, Gym } from '@/types';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function UserBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<(Booking & { gymName?: string; gymLocation?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;
      try {
        // Fetch user's bookings
        const userBookings = await bookingService.getUserBookings(user.uid);
        
        // Fetch gym details for each booking
        const bookingsWithDetails = await Promise.all(
          userBookings.map(async (booking) => {
            try {
              const gym = await gymService.getGymById(booking.gymId);
              return {
                ...booking,
                gymName: gym?.name || 'Unknown Gym',
                gymLocation: gym?.location || 'Unknown Location'
              };
            } catch (error) {
              console.error(`Error fetching gym details for booking ${booking.id}:`, error);
              return booking;
            }
          })
        );

        setBookings(bookingsWithDetails);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl text-gray-800 font-bold mb-6">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          You have no active bookings.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(booking => (
            <div 
              key={booking.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {booking.gymName || 'Gym'}
                  </h2>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium 
                    ${booking.status === 'active' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}
                  `}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {booking.gymLocation && (
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-2 text-indigo-600" />
                      {booking.gymLocation}
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    Start Date: {new Date(booking.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    End Date: {new Date(booking.endDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">Plan: {booking.planId}</p>
                      <p className="text-sm text-gray-500">OTP: {booking.otp}</p>
                    </div>
                    <button 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
                      onClick={() => {/* Add any additional action */}}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}