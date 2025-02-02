// // src/app/dashboard/gyms/register/page.tsx

// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { gymService } from '@/services/gymService';
// import { Facility, Location, WeeklySchedule } from '@/types';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// const storage = getStorage();

// const initialSchedule: WeeklySchedule = {
//   monday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   tuesday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   wednesday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   thursday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   friday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   saturday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   sunday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
// };

// const facilityOptions: string[] = [
//   'Lockers',
//   'Changing Rooms',
//   'Air Conditioning',
//   'Personal Training',
//   'Washroom',
//   'Unisex',
//   'CrossFit',
//   'Parking',
//   'WiFi'
// ];

// const locationOptions: Location[] = [
//   'Guwahati',
//   'Tezpur',
//   'Jorhat',
//   'Dibrugarh',
//   'Tinsukia',
//   'Silchar'
// ];

// export default function RegisterGymPage() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     location: '' as Location,
//     facilities: [] as Facility[],
//     equipment: [''] as string[],
//     images: [] as File[],
//     schedule: initialSchedule,
//     plans: [
//       { id: '1', name: 'Daily Pass', duration: 'day' as const, price: 0 },
//       { id: '2', name: '3 Months', duration: '3months' as const, price: 0 },
//       { id: '3', name: '6 Months', duration: '6months' as const, price: 0 },
//       { id: '4', name: 'Annual', duration: 'year' as const, price: 0 },
//     ],
//   });

//   const handleFacilityToggle = (facilityName: string) => {
//     const facilities = [...formData.facilities];
//     const index = facilities.findIndex(f => f.name === facilityName);
    
//     if (index === -1) {
//       facilities.push({ name: facilityName, available: true });
//     } else {
//       facilities.splice(index, 1);
//     }
    
//     setFormData({ ...formData, facilities });
//   };

//   const handleEquipmentAdd = () => {
//     setFormData({
//       ...formData,
//       equipment: [...formData.equipment, '']
//     });
//   };

//   const handleEquipmentChange = (index: number, value: string) => {
//     const equipment = [...formData.equipment];
//     equipment[index] = value;
//     setFormData({ ...formData, equipment });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const filesArray = Array.from(e.target.files).slice(0, 4); // Max 4 images
//       setFormData({ ...formData, images: filesArray });
//     }
//   };

//   const handleScheduleChange = (
//     day: keyof WeeklySchedule,
//     field: 'openTime' | 'closeTime' | 'isOpen',
//     value: string | boolean
//   ) => {
//     setFormData({
//       ...formData,
//       schedule: {
//         ...formData.schedule,
//         [day]: {
//           ...formData.schedule[day],
//           [field]: value
//         }
//       }
//     });
//   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     if (!user) {
// //       toast.error('You must be logged in to register a gym');
// //       return;
// //     }

// //     if (formData.images.length < 3) {
// //       toast.error('Please upload at least 3 images of your gym');
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const gymData = {
// //         ...formData,
// //         ownerId: user.uid,
// //       };

// //       await gymService.createGym(gymData, formData.images);
// //       toast.success('Gym registered successfully!');
// //       router.push('/dashboard/gyms');
// //     } catch (error) {
// //       console.error('Error registering gym:', error);
// //       toast.error('Failed to register gym');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!user) {
//     toast.error('You must be logged in to register a gym');
//     return;
//   }

//   if (formData.images.length < 3) {
//     toast.error('Please upload at least 3 images of your gym');
//     return;
//   }

//   try {
//     setLoading(true);

//     // Upload images to Firebase Storage
//     const imageUploadPromises = formData.images.map(async (image) => {
//       const storageRef = ref(storage, `gyms/${user.uid}/${Date.now()}_${image.name}`);
//       const uploadResult = await uploadBytes(storageRef, image);
//       return await getDownloadURL(uploadResult.ref);
//     });

//     const imageUrls = await Promise.all(imageUploadPromises);

//     const gymData = {
//       ...formData,
//       images: imageUrls,
//       ownerId: user.uid,
//     };

//     await gymService.createGym(gymData, formData.images);
//     toast.success('Gym registered successfully!');
//     router.push('/dashboard/gyms');
//   } catch (error) {
//     console.error('Error registering gym:', error);
//     toast.error('Failed to register gym');
//   } finally {
//     setLoading(false);
//   }
// };
  

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Register Your Gym</h1>

//       <form onSubmit={handleSubmit} className="space-y-8">
//         {/* Basic Information */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Gym Name
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Location
//               </label>
//               <select
//                 required
//                 value={formData.location}
//                 onChange={(e) => setFormData({ ...formData, location: e.target.value as Location })}
//                 className="w-full p-2 border rounded-md"
//               >
//                 <option value="">Select Location</option>
//                 {locationOptions.map((location) => (
//                   <option key={location} value={location}>
//                     {location}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Facilities */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Facilities</h2>
          
//           <div className="grid grid-cols-3 gap-4">
//             {facilityOptions.map((facility) => (
//               <label key={facility} className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={formData.facilities.some(f => f.name === facility)}
//                   onChange={() => handleFacilityToggle(facility)}
//                   className="rounded text-indigo-600"
//                 />
//                 <span>{facility}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Equipment */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Equipment</h2>
          
//           <div className="space-y-2">
//             {formData.equipment.map((item, index) => (
//               <div key={index} className="flex space-x-2">
//                 <input
//                   type="text"
//                   value={item}
//                   onChange={(e) => handleEquipmentChange(index, e.target.value)}
//                   placeholder="Equipment name"
//                   className="flex-1 p-2 border rounded-md"
//                 />
//                 {index === formData.equipment.length - 1 && (
//                   <button
//                     type="button"
//                     onClick={handleEquipmentAdd}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md"
//                   >
//                     Add More
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Images */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Gym Images</h2>
          
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleImageChange}
//             className="w-full"
//           />
//           <p className="text-sm text-gray-500 mt-2">
//             Please upload at least 3 images of your gym (max 4)
//           </p>
//         </div>

//         {/* Schedule */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
          
//           {Object.entries(formData.schedule).map(([day, schedule]) => (
//             <div key={day} className="grid grid-cols-3 gap-4 mb-4">
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={schedule.isOpen}
//                   onChange={(e) => handleScheduleChange(
//                     day as keyof WeeklySchedule,
//                     'isOpen',
//                     e.target.checked
//                   )}
//                   className="mr-2"
//                 />
//                 <span className="capitalize">{day}</span>
//               </div>
              
//               <input
//                 type="time"
//                 value={schedule.openTime}
//                 onChange={(e) => handleScheduleChange(
//                   day as keyof WeeklySchedule,
//                   'openTime',
//                   e.target.value
//                 )}
//                 disabled={!schedule.isOpen}
//                 className="p-2 border rounded-md"
//               />
              
//               <input
//                 type="time"
//                 value={schedule.closeTime}
//                 onChange={(e) => handleScheduleChange(
//                   day as keyof WeeklySchedule,
//                   'closeTime',
//                   e.target.value
//                 )}
//                 disabled={!schedule.isOpen}
//                 className="p-2 border rounded-md"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Plans */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Membership Plans</h2>
          
//           <div className="space-y-4">
//             {formData.plans.map((plan) => (
//               <div key={plan.id} className="flex items-center space-x-4">
//                 <span className="w-32">{plan.name}</span>
//                 <input
//                   type="number"
//                   value={plan.price}
//                   onChange={(e) => {
//                     const plans = formData.plans.map(p =>
//                       p.id === plan.id
//                         ? { ...p, price: parseInt(e.target.value) || 0 }
//                         : p
//                     );
//                     setFormData({ ...formData, plans });
//                   }}
//                   placeholder="Price"
//                   className="p-2 border rounded-md"
//                   min="0"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
//         >
//           {loading ? 'Registering...' : 'Register Gym'}
//         </button>
//       </form>
//     </div>
//   );
// }

'use client';

import { useState ,useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { gymService } from '@/services/gymService';
import { Facility, Location, WeeklySchedule } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase'; // Make sure this import path is correct

const storage = getStorage();

// const initialSchedule: WeeklySchedule = {
//   monday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   tuesday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   wednesday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   thursday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   friday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   saturday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
//   sunday: { openTime: '06:00', closeTime: '22:00', isOpen: true },
// };

// RegisterGymPage.tsx - At the top of the file
const initialSchedule: WeeklySchedule = {
  monday: {
    isOpen: true,
    morningSession: { openTime: '06:00', closeTime: '10:00' },
    eveningSession: { openTime: '16:00', closeTime: '21:00' }
  },
  tuesday: {
    isOpen: true,
    morningSession: { openTime: '06:00', closeTime: '10:00' },
    eveningSession: { openTime: '16:00', closeTime: '21:00' }
  },
  wednesday: {
    isOpen: true,
    morningSession: { openTime: '06:00', closeTime: '10:00' },
    eveningSession: { openTime: '16:00', closeTime: '21:00' }
  },
  thursday: {
    isOpen: true,
    morningSession: { openTime: '06:00', closeTime: '10:00' },
    eveningSession: { openTime: '16:00', closeTime: '21:00' }
  },
  friday: {
    isOpen: true,
    morningSession: { openTime: '06:00', closeTime: '10:00' },
    eveningSession: { openTime: '16:00', closeTime: '21:00' }
  },
  saturday: {
    isOpen: true,
    morningSession: { openTime: '06:00', closeTime: '10:00' },
    eveningSession: { openTime: '16:00', closeTime: '21:00' }
  },
  sunday: {
    isOpen: true,
    morningSession: { openTime: '06:00', closeTime: '10:00' },
    eveningSession: { openTime: '16:00', closeTime: '21:00' }
  }
};


const facilityOptions: string[] = [
  'Lockers',
  'Changing Rooms',
  'Air Conditioning',
  'Personal Training',
  'Washroom',
  'Unisex',
  'CrossFit',
  'Parking',
  'WiFi'
];

const locationOptions: Location[] = [
  'Guwahati',
  'Tezpur',
  'Jorhat',
  'Dibrugarh',
  'Tinsukia',
  'Silchar'
];

export default function RegisterGymPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isGymOwner, setIsGymOwner] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '' as Location,
    facilities: [] as Facility[],
    equipment: [''] as string[],
    images: [] as File[],
    schedule: initialSchedule,
    googleMapsLink: '',
    plans: [
      { id: '1', name: 'Daily Pass', duration: 'day' as const, price: 0 },
      { id: '2', name: '3 Months', duration: '3months' as const, price: 0 },
      { id: '3', name: '6 Months', duration: '6months' as const, price: 0 },
      { id: '4', name: 'Annual', duration: 'year' as const, price: 0 },
    ],
  });

  useEffect(() => {
    const checkGymOwnerStatus = async () => {
      if (!user) return;

      try {
        const gymOwnersRef = doc(db, 'gymOwners', 'list');
        const docSnap = await getDoc(gymOwnersRef);

        if (docSnap.exists()) {
          const gymOwners = docSnap.data().uids || [];
          setIsGymOwner(gymOwners.includes(user.uid));
        } else {
          setIsGymOwner(false);
        }
      } catch (error) {
        console.error('Error checking gym owner status:', error);
        setIsGymOwner(false);
      }
    };

    checkGymOwnerStatus();
  }, [user]);


  const handleFacilityToggle = (facilityName: string) => {
    const facilities = [...formData.facilities];
    const index = facilities.findIndex(f => f.name === facilityName);
    
    if (index === -1) {
      facilities.push({ name: facilityName, available: true });
    } else {
      facilities.splice(index, 1);
    }
    
    setFormData({ ...formData, facilities });
  };

  const handleEquipmentAdd = () => {
    setFormData({
      ...formData,
      equipment: [...formData.equipment, '']
    });
  };

  const handleEquipmentChange = (index: number, value: string) => {
    const equipment = [...formData.equipment];
    equipment[index] = value;
    setFormData({ ...formData, equipment });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 4); // Max 4 images
      setFormData({ ...formData, images: filesArray });
    }
  };


   // In RegisterGymPage.tsx, update the schedule section:


   const handleScheduleChange = (
    day: keyof WeeklySchedule,
    session: 'morningSession' | 'eveningSession',
    field: 'openTime' | 'closeTime' | 'isOpen',
    value: string | boolean
  ) => {
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [day]: {
          ...formData.schedule[day],
          ...(field === 'isOpen'
            ? { isOpen: value as boolean }
            : {
                [session]: {
                  ...formData.schedule[day][session],
                  [field]: value
                }
              }
          )
        }
      }
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !isGymOwner) {
      toast.error('You are not authorized to register a gym');
      return;
    }

    if (formData.images.length < 3) {
      toast.error('Please upload at least 3 images of your gym');
      return;
    }

    try {
      setLoading(true);

      const imageUploadPromises = formData.images.map(async (image) => {
        const storageRef = ref(storage, `gyms/${user.uid}/${Date.now()}_${image.name}`);
        const uploadResult = await uploadBytes(storageRef, image);
        return await getDownloadURL(uploadResult.ref);
      });

      const imageUrls = await Promise.all(imageUploadPromises);

      const gymData = {
        ...formData,
        images: imageUrls,
        ownerId: user.uid,
      };

      await gymService.createGym(gymData, formData.images);
      toast.success('Gym registered successfully!');
      router.push('/dashboard/gyms');
    } catch (error) {
      console.error('Error registering gym:', error);
      toast.error('Failed to register gym');
    } finally {
      setLoading(false);
    }
  };

    // Render form only if user is a gym owner
    if (!isGymOwner) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
            Unauthorized Access
          </h1>
          <p className="text-center text-gray-600">
            You are not authorized to register a gym. Please contact the administrator if you believe this is an error.
          </p>
        </div>
      );
    }


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6   text-gray-800 text-center">Register Your Gym</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4  text-gray-800 ">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gym Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 text-gray-800 border rounded-md text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value as Location })}
                className="w-full p-2 text-gray-800 border rounded-md text-sm sm:text-base"
              >
                <option value="">Select Location</option>
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps location Link
              </label>
              <input
                type="url"
                value={formData.googleMapsLink}
                onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                placeholder="Paste Google Maps link here"
                className="w-full p-2 border text-gray-700 rounded-md text-sm sm:text-base"
              />
              <p className="text-xs text-blue-500 mt-1">
                 Provide a direct Google Maps link to your gym location
              </p>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl text-gray-700 font-semibold mb-4">Facilities</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {facilityOptions.map((facility) => (
              <label key={facility} className="flex items-center space-x-2 text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={formData.facilities.some(f => f.name === facility)}
                  onChange={() => handleFacilityToggle(facility)}
                  className="rounded text-indigo-600"
                />
                <span className='text-gray-800'>{facility}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className=" text-sm  md:text-xl   text-gray-800 font-semibold mb-4">Equipment</h2>
          
          <div className="space-y-2">
            {formData.equipment.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleEquipmentChange(index, e.target.value)}
                  placeholder="Equipment name"
                  className="flex-1 p-2 border text-black rounded-md text-sm sm:text-base"
                />
                {index === formData.equipment.length - 1 && (
                  <button
                    type="button"
                    onClick={handleEquipmentAdd}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm sm:text-base"
                  >
                    Add More
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold  text-gray-800  mb-4">Gym Images</h2>
          
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full text-gray-800 text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Please upload at least 3 images of your gym (max 4)
          </p>
        </div>

        {/* Schedule */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Operating Hours</h2>
            
            <div className="grid grid-cols-5 gap-4 mb-4 items-center">
              <div className="font-medium text-gray-700">Day</div>
              <div className="col-span-2 text-center font-medium text-gray-700">Morning Session</div>
              <div className="col-span-2 text-center font-medium text-gray-700">Evening Session</div>
            </div>

            {Object.entries(formData.schedule).map(([day, schedule]) => (
              <div key={day} className="grid grid-cols-5 gap-4 mb-4 items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={schedule.isOpen}
                    onChange={(e) => handleScheduleChange(
                      day as keyof WeeklySchedule,
                      'morningSession',
                      'isOpen',
                      e.target.checked
                    )}
                    className="mr-2"
                  />
                  <span className="capitalize text-sm text-gray-800">{day}</span>
                </div>
                
                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={schedule.morningSession.openTime}
                    onChange={(e) => handleScheduleChange(
                      day as keyof WeeklySchedule,
                      'morningSession',
                      'openTime',
                      e.target.value
                    )}
                    disabled={!schedule.isOpen}
                    className="p-2 border text-gray-800 rounded-md text-sm"
                  />
                  <input
                    type="time"
                    value={schedule.morningSession.closeTime}
                    onChange={(e) => handleScheduleChange(
                      day as keyof WeeklySchedule,
                      'morningSession',
                      'closeTime',
                      e.target.value
                    )}
                    disabled={!schedule.isOpen}
                    className="p-2 border text-gray-800 rounded-md text-sm"
                  />
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={schedule.eveningSession.openTime}
                    onChange={(e) => handleScheduleChange(
                      day as keyof WeeklySchedule,
                      'eveningSession',
                      'openTime',
                      e.target.value
                    )}
                    disabled={!schedule.isOpen}
                    className="p-2 border text-gray-800 rounded-md text-sm"
                  />
                  <input
                    type="time"
                    value={schedule.eveningSession.closeTime}
                    onChange={(e) => handleScheduleChange(
                      day as keyof WeeklySchedule,
                      'eveningSession',
                      'closeTime',
                      e.target.value
                    )}
                    disabled={!schedule.isOpen}
                    className="p-2 border text-gray-800 rounded-md text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

        {/* Plans */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold  text-gray-800  mb-4">Membership Plans</h2>
          
          <div className="space-y-4">
            {formData.plans.map((plan) => (
              <div key={plan.id} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="w-full sm:w-32 text-sm   text-gray-800 sm:text-base">{plan.name}</span>
                <input
                  type="number"
                  value={plan.price}
                  onChange={(e) => {
                    const plans = formData.plans.map(p =>
                      p.id === plan.id
                        ? { ...p, price: parseInt(e.target.value) || 0 }
                        : p
                    );
                    setFormData({ ...formData, plans });
                  }}
                  placeholder="Price"
                  className="w-full p-2 border  text-gray-800  rounded-md text-sm sm:text-base"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>

        {isGymOwner && (
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 text-sm sm:text-base"
          >
            {loading ? 'Registering...' : 'Register Gym'}
          </button>
        )}
      </form>
    </div>
  );
}