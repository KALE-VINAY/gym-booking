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
import { Gym } from '@/types';
import { gymService } from '@/services/gymService';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function GymsPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryGyms, setCategoryGyms] = useState<Gym[]>([]);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        const fetchedGyms = await gymService.getGyms('ALL');
        setGyms(fetchedGyms);
      } catch (error) {
        console.error('Error fetching gyms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGyms();
  }, []);

  useEffect(() => {
    const fetchCategoryGyms = async () => {
      if (selectedCategory === 'all') {
        setCategoryGyms(gyms);
        return;
      }

      try {
        const db = getFirestore();
        const docRef = doc(db, 'gymOwners', `${selectedCategory}gyms`);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const gymIds = docSnap.data().uids || [];
          const filteredGyms = gyms.filter(gym => gymIds.includes(gym.id));
          setCategoryGyms(filteredGyms);
        } else {
          setCategoryGyms([]);
        }
      } catch (error) {
        console.error('Error fetching category gyms:', error);
        setCategoryGyms([]);
      }
    };

    if (gyms.length > 0) {
      fetchCategoryGyms();
    }
  }, [selectedCategory, gyms]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-900 w-full text-white py-4 px-6 flex items-center  mx-auto">
        <Link href="/" className="flex items-center">
          <ChevronLeftIcon className="h-6 w-6 mr-2" />
        </Link>
        <h1 className="text-xl font-semibold">All Gyms</h1>
      </div>

           {/* Category Buttons */}
           <div className="px-4 py-3 overflow-x-auto hide-scrollbar">
        <div className="flex space-x-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white'
            }`}
          >
            All 
          </button>
          <button
            onClick={() => setSelectedCategory('premium')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'premium'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white'
            }`}
          >
            Premium
          </button>
          <button
            onClick={() => setSelectedCategory('affordable')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'affordable'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white'
            }`}
          >
            Affordable
          </button>
          <button
            onClick={() => setSelectedCategory('budgetfriendly')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'budgetfriendly'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white'
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
      ) : (
        <div className="px-6 py-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryGyms.map((gym) => (
            <Link key={gym.id} href={`/gyms/${gym.id}`} className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
              <div className="relative h-28 md:h-48">
                <Image
                  src={typeof gym.images[0] === 'string' ? gym.images[0] : ''}
                  alt={gym.name}
                  layout="fill"
                  objectFit="cover"
                  className="brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 flex items-end p-4">
                  <h3 className="text-white text-xl font-bold">{gym.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {categoryGyms.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-600">
          <p className="text-xl font-semibold">No Gyms Found</p>
          <p className="text-sm mt-2">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}
