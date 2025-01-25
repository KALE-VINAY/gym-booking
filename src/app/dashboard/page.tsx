// // src/app/dashboard/page.tsx

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { gymService } from '@/services/gymService';
// import { bookingService } from '@/services/bookingService';
// import { Gym, Booking } from '@/types';
// import { 
//   BuildingOfficeIcon, 
//   UserGroupIcon, 
//   CurrencyDollarIcon,
//   ChartBarIcon 
// } from '@heroicons/react/24/outline';
// import { 
//   LineChart, 
//   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer 
// } from 'recharts';

// export default function DashboardOverview() {
//   const { user } = useAuth();
//   const [gyms, setGyms] = useState<Gym[]>([]);
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalGyms: 0,
//     activeMembers: 0,
//     totalRevenue: 0,
//     recentBookings: 0
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user) return;

//       try {
//         setLoading(true);
//         // Fetch owner's gyms
//         const ownerGyms = await gymService.getGymsByOwner(user.uid);
//         setGyms(ownerGyms);

//         // Fetch bookings for all gyms
//         const allBookings = await Promise.all(
//           ownerGyms.map(gym => bookingService.getGymBookings(gym.id))
//         );
//         const flattenedBookings = allBookings.flat();
//         setBookings(flattenedBookings);

//         // Calculate stats
//         const activeBookings = flattenedBookings.filter(b => b.status === 'active');
//         const revenue = flattenedBookings.reduce((total, booking) => {
//           const gym = ownerGyms.find(g => g.id === booking.gymId);
//           const plan = gym?.plans.find(p => p.id === booking.planId);
//           return total + (plan?.price || 0);
//         }, 0);

//         setStats({
//           totalGyms: ownerGyms.length,
//           activeMembers: activeBookings.length,
//           totalRevenue: revenue,
//           recentBookings: flattenedBookings.filter(
//             b => new Date(b.startDate).getMonth() === new Date().getMonth()
//           ).length
//         });
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   // Prepare chart data
//   const getChartData = () => {
//     const last6Months = Array.from({ length: 6 }, (_, i) => {
//       const date = new Date();
//       date.setMonth(date.getMonth() - i);
//       return {
//         month: date.toLocaleString('default', { month: 'short' }),
//         timestamp: date.getTime()
//       };
//     }).reverse();

//     return last6Months.map(({ month, timestamp }) => ({
//       month,
//       bookings: bookings.filter(b => {
//         const bookingDate = new Date(b.startDate).getTime();
//         const nextMonth = new Date(timestamp);
//         nextMonth.setMonth(nextMonth.getMonth() + 1);
//         return bookingDate >= timestamp && bookingDate < nextMonth.getTime();
//       }).length
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Dashboard Overview</h1>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex items-center">
//             <BuildingOfficeIcon className="h-12 w-12 text-indigo-600" />
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Gyms</p>
//               <p className="text-2xl font-semibold text-gray-900">{stats.totalGyms}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex items-center">
//             <UserGroupIcon className="h-12 w-12 text-green-600" />
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Active Members</p>
//               <p className="text-2xl font-semibold text-gray-900">{stats.activeMembers}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex items-center">
//             <CurrencyDollarIcon className="h-12 w-12 text-yellow-600" />
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//               <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <div className="flex items-center">
//             <ChartBarIcon className="h-12 w-12 text-blue-600" />
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Recent Bookings</p>
//               <p className="text-2xl font-semibold text-gray-900">{stats.recentBookings}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bookings Chart */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-lg font-semibold mb-4">Booking Trends</h2>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={getChartData()}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="bookings"
//                 stroke="#4F46E5"
//                 strokeWidth={2}
//                 dot={{ fill: '#4F46E5' }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Recent Bookings Table */}
//       <div className="bg-white rounded-lg shadow">
//         <div className="p-6">
//           <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr className="border-b">
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Member</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Gym</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Plan</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Start Date</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {bookings.slice(0, 5).map((booking) => {
//                   const gym = gyms.find(g => g.id === booking.gymId);
//                   const plan = gym?.plans.find(p => p.id === booking.planId);
                  
//                   return (
//                     <tr key={booking.id} className="border-b">
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {booking.userDetails.name}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {gym?.name}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {plan?.name}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {new Date(booking.startDate).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           booking.status === 'active'
//                             ? 'bg-green-100 text-green-800'
//                             : booking.status === 'completed'
//                             ? 'bg-gray-100 text-gray-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/app/dashboard/page.tsx
// src/app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { gymService } from '@/services/gymService';
import { bookingService } from '@/services/bookingService';
import { Gym, Booking } from '@/types';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGyms: 0,
    activeMembers: 0,
    totalRevenue: 0,
    recentBookings: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const ownerGyms = await gymService.getGymsByOwner(user.uid);
        setGyms(ownerGyms);

        const allBookings = await Promise.all(
          ownerGyms.map(gym => bookingService.getGymBookings(gym.id))
        );
        const flattenedBookings = allBookings.flat();
        setBookings(flattenedBookings);

        const activeBookings = flattenedBookings.filter(b => b.status === 'active');
        const revenue = flattenedBookings.reduce((total, booking) => {
          const gym = ownerGyms.find(g => g.id === booking.gymId);
          const plan = gym?.plans.find(p => p.id === booking.planId);
          return total + (plan?.price || 0);
        }, 0);

        setStats({
          totalGyms: ownerGyms.length,
          activeMembers: activeBookings.length,
          totalRevenue: revenue,
          recentBookings: flattenedBookings.filter(
            b => new Date(b.startDate).getMonth() === new Date().getMonth()
          ).length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getChartData = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        timestamp: date.getTime()
      };
    }).reverse();

    return last6Months.map(({ month, timestamp }) => ({
      month,
      bookings: bookings.filter(b => {
        const bookingDate = new Date(b.startDate).getTime();
        const nextMonth = new Date(timestamp);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return bookingDate >= timestamp && bookingDate < nextMonth.getTime();
      }).length
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 sm:mb-8">
          Dashboard Overview
        </h1>

        {/* Responsive Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            { 
              icon: BuildingOfficeIcon, 
              color: 'text-indigo-600', 
              title: 'Total Gyms', 
              value: stats.totalGyms 
            },
            { 
              icon: UserGroupIcon, 
              color: 'text-green-600', 
              title: 'Active Members', 
              value: stats.activeMembers 
            },
            { 
              icon: CurrencyDollarIcon, 
              color: 'text-yellow-600', 
              title: 'Total Revenue', 
              value: `₹${stats.totalRevenue.toLocaleString()}` 
            },
            { 
              icon: ChartBarIcon, 
              color: 'text-blue-600', 
              title: 'Recent Bookings', 
              value: stats.recentBookings 
            }
          ].map(({ icon: Icon, color, title, value }, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 sm:p-6"
            >
              <div className="flex items-center">
                <Icon className={`h-8 sm:h-12 w-8 sm:w-12 ${color} mr-3 sm:mr-4`} />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Chart - Responsive Height */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Booking Trends
          </h2>
          <div className="h-48 sm:h-64 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs sm:text-sm"
                  tick={{fontSize: 10}} 
                />
                <YAxis 
                  className="text-xs sm:text-sm" 
                  tick={{fontSize: 10}} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(55, 65, 81, 0.9)', 
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ 
                    stroke: '#4F46E5', 
                    strokeWidth: 2, 
                    r: 4,
                    fill: 'white'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings Table - Responsive */}
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Recent Bookings
            </h2>
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Member', 'Gym', 'Plan', 'Start Date', 'Status'].map((header, index) => (
                    <th 
                      key={index} 
                      className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => {
                  const gym = gyms.find(g => g.id === booking.gymId);
                  const plan = gym?.plans.find(p => p.id === booking.planId);
                  
                  return (
                    <tr key={booking.id}>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-[10px] sm:text-sm font-medium text-gray-900">
                        {booking.userDetails.name}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-500">
                        {gym?.name}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-500">
                        {plan?.name}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-500">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[8px] sm:text-xs font-medium ${
                          booking.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}