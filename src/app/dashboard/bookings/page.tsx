'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/bookingService';
import { gymService } from '@/services/gymService';
import { Booking, Gym } from '@/types';

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const ownerGyms = await gymService.getGymsByOwner(user.uid);
        setGyms(ownerGyms);

        const allBookings = await Promise.all(
          ownerGyms.map(gym => bookingService.getGymBookings(gym.id))
        );
        setBookings(allBookings.flat());
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const getGymName = (gymId: string) => {
    const gym = gyms.find(g => g.id === gymId);
    return gym ? gym.name : 'Unknown Gym';
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl text-gray-800 font-bold mb-6">Bookings</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-gray-800 text-left">Member</th>
              <th className="p-3  text-gray-800 text-left">Gym</th>
              <th className="p-3  text-gray-800 text-left">Plan</th>
              <th className="p-3  text-gray-800 text-left">Start Date</th>
              <th className="px-6 py-3   text-left text-sm font-medium text-gray-900">OTP</th>
              <th className="p-3 text-gray-800  text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id} className="border-b">
                <td className="p-3 text-gray-800">{booking.userDetails.name}</td>
                <td className="p-3 text-gray-800 ">{getGymName(booking.gymId)}</td>
                <td className="p-3 text-gray-800 ">{booking.planId}</td>
                <td className="p-3 text-gray-800 ">{new Date(booking.startDate).toLocaleDateString()}</td>
                <td className="px-6  text-gray-800 py-4">{booking.otp}</td>
                <td className="p-3">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium 
                    ${booking.status === 'active' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}
                  `}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}