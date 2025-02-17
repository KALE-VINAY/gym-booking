// 'use client';

// import { useState, useEffect } from 'react';
// import { Gym, Location } from '@/types';
// import { gymService } from '@/services/gymService';
// import { useAuth } from '@/context/AuthContext';
// import LocationFilter from '@/components/LocationFilter';
// import Link from 'next/link';
// import { MapPinIcon, CalendarIcon, TicketIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import Image from 'next/image';
// import { motion } from 'framer-motion';
// import Navbar from './Navbar';

// export default function GymLandingPage() {
//   const [gyms, setGyms] = useState<Gym[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedLocation, setSelectedLocation] = useState<Location>('ALL');
//   const { user } = useAuth();
//   const [searchTerm, setSearchTerm] = useState('');

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

//   const filteredGyms = gyms.filter(gym =>
//     gym.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
//   const scrollToGyms = (e: React.MouseEvent) => {
//     e.preventDefault();
//     const element = document.getElementById('browse-gyms');
//     if (element) {
//       const offset = element.offsetTop - 64; // 64px is navbar height
//       window.scrollTo({ top: offset, behavior: 'smooth' });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar />

//         {/* Hero Section */}
//         <div className="relative overflow-hidden bg-white h-screen">
//         <div className="absolute inset-0">
//           {/* <Image
//             src="https://images.creativemarket.com/0.1.0/ps/5850983/1820/1213/m1/fpnw/wm1/iblcsxcrrsyk5q1od294ouwgrtupdxmi11fsjeoermvh8tn6vzfupmaz25w68mzr-.jpg?1549634378&s=ef5caa2ee9c3bd2ec510dadf76727247"
//             alt="Gym background"
//             layout="fill"
//             objectFit="cover"
//             className="opacity-40"
//             priority
//           /> */}
//         </div>
//         <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center"
//           >
//             <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-6">
//               Helping people live their
//               <span className="block text-6xl sm:text-8xl text-green-400 mt-2">
//                 BEST LIVES
//               </span>
//             </h1>
//             <p className="mt-6 text-xl  text-gray-600 max-w-3xl mx-auto">
//               Health on your mind? We have you covered. Join thousands of fitness enthusiasts
//               finding their perfect workout space across Northeast India.
//             </p>
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="mt-10"
//             >
//              <button
//                 onClick={scrollToGyms}
//                 className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-gray-800 hover:bg-green-600 transition-all duration-200"
//               >
//                 I Want To Get Healthy!
//                 <ChevronRightIcon className="ml-2 h-5 w-5" />
//               </button>
//             </motion.div>
//           </motion.div>
//         </div>

//         {/* Animated scroll indicator */}
//         <motion.div
//           animate={{
//             y: [0, 10, 0],
//           }}
//           transition={{
//             duration: 1.5,
//             repeat: Infinity,
//             repeatType: "reverse"
//           }}
//           className="absolute bottom-10  left-1/2 transform -translate-x-1/2"
//         >
//           <div className="w-6 h-10 border-2 border-black rounded-full flex justify-center">
//             <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Main Content */}
//       <div id="browse-gyms" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <div className="mb-12 flex flex-col sm:flex-row justify-between items-start gap-4">
//           <div className="w-full sm:w-auto">
//             <motion.h2 
//               className="text-3xl font-bold text-gray-900 mb-4"
//               initial={{ opacity: 0, x: -20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//             >
//               Discover Nearby Gyms
//             </motion.h2>
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-gray-600 mb-2">Select Location</h3>
//                 <div className="w-full sm:w-64 ">
//                   <LocationFilter
//                     selectedLocation={selectedLocation}
//                     onChange={setSelectedLocation}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-gray-600 mb-2">Search Gyms</h3>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search by gym name..."
//                     className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400"
//                   />
//                   <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 </div>
//               </div>
//             </div>
//           </div>
//           {user && (
//             <motion.div 
//               whileHover={{ scale: 1.05 }}
//               className="w-full sm:w-auto"
//             >
//               <Link 
//                 href="/userbookings" 
//                 className="flex items-center justify-center mx-auto px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 text-sm font-medium transition-colors duration-200 w-3/4 sm:w-auto shadow-md"
//               >
//                 <TicketIcon className="h-5 w-5 mr-2" />
//                 My Bookings
//               </Link>
//             </motion.div>
//           )}
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
//           </div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//           >
//             {filteredGyms.map((gym, index) => (
//               <motion.div
//                 key={gym.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <Link 
//                   href={`/gyms/${gym.id}`}
//                   className="block group hover:bg-gray-50"
//                 >
//                   <div className="bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border hover:shadow-black/40">
//                     <div className="h-48 w-full relative">
//                       <Image
//                         src={typeof gym.images[0] === 'string' ? gym.images[0] : ''}
//                         alt={gym.name}
//                         layout="fill"
//                         objectFit="cover"
//                         className="transform transition-transform duration-300 group-hover:scale-110"
//                       />
//                     </div>
//                     <div className="p-4">
//                       <h3 className="text-lg font-semibold text-gray-900 truncate">{gym.name}</h3>
//                       <div className="mt-2 flex items-center text-sm text-gray-600">
//                         <MapPinIcon className="h-4 w-4 mr-1" />
//                         {gym.location}
//                       </div>
//                       <div className="mt-2">
//                         <div className="flex flex-wrap gap-2">
//                           {gym.facilities.slice(0, 3).map((facility, index) => (
//                             <span
//                               key={index}
//                               className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-black"
//                             >
//                               {facility.name}
//                             </span>
//                           ))}
//                           {gym.facilities.length > 3 && (
//                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
//                               +{gym.facilities.length - 3} more
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="mt-4 flex justify-between items-center">
//                         <div className="flex items-center text-sm text-gray-600">
//                           <CalendarIcon className="h-4 w-4 mr-1" />
//                           Plans from ₹{Math.min(...gym.plans.map(p => p.price))}
//                         </div>
//                         <motion.button
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm font-medium transition-colors duration-200 shadow-md"
//                         >
//                           View Details
//                         </motion.button>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { Gym, Location } from '@/types';
import { gymService } from '@/services/gymService';
import { useAuth } from '@/context/AuthContext';
import LocationFilter from '@/components/LocationFilter';
import Link from 'next/link';
import { MapPinIcon, CalendarIcon, TicketIcon, ChevronRightIcon, MagnifyingGlassIcon, FireIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function GymLandingPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location>('ALL');
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredGyms = gyms.filter(gym =>
    gym.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const scrollToGyms = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('browse-gyms');
    if (element) {
      const offset = element.offsetTop - 64; // 64px is navbar height
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  // Split gyms into categories for carousel display
  const premiumGyms = filteredGyms.filter(gym => 
    gym.plans.some(plan => plan.price >= 1500)
  );
  // const affordableGyms = filteredGyms.filter(gym => 
  //   gym.plans.some(plan => plan.price < 1500)
  // );

    // Helper function to get user display name
    const getUserDisplayName = () => {
      if (!user) return "there";
      return user.displayName || user.email?.split('@')[0] || "there";
    };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* User Greeting Section - Mobile Only */}
      <div className="md:hidden bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 mt-16 text-xl">Hello, {getUserDisplayName()} </p>
            {/* {user?.name || "there"} */}
            <h2 className="text-2xl font-bold text-gray-900">Let&#39;s start your day</h2>
          </div>
          {user && user.photoURL ? (
              <Image 
                src={user.photoURL}
                alt="Profile"
                width={40}
                height={40}
                className="object-cover mt-4 rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-500" />
              </div>
            )}
        </div>
      </div>

      {/* Featured Promotion Carousel - Mobile */}
      <div className="md:hidden mt-2 px-4">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          modules={[Navigation]}
          navigation={{ 
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          className="rounded-xl overflow-hidden"
        >
          <SwiperSlide>
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image
                src="https://plus.unsplash.com/premium_photo-1661920538067-c48451160c72?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="RFIT Coach"
                layout="fill"
                objectFit="cover"
                className="brightness-75"
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white">Get Fit With RFIT Coach</h3>
                <p className="text-sm text-white mt-1">Premium Online & Offline Result Based Training for you</p>
                <button className="mt-3 bg-white text-black text-xs py-1 px-3 rounded-full w-fit">
                  Join The Waitlist !
                </button>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image
                src="https://plus.unsplash.com/premium_photo-1661920538067-c48451160c72?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Medium Workout"
                layout="fill"
                objectFit="cover"
                className="brightness-75"
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white">Medium Workout</h3>
                <p className="text-sm text-white mt-1">Medium Full Body Workout</p>
                <div className="flex mt-2 space-x-3">
                  <div className="flex items-center bg-black/60 text-white rounded-full text-xs py-1 px-2">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <span>45 min</span>
                  </div>
                  <div className="flex items-center bg-black/60 text-white rounded-full text-xs py-1 px-2">
                    <FireIcon className="h-3 w-3 mr-1 text-orange-400" />
                    <span>350 Cal</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <div className="swiper-button-prev !text-white !w-8 !h-8 !bg-black/30 rounded-full !left-2"></div>
          <div className="swiper-button-next !text-white !w-8 !h-8 !bg-black/30 rounded-full !right-2"></div>
        </Swiper>
      </div>

      {/* Workout Categories - Mobile */}
      {/* <div className="md:hidden mt-5 px-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Workout Categories</h3>
          <Link href="#categories" className="text-blue-500 text-sm">See All</Link>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
          <button className="min-w-fit px-4 py-1.5 rounded-full text-sm bg-gray-800 text-white">
            Beginner
          </button>
          <button className="min-w-fit px-4 py-1.5 rounded-full text-sm bg-gray-200">
            Intermediate
          </button>
          <button className="min-w-fit px-4 py-1.5 rounded-full text-sm bg-gray-200">
            Advanced
          </button>
          <button className="min-w-fit px-4 py-1.5 rounded-full text-sm bg-gray-200">
            Full Body
          </button>
          <button className="min-w-fit px-4 py-1.5 rounded-full text-sm bg-gray-200">
            Cardio
          </button>
        </div>
      </div> */}

      {/* Hero Section - Desktop Only */}
      <div className="hidden md:block relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-900/30">
          <Image
            src="https://plus.unsplash.com/premium_photo-1661920538067-c48451160c72?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Gym background"
            layout="fill"
            objectFit="cover"
            className="opacity-60"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left max-w-xl"
          >
            {/* {user?.name ? user.name.split(' ')[0] : 'there'} */}
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Hello, {getUserDisplayName()}!
              <span className="block text-5xl sm:text-7xl mt-2">
                Let&#39;s start your <span className="text-white">day</span>
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-200 font-bold max-w-3xl">
              Health on your mind? We have you covered. Join thousands of fitness enthusiasts
              finding their perfect workout space across Northeast India.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-10"
            >
             <button
                onClick={scrollToGyms}
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-all duration-200 shadow-lg"
              >
                I Want To Get Healthy!
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </div>

      {/* Premium Gym Carousel - Mobile */}
      <div className="md:hidden mt-5 px-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg text-black font-semibold">Premium Gyms</h3>
          <Link href="#premium" className="text-blue-500 text-sm">See All</Link>
        </div>
        <Swiper
          spaceBetween={15}
          slidesPerView={1.2}
          className="gym-carousel"
        >
          {premiumGyms.slice(0, 5).map((gym) => (
            <SwiperSlide key={`premium-${gym.id}`}>
              <Link href={`/gyms/${gym.id}`}>
                <div className="relative h-44 rounded-xl overflow-hidden">
                  <Image
                    src={typeof gym.images[0] === 'string' ? gym.images[0] : ''}
                    alt={gym.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <h4 className="text-white font-semibold">{gym.name}</h4>
                    <div className="flex items-center text-white/90 text-sm mt-1">
                      <MapPinIcon className="h-3 w-3 mr-1" />
                      <span className="truncate">{gym.location}</span>
                    </div>
                    <div className="mt-2 flex items-center">
                      <span className="text-white text-xs bg-black/50 px-2 py-0.5 rounded-full">
                        Day Pass Starting from ₹{Math.min(...gym.plans.map(p => p.price))}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Main Content Section */}
      <div id="browse-gyms" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="w-full sm:w-auto">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              Discover Nearby Gyms
            </motion.h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-600 mb-2">Select Location</h3>
                <div className="w-full sm:w-64">
                  <LocationFilter
                    selectedLocation={selectedLocation}
                    onChange={setSelectedLocation}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-gray-600 mb-2">Search Gyms</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by gym name..."
                    className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400"
                  />
                  <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          {user && (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-full sm:w-auto"
            >
              <Link 
                href="/userbookings" 
                className="flex items-center justify-center mx-auto px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 text-sm font-medium transition-colors duration-200 w-3/4 sm:w-auto shadow-md"
              >
                <TicketIcon className="h-5 w-5 mr-2" />
                My Bookings
              </Link>
            </motion.div>
          )}
        </div>

        {/* RFIT Coach Promotion - Desktop */}
        <div className="hidden md:block mb-12">
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src="https://plus.unsplash.com/premium_photo-1661920538067-c48451160c72?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="RFIT Coach"
              width={1200}
              height={300}
              className="w-full h-72 object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8">
              <h3 className="text-4xl font-bold text-white">Get Fit With RFIT Coach</h3>
              <p className="text-xl text-white/90 mt-2 max-w-md">Premium Online & Offline Result Based Training for you</p>
              <button className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 w-fit">
                Join The Waitlist !
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="hidden md:grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredGyms.map((gym, index) => (
                <motion.div
                  key={gym.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={`/gyms/${gym.id}`}
                    className="block group hover:bg-gray-50"
                  >
                    <div className="bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border hover:shadow-black/40">
                      <div className="h-48 w-full relative">
                        <Image
                          src={typeof gym.images[0] === 'string' ? gym.images[0] : ''}
                          alt={gym.name}
                          layout="fill"
                          objectFit="cover"
                          className="transform transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{gym.name}</h3>
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {gym.location}
                        </div>
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-2">
                            {gym.facilities.slice(0, 3).map((facility, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-black"
                              >
                                {facility.name}
                              </span>
                            ))}
                            {gym.facilities.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                +{gym.facilities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Plans from ₹{Math.min(...gym.plans.map(p => p.price))}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm font-medium transition-colors duration-200 shadow-md"
                          >
                            View Details
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile View - Grid Display */}
            <div className="md:hidden mt-6 grid grid-cols-1 gap-4">
              {filteredGyms.map((gym) => (
                <Link key={gym.id} href={`/gyms/${gym.id}`} className="block">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex">
                      <div className="w-1/3 h-24 relative">
                        <Image
                          src={typeof gym.images[0] === 'string' ? gym.images[0] : ''}
                          alt={gym.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className="w-2/3 p-3 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm truncate">{gym.name}</h3>
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            <MapPinIcon className="h-3 w-3 mr-1" />
                            <span className="truncate">{gym.location}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-700">
                            From ₹{Math.min(...gym.plans.map(p => p.price))}
                          </span>
                          <button className="px-3 py-1 bg-black text-white rounded-md text-xs">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Global styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 14px !important;
        }
      `}</style>
    </div>
  );
}