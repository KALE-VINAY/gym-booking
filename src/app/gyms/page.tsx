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

'use client';

import { useState, useEffect } from 'react';
import { Gym, Location } from '@/types';
import { gymService } from '@/services/gymService';
import Link from 'next/link';
import { ChevronLeftIcon, MagnifyingGlassIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import Navbar from '@/components/Navbar';
import LocationFilter from '@/components/LocationFilter';
import { motion } from 'framer-motion';

export default function GymsPage() {
  const [, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location>('ALL');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryGyms, setCategoryGyms] = useState<Gym[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationGyms, setLocationGyms] = useState<Gym[]>([]);

  // Fetch gyms based on location
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        const fetchedGyms = await gymService.getGyms(selectedLocation);
        setGyms(fetchedGyms);
        setLocationGyms(fetchedGyms); // Store location-specific gyms
      } catch (error) {
        console.error('Error fetching gyms:', error);
        setGyms([]);
        setLocationGyms([]); // Clear location gyms on error
      } finally {
        setLoading(false);
      }
    };
    fetchGyms();
  }, [selectedLocation]);

  // Filter gyms by category
  useEffect(() => {
    const fetchCategoryGyms = async () => {
      if (selectedCategory === 'all') {
        setCategoryGyms(locationGyms); // Use location-specific gyms instead of all gyms
        return;
      }

      try {
        const db = getFirestore();
        const docRef = doc(db, 'gymOwners', `${selectedCategory}gyms`);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const gymIds = docSnap.data().uids || [];
          const filteredGyms = locationGyms.filter(gym => gymIds.includes(gym.id)); // Filter from location gyms
          setCategoryGyms(filteredGyms);
        } else {
          setCategoryGyms([]);
        }
      } catch (error) {
        console.error('Error fetching category gyms:', error);
        setCategoryGyms([]);
      }
    };

    if (locationGyms.length > 0) {
      fetchCategoryGyms();
    } else {
      setCategoryGyms([]); // Clear category gyms if no location gyms available
    }
  }, [selectedCategory, locationGyms]); // Depend on locationGyms instead of gyms

  const filteredGyms = categoryGyms.filter(gym =>
    gym.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Rest of the component remains the same until the loading check
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="bg-gray-900 w-full h-20 text-white py-4 px-6 flex items-center">
          <Link href="/" className="flex items-center">
            <ChevronLeftIcon className="h-6 w-6 mr-2" />
          </Link>
          <h1 className="text-xl font-semibold">All Gyms</h1>
        </div>

        {/* Mobile Search and Location */}
        <div className="p-4 bg-white shadow-sm">
          <div className="space-y-3">
            {/* <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search gyms..."
                className="w-full px-4 py-2 pr-10 text-gray-900 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-black"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div> */}
            <LocationFilter
              selectedLocation={selectedLocation}
              onChange={setSelectedLocation}
            />
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate">
                Discover Your Perfect Gym
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Find and compare gyms across different locations and price ranges
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-4">
              <div className="w-64">
                <LocationFilter
                  selectedLocation={selectedLocation}
                  onChange={setSelectedLocation}
                />
              </div>
              <div className="relative w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search gyms..."
                  className="w-full px-4 py-2 pr-10 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="px-4 py-3 md:max-w-7xl md:mx-auto md:py-6">
        <div className="flex space-x-3 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All 
          </button>
          <button
            onClick={() => setSelectedCategory('premium')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'premium'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Premium
          </button>
          <button
            onClick={() => setSelectedCategory('affordable')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'affordable'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Affordable
          </button>
          <button
            onClick={() => setSelectedCategory('budgetfriendly')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'budgetfriendly'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Budget Friendly
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : locationGyms.length === 0 ? (
        // Show message when no gyms are available for the selected location
        <div className="flex flex-col items-center justify-center h-64 text-gray-600">
          <p className="text-xl font-semibold">No Gyms Available</p>
          <p className="text-sm mt-2">There are currently no gyms available in this location</p>
        </div>
      ) : filteredGyms.length === 0 ? (
        // Show message when no gyms match the selected category
        <div className="flex flex-col items-center justify-center h-64 text-gray-600">
          <p className="text-xl font-semibold">No Gyms Found</p>
          <p className="text-sm mt-2">No gyms available in this category for the selected location</p>
        </div>
      ) : (
        <>
          {/* Desktop Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="hidden md:grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredGyms.map((gym, index) => (
                <motion.div
                  key={gym.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/gyms/${gym.id}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative h-64">
                        <Image
                          src={typeof gym.images[0] === 'string' ? gym.images[0] : ''}
                          alt={gym.name}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900">{gym.name}</h3>
                        <div className="mt-3 flex items-center text-gray-600">
                          <MapPinIcon className="h-5 w-5 mr-2" />
                          <span>{gym.location}</span>
                        </div>
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {gym.facilities.slice(0, 3).map((facility, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                              >
                                {facility.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center text-gray-700">
                            <CalendarIcon className="h-5 w-5 mr-2" />
                            <span className="font-medium">₹{Math.min(...gym.plans.map(p => p.price))}</span>
                          </div>
                          <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Grid */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {filteredGyms.map((gym) => (
                <Link key={gym.id} href={`/gyms/${gym.id}`}>
                  <div className="relative h-28 md:h-48">
                    <Image
                      src={typeof gym.images[0] === 'string' ? gym.images[0] : ''}
                      alt={gym.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 rounded-lg flex items-end p-4">
                      <div>
                        <h3 className="text-white text-lg font-bold">{gym.name}</h3>
                        <div className="flex items-center text-white/90 text-sm mt-1">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{gym.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}