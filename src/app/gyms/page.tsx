// // src/app/gyms/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { Gym, Location } from '@/types';
// import { gymService } from '@/services/gymService';
// import LocationFilter from '@/components/LocationFilter';
// import Link from 'next/link';
// import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

// export default function GymsPage() {
//   const [gyms, setGyms] = useState<Gym[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedLocation, setSelectedLocation] = useState<Location>('ALL');

//   useEffect(() => {
//     const fetchGyms = async () => {
//       try {
//         setLoading(true);
//         const fetchedGyms = await gymService.getGyms(selectedLocation);
//         setGyms(fetchedGyms);
//       } catch (error) {
//         console.error('Error fetching gyms:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGyms();
//   }, [selectedLocation]);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Gyms</h1>
//             <div className="w-64">
//               <LocationFilter
//                 selectedLocation={selectedLocation}
//                 onChange={setSelectedLocation}
//               />
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {gyms.map((gym) => (
//                 <Link 
//                   key={gym.id}
//                   href={`/gyms/${gym.id}`}
//                   className="block hover:shadow-lg transition-shadow duration-200"
//                 >
//                   <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="h-48 w-full relative">
//                       <img
//                         src={gym.images[0]}
//                         alt={gym.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="p-4">
//                       <h3 className="text-lg font-semibold text-gray-900">{gym.name}</h3>
//                       <div className="mt-2 flex items-center text-sm text-gray-500">
//                         <MapPinIcon className="h-4 w-4 mr-1" />
//                         {gym.location}
//                       </div>
//                       <div className="mt-2">
//                         <div className="flex flex-wrap gap-2">
//                           {gym.facilities.slice(0, 3).map((facility, index) => (
//                             <span
//                               key={index}
//                               className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
//                             >
//                               {facility.name}
//                             </span>
//                           ))}
//                           {gym.facilities.length > 3 && (
//                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
//                               +{gym.facilities.length - 3} more
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="mt-4 flex justify-between items-center">
//                         <div className="flex items-center text-sm text-gray-500">
//                           <CalendarIcon className="h-4 w-4 mr-1" />
//                           Plans from ₹{Math.min(...gym.plans.map(p => p.price))}
//                         </div>
//                         <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium">
//                           View Details
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/app/gyms/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Gym, Location } from '@/types';
import { gymService } from '@/services/gymService';
import LocationFilter from '@/components/LocationFilter';
import Link from 'next/link';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function GymsPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location>('ALL');

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        const fetchedGyms = await gymService.getGyms(selectedLocation);
        setGyms(fetchedGyms);
      } catch (error) {
        console.error('Error fetching gyms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 text-center md:text-left">
            Find Your Perfect Gym
          </h1>
          <div className="w-full md:w-64">
            <LocationFilter
              selectedLocation={selectedLocation}
              onChange={setSelectedLocation}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gyms.map((gym) => (
              <Link 
                key={gym.id}
                href={`/gyms/${gym.id}`}
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="h-40 sm:h-56 w-full overflow-hidden">
                    <Image
                      src={gym.images[0]}
                      alt={gym.name}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 truncate">
                      {gym.name}
                    </h3>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                      <MapPinIcon className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-indigo-600" />
                      <span className="truncate">{gym.location}</span>
                    </div>
                    <div className="mb-3 sm:mb-4">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {gym.facilities.slice(0, 3).map((facility, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {facility.name}
                      </span>
                    ))}
                    {gym.facilities.length > 3 && (
                      <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-800">
                        +{gym.facilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <CalendarIcon className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-green-600" />
                    Plans from ₹{Math.min(...gym.plans.map(p => p.price))}
                  </div>
                  <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-[10px] sm:text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}

    {gyms.length === 0 && !loading && (
      <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3 sm:mb-4">
          No Gyms Found
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 px-4">
          Try adjusting your location filter or check back later.
        </p>
      </div>
    )}
  </div>
</div>

);

}