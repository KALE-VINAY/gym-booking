// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { gymService } from '@/services/gymService';
// import { bookingService } from '@/services/bookingService';
// import { Gym, Booking } from '@/types';

// export default function BookingsPage() {
//   const { user } = useAuth();
//   const [gyms, setGyms] = useState<Gym[]>([]);
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Improved date parser
//   const parseCustomDate = (date: string | { toDate: () => Date } | null): Date | null => {
//     if (!date) return null;
//     if (typeof date === 'object' && typeof date.toDate === 'function') {
//       // For Firebase Timestamp
//       return date.toDate();
//     }
//     const parsedDate = new Date(date as string);
//     return isNaN(parsedDate.getTime()) ? null : parsedDate;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user) return;

//       try {
//         setLoading(true);
//         const ownerGyms = await gymService.getGymsByOwner(user.uid);
//         setGyms(ownerGyms);

//         const allBookings = await Promise.all(
//           ownerGyms.map(async (gym) => {
//             const gymBookings = await bookingService.getGymBookings(gym.id);
//             return gymBookings.map((booking: Booking) => ({
//               ...booking,
//               startDate: parseCustomDate(booking.startDate as string | { toDate: () => Date } | null),
//             }));
//           })
//         );
//         setBookings(allBookings.flat());
//       } catch (error) {
//         console.error('Error fetching bookings:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const getGymName = (gymId: string) => {
//     const gym = gyms.find((g) => g.id === gymId);
//     return gym ? gym.name : 'Unknown Gym';
//   };

//   const getPlanName = (gymId: string, planId: string) => {
//     const gym = gyms.find((g) => g.id === gymId);
//     const plan = gym?.plans.find((p) => p.id === planId);
//     return plan ? plan.name : 'Unknown Plan';
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-100">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 p-4 sm:p-8">
//       <div className="container mx-auto max-w-7xl">
//         <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
//           Bookings
//         </h1>
//         <div className="bg-white rounded-xl shadow-md overflow-x-auto">
//           <table className="min-w-full text-xs sm:text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 {['Member', 'Gym', 'Plan', 'Start Date','OTP', 'Status'].map((header, index) => (
//                   <th
//                     key={index}
//                     className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {bookings.map((booking) => {
//                 const startDate =
//                   booking.startDate instanceof Date
//                     ? booking.startDate.toLocaleDateString('en-US', {
//                         day: 'numeric',
//                         month: 'long',
//                         year: 'numeric',
//                       })
//                     : 'Invalid Date';

//                 return (
//                   <tr key={booking.id}>
//                     <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {booking.userDetails.name}
//                     </td>
//                     <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500">
//                       {getGymName(booking.gymId)}
//                     </td>
//                     <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500">
//                       {getPlanName(booking.gymId, booking.planId)}
//                     </td>
//                     <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500">
//                       {startDate}
//                     </td>
//                     <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500">
//                       {booking.otp}
//                     </td>
//                     <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                           booking.status === 'active'
//                             ? 'bg-green-100 text-green-800'
//                             : booking.status === 'completed'
//                             ? 'bg-blue-100 text-blue-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { gymService } from '@/services/gymService';
import { bookingService } from '@/services/bookingService';
import { Gym, Booking } from '@/types';
import { Search } from 'lucide-react';

export default function BookingsPage() {
  const { user } = useAuth();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const parseCustomDate = (date: string | { toDate: () => Date } | null): Date | null => {
    if (!date) return null;
    if (typeof date === 'object' && typeof date.toDate === 'function') {
      return date.toDate();
    }
    const parsedDate = new Date(date as string);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const ownerGyms = await gymService.getGymsByOwner(user.uid);
        setGyms(ownerGyms);

        const allBookings = await Promise.all(
          ownerGyms.map(async (gym) => {
            const gymBookings = await bookingService.getGymBookings(gym.id);
            return gymBookings.map((booking: Booking) => ({
              ...booking,
              startDate: parseCustomDate(booking.startDate as string | { toDate: () => Date } | null),
            }));
          })
        );
        setBookings(allBookings.flat());
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getGymName = (gymId: string) => {
    const gym = gyms.find((g) => g.id === gymId);
    return gym ? gym.name : 'Unknown Gym';
  };

  const getPlanName = (gymId: string, planId: string) => {
    const gym = gyms.find((g) => g.id === gymId);
    const plan = gym?.plans.find((p) => p.id === planId);
    return plan ? plan.name : 'Unknown Plan';
  };

  const filteredBookings = bookings
    .filter(booking => {
      if (activeFilter !== 'all' && booking.status !== activeFilter) {
        return false;
      }
      
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      const startDate = booking.startDate instanceof Date
        ? booking.startDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '';

      return (
        booking.userDetails.name.toLowerCase().includes(searchLower) ||
        getGymName(booking.gymId).toLowerCase().includes(searchLower) ||
        getPlanName(booking.gymId, booking.planId).toLowerCase().includes(searchLower) ||
        startDate.toLowerCase().includes(searchLower) ||
        booking.otp.toString().toLowerCase().includes(searchLower) ||
        booking.status.toLowerCase().includes(searchLower)
      );
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header and Search Section */}
        <div className="space-y-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Bookings
          </h1>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by member, gym, plan, date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All', color: 'gray' },
              { id: 'upcoming', label: 'Upcoming', color: 'red' },
              { id: 'active', label: 'Active', color: 'green' },
              { id: 'completed', label: 'Completed', color: 'blue' }
            ].map(({ id, label, color }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id as typeof activeFilter)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors 
                  ${activeFilter === id
                    ? `bg-${color}-600 text-white`
                    : `bg-${color}-100 text-${color}-800 hover:bg-${color}-200`
                  }
                  flex-shrink-0
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Member', 'Gym', 'Plan', 'Start Date', 'OTP', 'Status'].map((header, index) => (
                    <th
                      key={index}
                      className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No bookings found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const startDate =
                      booking.startDate instanceof Date
                        ? booking.startDate.toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Invalid Date';

                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.userDetails.name}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getGymName(booking.gymId)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getPlanName(booking.gymId, booking.planId)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {startDate}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.otp}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}