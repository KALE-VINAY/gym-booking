// // src/app/gyms/[id]/page.tsx

// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { gymService } from '@/services/gymService';
// import { Gym, GymPlan } from '@/types';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
// import toast from 'react-hot-toast';
// import { Tab } from '@headlessui/react';
// import { MapPinIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline';

// export default function GymDetailsPage() {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const [gym, setGym] = useState<Gym | null>(null);
//   const [selectedPlan, setSelectedPlan] = useState<GymPlan | null>(null);
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchGym = async () => {
//       try {
//         setLoading(true);
//         const fetchedGym = await gymService.getGymById(id as string);
//         setGym(fetchedGym);
//       } catch (error) {
//         console.error('Error fetching gym:', error);
//         toast.error('Failed to load gym details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchGym();
//     }
//   }, [id]);

//   const handleBooking = async () => {
//     if (!user) {
//       toast.error('Please login to book a session');
//       return;
//     }

//     if (!selectedPlan || !startDate) {
//       toast.error('Please select a plan and date');
//       return;
//     }

//     try {
//       // Implement booking logic here
//       toast.success('Booking successful!');
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       toast.error('Failed to create booking');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (!gym) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold text-gray-900">Gym not found</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Image Gallery */}
//         <div className="grid grid-cols-2 gap-4 mb-8">
//           <div className="col-span-2 h-96">
//             <img
//               src={gym.images[0]}
//               alt={gym.name}
//               className="w-full h-full object-cover rounded-lg"
//             />
//           </div>
//           {gym.images.slice(1).map((image, index) => (
//             <div key={index} className="h-48">
//               <img
//                 src={image}
//                 alt={`${gym.name} ${index + 2}`}
//                 className="w-full h-full object-cover rounded-lg"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Gym Details */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow p-6">
//               <h1 className="text-3xl font-bold text-gray-900 mb-4">{gym.name}</h1>
              
//               <div className="flex items-center text-gray-600 mb-4">
//                 <MapPinIcon className="h-5 w-5 mr-2" />
//                 <span>{gym.location}</span>
//               </div>

//               <Tab.Group>
//                 <Tab.List className="flex space-x-1 rounded-xl bg-indigo-900/20 p-1">
//                   <Tab
//                     className={({ selected }) =>
//                       `w-full rounded-lg py-2.5 text-sm font-medium leading-5
//                       ${selected
//                         ? 'bg-white text-indigo-700 shadow'
//                         : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
//                       }`
//                     }
//                   >
//                     Facilities
//                   </Tab>
//                   <Tab
//                     className={({ selected }) =>
//                       `w-full rounded-lg py-2.5 text-sm font-medium leading-5
//                       ${selected
//                         ? 'bg-white text-indigo-700 shadow'
//                         : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
//                       }`
//                     }
//                   >
//                     Schedule
//                   </Tab>
//                   <Tab
//                     className={({ selected }) =>
//                       `w-full rounded-lg py-2.5 text-sm font-medium leading-5
//                       ${selected
//                         ? 'bg-white text-indigo-700 shadow'
//                         : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
//                       }`
//                     }
//                   >
//                     Equipment
//                   </Tab>
//                 </Tab.List>
//                 <Tab.Panels className="mt-4">
//                   <Tab.Panel className="grid grid-cols-2 gap-4">
//                     {gym.facilities.map((facility, index) => (
//                       <div key={index} className="flex items-center text-gray-600">
//                         <CheckIcon className="h-5 w-5 mr-2 text-green-500" />
//                         <span>{facility.name}</span>
//                       </div>
//                     ))}
//                   </Tab.Panel>
//                   <Tab.Panel>
//                     <div className="space-y-4">
//                       {Object.entries(gym.schedule).map(([day, schedule]) => (
//                         <div key={day} className="flex justify-between items-center">
//                           <span className="capitalize">{day}</span>
//                           <span>
//                             {schedule.isOpen 
//                               ? `${schedule.openTime} - ${schedule.closeTime}`
//                               : 'Closed'}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </Tab.Panel>
//                   <Tab.Panel>
//                     <ul className="list-disc pl-5 space-y-2">
//                       {gym.equipment.map((item, index) => (
//                         <li key={index}>{item}</li>
//                       ))}
//                     </ul>
//                   </Tab.Panel>
//                 </Tab.Panels>
//               </Tab.Group>
//             </div>
//           </div>

//           {/* Booking Section */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-semibold mb-4">Book a Session</h2>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select Plan
//                   </label>
//                   <div className="space-y-2">
//                     {gym.plans.map((plan) => (
//                       <button
//                         key={plan.id}
//                         onClick={() => setSelectedPlan(plan)}
//                         className={`w-full p-3 rounded-lg border ${
//                           selectedPlan?.id === plan.id
//                             ? 'border-indigo-600 bg-indigo-50'
//                             : 'border-gray-200 hover:border-indigo-600'
//                         }`}
//                       >
//                         <div className="flex justify-between items-center">
//                           <span>{plan.name}</span>
//                           <span>₹{plan.price}</span>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Start Date
//                   </label>
//                   <DatePicker
//                     selected={startDate}
//                     onChange={(date) => setStartDate(date)}
//                     minDate={new Date()}
//                     className="w-full p-2 border rounded-lg"
//                     placeholderText="Select start date"
//                   />
//                 </div>

//                 <button
//                   onClick={handleBooking}
//                   className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
//                   disabled={!selectedPlan || !startDate}
//                 >
//                   Book Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { gymService } from '@/services/gymService';
import { bookingService } from '@/services/bookingService'; // New Service
import { Gym, GymPlan } from '@/types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast';
import { Tab } from '@headlessui/react';
import { 
  MapPinIcon, 
 
  // ClockIcon, 
  CheckIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function GymDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [gym, setGym] = useState<Gym | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<GymPlan | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        setLoading(true);
        const fetchedGym = await gymService.getGymById(id as string);
        setGym(fetchedGym);
      } catch (error) {
        console.error('Error fetching gym:', error);
        toast.error('Failed to load gym details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGym();
    }
  }, [id]);



  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book a session');
      return;
    }

    if (!selectedPlan || !startDate) {
      toast.error('Please select a plan and date');
      return;
    }

    // const otp = generateOTP();

    try {
      // Implement booking logic here
      await bookingService.createBooking(
        user.uid,
        gym?.id as string,
        selectedPlan,
        startDate,
        { name: user.displayName || '', email: user.email || '' }
      ); // Save booking to Firebase
      toast.success('Booking successful!');
      // toast.success(`Your OTP: ${otp}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const handleImageNavigation = (direction: 'next' | 'prev') => {
    if (!gym || !gym.images.length) return;
    
    const totalImages = gym.images.length;
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % totalImages
      : (currentImageIndex - 1 + totalImages) % totalImages;
    
    setCurrentImageIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Gym not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Image Carousel */}
        <div className="relative mb-8 group">
          <div 
            ref={carouselRef}
            className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg"
          >
            {gym.images.map((image, index) => (
              <div 
                key={index}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                  alt={`${gym.name} ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {gym.images.length > 1 && (
            <>
              <button
                onClick={() => handleImageNavigation('prev')}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 
                  bg-white/50 hover:bg-white/75 rounded-full p-2 
                  opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
              </button>
              <button
                onClick={() => handleImageNavigation('next')}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 
                  bg-white/50 hover:bg-white/75 rounded-full p-2 
                  opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-800" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {gym.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 
                  ${index === currentImageIndex ? 'bg-indigo-600 w-6' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Gym Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{gym.name}</h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span className="text-sm md:text-base">{gym.location}</span>
                {gym.googleMapsLink && (
                  <a 
                    href={gym.googleMapsLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="ml-4 text-gray-600 hover:text-[#6bc272] text-sm flex items-center"
                  >
                    {/* <ExternalLinkIcon className="h-4 w-4 mr-1" /> */}
                    View Location
                  </a>
                )}
              </div>

              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-indigo-900/20 p-1">
                  {['Facilities', 'Schedule', 'Additional Info'].map((tabName) => (
                    <Tab
                      key={tabName}
                      className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-xs md:text-sm font-medium leading-5
                        ${selected
                          ? 'bg-white text-[#6bc272] shadow'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-[#6bc272]'
                        }`
                      }
                    >
                      {tabName}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-4 text-sm md:text-base">
                  <Tab.Panel className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gym.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <CheckIcon className="h-5 w-5 mr-2 text-green-500" />
                        <span>{facility.name}</span>
                      </div>
                    ))}
                  </Tab.Panel>
                   {/* Update the schedule display in GymDetailsPage.tsx */}
                  <Tab.Panel>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <h2 className="text-sm md:text-base font-semibold text-gray-800">Day</h2>
                        <h2 className="text-sm md:text-base font-semibold text-gray-800">Morning Session</h2>
                        <h2 className="text-sm md:text-base font-semibold text-gray-800">Evening Session</h2>
                      </div>
                      
                      {Object.entries(gym.schedule || {}).map(([day, schedule]) => (
                        <div key={day} className="grid grid-cols-3 gap-4 text-gray-600">
                          <span className="capitalize">{day}</span>
                          <span>
                            {schedule?.isOpen && schedule?.morningSession
                              ? `${schedule.morningSession.openTime} - ${schedule.morningSession.closeTime}`
                              : 'Closed'}
                          </span>
                          <span>
                            {schedule?.isOpen && schedule?.eveningSession
                              ? `${schedule.eveningSession.openTime} - ${schedule.eveningSession.closeTime}`
                              : 'Closed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <ul className="list-disc pl-5 space-y-1 md:space-y-2">
                      {gym.equipment.map((item, index) => (
                        <li key={index} className="text-sm md:text-base  text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl  text-gray-600 font-semibold mb-4">Book a Session</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Plan
                  </label>
                  <div className="space-y-2">
                    {gym.plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`w-full p-3 rounded-lg  text-gray-600 border text-sm ${
                          selectedPlan?.id === plan.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-[#6bc272]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{plan.name}</span>
                          <span>₹{plan.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <DatePicker    
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    minDate={new Date()}
                    className="w-full p-2 cursor-pointer border rounded-lg text-sm"
                    placeholderText="Select start date"
                  />
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-[#6bc272] text-white cursor-pointer py-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base"
                  disabled={!selectedPlan || !startDate}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}