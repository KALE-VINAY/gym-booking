'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/bookingService';
import { gymService } from '@/services/gymService';
import { Booking } from '@/types';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function UserBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<(Booking & { gymName?: string; gymLocation?: string; planName?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  // Utility to parse Firebase Timestamp or other date formats
  const parseCustomDate = (date: Date | { toDate: () => Date } | string | null): Date | null => {
    if (!date) return null;
    if (typeof date === 'object' && 'toDate' in date) return date.toDate(); // For Firebase Timestamp
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userBookings = await bookingService.getUserBookings(user.uid);
        console.log('Fetched user bookings:', userBookings);

        const bookingsWithDetails = await Promise.all(
          userBookings.map(async (booking) => {
            try {
              const gym = await gymService.getGymById(booking.gymId);
              const plan = gym?.plans?.find((p) => p.id === booking.planId);
              return {
                ...booking,
                startDate: parseCustomDate(booking.startDate),
                endDate: parseCustomDate(booking.endDate),
                gymName: gym?.name || 'Unknown Gym',
                gymLocation: gym?.location || 'Unknown Location',
                planName: plan?.name || 'Unknown Plan',
              };
            } catch (error) {
              console.error(`Error fetching gym details for booking ${booking.id}:`, error);
              return {
                ...booking,
                gymName: 'Error Loading Gym',
                gymLocation: '',
                planName: '',
              };
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

  const formatDate = (date: Date | null): string => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl text-gray-800 font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          You have no active bookings.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {booking.gymName}
                  </h2>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
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
                    Start Date: {formatDate(booking.startDate)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    End Date: {formatDate(booking.endDate)}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">Plan: {booking.planName}</p>
                      <p className="text-sm text-gray-500">OTP: {booking.otp}</p>
                    </div>
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
                      onClick={() => {
                        // Add any additional action, if necessary
                      }}
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
