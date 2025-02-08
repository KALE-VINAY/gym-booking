'use client';

import { useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useParams, useRouter } from 'next/navigation';
import { bookingService } from '@/services/bookingService';
import type { Booking } from '@/types';

const parseCustomDate = (date: Date | { toDate: () => Date } | string | null): Date | null => {
  if (!date) return null;
  if (typeof date === 'object' && 'toDate' in date) return date.toDate();
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const formatDate = (date: Date | null): string => {
  if (!date) return 'N/A';
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        if (typeof id === 'string') {
          const fetchedBooking = await bookingService.getBookingById(id);
          if (fetchedBooking) {
            // Parse the dates before setting the booking
            const processedBooking = {
              ...fetchedBooking,
              startDate: parseCustomDate(fetchedBooking.startDate),
              endDate: parseCustomDate(fetchedBooking.endDate),
            };
            setBooking(processedBooking);
          }
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchBooking();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center mb-8">
            <CheckIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
          </div>
          <h1 className='text-gray-500  text-xl'>Booking Details : </h1>

          <div className="space-y-6">
            <div className="border-t border-b border-gray-200 py-6">
              <dl className="divide-y divide-gray-200">
              <div className="py-4 grid grid-cols-3">
                  <dt className="text-sm font-medium text-gray-500">User Email</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{booking.userDetails.email}</dd>
                </div>
                <div className="py-4 grid grid-cols-3">
                  <dt className="text-sm font-medium text-gray-500">Gym</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{booking.gym.name}</dd>
                </div>

                <div className="py-4 grid grid-cols-3">
                  <dt className="text-sm font-medium text-gray-500">Plan</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{booking.plan.name}</dd>
                </div>

                <div className="py-4 grid grid-cols-3">
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="text-sm text-gray-900 col-span-2">₹{booking.plan.price}</dd>
                </div>

                <div className="py-4 grid grid-cols-3">
                  <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {formatDate(booking.startDate)}
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-3">
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {formatDate(booking.endDate)}
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-3">
                  <dt className="text-sm font-medium text-gray-500">Booking ID</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{booking.id}</dd>
                </div>
                <div className="py-4 grid grid-cols-3">
                  <dt className="text-sm font-medium text-gray-500">Booking OTP</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{booking.otp}</dd>
                </div>
              </dl>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => router.push(`/gyms/${booking.gym.id}`)} 
                className="text-white px-3 bg-gray-600 mr-2 rounded-lg hover:text-gray-900 text-sm"
              >
                Return to Gym Page
              </button>
              <button 
                onClick={() => router.push('/userbookings')} 
                className="bg-black text-white px-3 md:px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                View All Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}