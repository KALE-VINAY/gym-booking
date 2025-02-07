'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/bookingService';
import { gymService } from '@/services/gymService';
import { Booking } from '@/types';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function UserBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<(Booking & { gymName?: string; gymLocation?: string; planName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');

  const parseCustomDate = (date: Date | { toDate: () => Date } | string | null): Date | null => {
    if (!date) return null;
    if (typeof date === 'object' && 'toDate' in date) return date.toDate();
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userBookings = await bookingService.getUserBookings(user.uid);
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
            } catch {
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

  const filteredBookings = activeFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6bc272]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <div className="max-w-7xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row mt-16 sm:items-center sm:justify-between mb-6"
        >
          <h1 className="text-3xl text-gray-900 font-bold mb-4 sm:mb-0">My Bookings</h1>
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Completed' }
            ].map(({ id, label }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(id as typeof activeFilter)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${activeFilter === id
                    ? 'bg-[#6bc272] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                  whitespace-nowrap
                `}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-md">
            No {activeFilter !== 'all' ? activeFilter : ''} bookings found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:shadow-[#6bc272]/20"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {booking.gymName}
                    </h2>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'active'
                          ? 'bg-[#6bc272]/20 text-[#6bc272]'
                          : booking.status === 'completed'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {booking.gymLocation && (
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-5 w-5 mr-2 text-[#6bc272]" />
                        {booking.gymLocation}
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-2 text-[#6bc272]" />
                      Start Date: {formatDate(booking.startDate)}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600">Plan: {booking.planName}</p>
                        <p className="text-sm text-gray-500">OTP: {booking.otp}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-[#6bc272] text-white rounded-md hover:bg-[#6bc272]/90 text-sm font-medium transition-colors duration-200 shadow-md"
                      >
                        Details
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



























// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { bookingService } from '@/services/bookingService';
// import { gymService } from '@/services/gymService';
// import { Booking } from '@/types';
// import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

// export default function UserBookingsPage() {
//   const { user } = useAuth();
//   const [bookings, setBookings] = useState<(Booking & { gymName?: string; gymLocation?: string; planName?: string })[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Utility to parse Firebase Timestamp or other date formats
//   const parseCustomDate = (date: Date | { toDate: () => Date } | string | null): Date | null => {
//     if (!date) return null;
//     if (typeof date === 'object' && 'toDate' in date) return date.toDate(); // For Firebase Timestamp
//     const parsedDate = new Date(date);
//     return isNaN(parsedDate.getTime()) ? null : parsedDate;
//   };

//   useEffect(() => {
//     const fetchUserBookings = async () => {
//       if (!user) return;

//       try {
//         setLoading(true);
//         const userBookings = await bookingService.getUserBookings(user.uid);
//         console.log('Fetched user bookings:', userBookings);

//         const bookingsWithDetails = await Promise.all(
//           userBookings.map(async (booking) => {
//             try {
//               const gym = await gymService.getGymById(booking.gymId);
//               const plan = gym?.plans?.find((p) => p.id === booking.planId);
//               return {
//                 ...booking,
//                 startDate: parseCustomDate(booking.startDate),
//                 endDate: parseCustomDate(booking.endDate),
//                 gymName: gym?.name || 'Unknown Gym',
//                 gymLocation: gym?.location || 'Unknown Location',
//                 planName: plan?.name || 'Unknown Plan',
//               };
//             } catch (error) {
//               console.error(`Error fetching gym details for booking ${booking.id}:`, error);
//               return {
//                 ...booking,
//                 gymName: 'Error Loading Gym',
//                 gymLocation: '',
//                 planName: '',
//               };
//             }
//           })
//         );

//         setBookings(bookingsWithDetails);
//       } catch (error) {
//         console.error('Error fetching user bookings:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserBookings();
//   }, [user]);

//   const formatDate = (date: Date | null): string => {
//     if (!date) return 'N/A';
//     return date.toLocaleDateString('en-US', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl text-white font-bold mb-6">My Bookings</h1>

//       {bookings.length === 0 ? (
//         <div className="text-center py-10 text-gray-500">
//           You have no active bookings.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {bookings.map((booking) => (
//             <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     {booking.gymName}
//                   </h2>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       booking.status === 'active'
//                         ? 'bg-green-100 text-green-800'
//                         : booking.status === 'completed'
//                         ? 'bg-blue-100 text-blue-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}
//                   >
//                     {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                   </span>
//                 </div>

//                 <div className="space-y-2 mb-4">
//                   {booking.gymLocation && (
//                     <div className="flex items-center text-gray-600">
//                       <MapPinIcon className="h-5 w-5 mr-2 text-indigo-600" />
//                       {booking.gymLocation}
//                     </div>
//                   )}
//                   <div className="flex items-center text-gray-600">
//                     <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
//                     Start Date: {formatDate(booking.startDate)}
//                   </div>
//                   {/* <div className="flex items-center text-gray-600">
//                     <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
//                     End Date: {formatDate(booking.endDate)}
//                   </div> */}
//                 </div>

//                 <div className="border-t pt-4">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-gray-600">Plan: {booking.planName}</p>
//                       <p className="text-sm text-gray-500">OTP: {booking.otp}</p>
//                     </div>
//                     <button
//                       className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
//                       onClick={() => {
//                         // Add any additional action, if necessary
//                       }}
//                     >
//                       Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { bookingService } from '@/services/bookingService';
// import { gymService } from '@/services/gymService';
// import { Booking } from '@/types';
// import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

// type BookingStatus = 'active' | 'completed' | 'cancelled';

// type ExtendedBooking = Booking & {
//   gymName?: string;
//   gymLocation?: string;
//   planName?: string;
// };

// export default function UserBookingsPage() {
//   const { user } = useAuth();
//   const [bookings, setBookings] = useState<ExtendedBooking[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Updated date parsing function to handle Firestore Timestamps
//   const parseCustomDate = (date: any): Date | null => {
//     if (!date) return null;
    
//     // Handle Firestore Timestamp
//     if (typeof date === 'object' && date.seconds) {
//       return new Date(date.seconds * 1000);
//     }
    
//     // Handle regular Date objects
//     if (date instanceof Date) {
//       return date;
//     }
    
//     // Handle string dates
//     if (typeof date === 'string') {
//       const parsedDate = new Date(date);
//       return isNaN(parsedDate.getTime()) ? null : parsedDate;
//     }

//     return null;
//   };

//   const determineBookingStatus = (startDate: Date | null): BookingStatus => {
//     if (!startDate) return 'completed';
    
//     const now = new Date();
//     const start = new Date(startDate);
    
//     start.setHours(0, 0, 0, 0);
//     const today = new Date(now);
//     today.setHours(0, 0, 0, 0);

//     if (today.getTime() === start.getTime()) {
//       return 'active';
//     } else if (start > now) {
//       return 'active';
//     } else {
//       return 'completed';
//     }
//   };

//   const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
//     try {
//       await bookingService.updateBookingStatus(bookingId, newStatus);
//     } catch (error) {
//       console.error(`Error updating booking status for ${bookingId}:`, error);
//     }
//   };

//   useEffect(() => {
//     const fetchUserBookings = async () => {
//       if (!user) return;

//       try {
//         setLoading(true);
//         const userBookings = await bookingService.getUserBookings(user.uid);
//         console.log('Fetched user bookings:', userBookings);

//         const bookingsWithDetails = await Promise.all(
//           userBookings.map(async (booking) => {
//             try {
//               const gym = await gymService.getGymById(booking.gymId);
//               const plan = gym?.plans?.find((p) => p.id === booking.planId);
              
//               const parsedStartDate = parseCustomDate(booking.startDate);
//               const parsedEndDate = parseCustomDate(booking.endDate);
              
//               console.log('Parsed dates:', {
//                 original: booking.startDate,
//                 parsed: parsedStartDate
//               });

//               const currentStatus = determineBookingStatus(parsedStartDate);
              
//               if (booking.status !== currentStatus) {
//                 await updateBookingStatus(booking.id, currentStatus);
//               }

//               return {
//                 ...booking,
//                 status: currentStatus,
//                 startDate: parsedStartDate,
//                 endDate: parsedEndDate,
//                 gymName: gym?.name || 'Unknown Gym',
//                 gymLocation: gym?.location || 'Unknown Location',
//                 planName: plan?.name || 'Unknown Plan',
//               };
//             } catch (error) {
//               console.error(`Error fetching gym details for booking ${booking.id}:`, error);
//               return {
//                 ...booking,
//                 startDate: parseCustomDate(booking.startDate),
//                 endDate: parseCustomDate(booking.endDate),
//                 gymName: 'Error Loading Gym',
//                 gymLocation: '',
//                 planName: '',
//               };
//             }
//           })
//         );

//         setBookings(bookingsWithDetails);
//       } catch (error) {
//         console.error('Error fetching user bookings:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserBookings();
//   }, [user]);

//   const formatDate = (date: Date | null): string => {
//     if (!date) return 'N/A';
//     try {
//       return date.toLocaleDateString('en-US', {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric',
//       });
//     } catch (error) {
//       console.error('Error formatting date:', date, error);
//       return 'N/A';
//     }
//   };

//   const getStatusStyles = (status: BookingStatus): string => {
//     switch (status) {
//       case 'active':
//         return 'bg-green-100 text-green-800';
//       case 'completed':
//         return 'bg-blue-100 text-blue-800';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusDisplay = (status: BookingStatus, startDate: Date | null): string => {
//     if (status === 'active' && startDate) {
//       const now = new Date();
//       const start = new Date(startDate);
//       return start > now ? 'Upcoming' : 'Active';
//     }
//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl text-white font-bold mb-6">My Bookings</h1>

//       {bookings.length === 0 ? (
//         <div className="text-center py-10 text-gray-500">
//           You have no active bookings.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {bookings.map((booking) => (
//             <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     {booking.gymName}
//                   </h2>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(booking.status)}`}
//                   >
//                     {getStatusDisplay(booking.status, booking.startDate)}
//                   </span>
//                 </div>

//                 <div className="space-y-2 mb-4">
//                   {booking.gymLocation && (
//                     <div className="flex items-center text-gray-600">
//                       <MapPinIcon className="h-5 w-5 mr-2 text-indigo-600" />
//                       {booking.gymLocation}
//                     </div>
//                   )}
//                   <div className="flex items-center text-gray-600">
//                     <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600" />
//                     <span>Start Date: {formatDate(booking.startDate)}</span>
//                   </div>
//                 </div>

//                 <div className="border-t pt-4">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-gray-600">Plan: {booking.planName}</p>
//                       <p className="text-sm text-gray-500">OTP: {booking.otp}</p>
//                     </div>
//                     <button
//                       className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
//                       onClick={() => {
//                         // Add any additional action, if necessary
//                       }}
//                     >
//                       Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }