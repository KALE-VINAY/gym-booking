'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { gymService } from '@/services/gymService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Gym, Location, Facility, WeeklySchedule, GymPlan, initialSchedule } from '@/types';

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
  'Silchar',
  'ALL'
];

const initialGymState: Omit<Gym, 'id' | 'createdAt'> = {
  name: '',
  location: 'Guwahati',
  facilities: [],
  equipment: [''],
  images: [],
  schedule: initialSchedule,
  googleMapsLink: '',
  plans: [
    {
      id: '1',
      name: '',
      duration: '',
      price: 0,
      isActive: true
    }
  ],
  ownerId: '',
};

export default function EditGymPage({ params }: { params: { gymId: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGymOwner, setIsGymOwner] = useState(false);
  const [formData, setFormData] = useState<Omit<Gym, 'id' | 'createdAt'>>(initialGymState);

  useEffect(() => {
    const initializePage = async () => {
      if (!user) return;

      try {
        // Check gym owner status
        const gymOwnersRef = doc(db, 'gymOwners', 'list');
        const docSnap = await getDoc(gymOwnersRef);
        const isOwner = docSnap.exists() && docSnap.data().uids.includes(user.uid);
        setIsGymOwner(isOwner);

        // Fetch gym data
        const gymData = await gymService.getGymById(params.gymId);
        if (!gymData) {
          toast.error('Gym not found');
          router.push('/dashboard/gyms');
          return;
        }

        // Check if current user is the owner of this gym
        if (gymData.ownerId !== user.uid) {
          toast.error('Unauthorized access');
          router.push('/dashboard/gyms');
          return;
        }

        // Omit id and createdAt from the fetched data
        const { id, createdAt, ...formDataWithoutId } = gymData;
        setFormData(formDataWithoutId);
      } catch (error) {
        console.error('Error initializing page:', error);
        toast.error('Failed to load gym data');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [user, params.gymId, router]);

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
      const currentImages = formData.images.filter(img => typeof img === 'string');
      setFormData({
        ...formData,
        images: [...currentImages, ...filesArray]
      });
    }
  };

  const handleScheduleChange = (
    day: keyof WeeklySchedule,
    session: 'morningSession' | 'eveningSession',
    field: 'openTime' | 'closeTime' | 'isOpen',
    value: string | boolean
  ) => {
    const updatedSchedule = { ...formData.schedule };
    
    if (field === 'isOpen') {
      updatedSchedule[day] = {
        ...updatedSchedule[day],
        isOpen: value as boolean
      };
    } else {
      updatedSchedule[day] = {
        ...updatedSchedule[day],
        [session]: {
          ...updatedSchedule[day][session],
          [field]: value
        }
      };
    }

    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleAddPlan = () => {
    setFormData({
      ...formData,
      plans: [
        ...formData.plans,
        {
          id: (formData.plans.length + 1).toString(),
          name: '',
          duration: '',
          price: 0,
          isActive: true
        }
      ]
    });
  };

  const handleRemovePlan = (planId: string) => {
    setFormData({
      ...formData,
      plans: formData.plans.filter(plan => plan.id !== planId)
    });
  };

  const handlePlanChange = (planId: string, field: keyof GymPlan, value: string | number | boolean) => {
    setFormData({
      ...formData,
      plans: formData.plans.map(plan =>
        plan.id === planId
          ? { ...plan, [field]: value }
          : plan
      )
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !isGymOwner) {
      toast.error('You are not authorized to edit this gym');
      return;
    }

    if (!formData.name || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.plans.some(plan => !plan.name || !plan.duration)) {
      toast.error('Please fill in all plan details');
      return;
    }

    try {
      setSaving(true);

      const updatedGym = {
        ...formData,
        ownerId: user.uid,
        updatedAt: new Date().toISOString()
      };

      await gymService.updateGym(params.gymId, updatedGym);
      toast.success('Gym updated successfully!');
      router.push('/dashboard/gyms');
    } catch (error) {
      console.error('Error updating gym:', error);
      toast.error('Failed to update gym');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isGymOwner) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
          Unauthorized Access
        </h1>
        <p className="text-center text-gray-600">
          You are not authorized to edit this gym. Please contact the administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">Edit Gym Details</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
          
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
                Google Maps Link
              </label>
              <input
                type="url"
                value={formData.googleMapsLink}
                onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                placeholder="Paste Google Maps link here"
                className="w-full p-2 border text-gray-700 rounded-md text-sm sm:text-base"
              />
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
                <span className="text-gray-800">{facility}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">Equipment</h2>
          
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Gym Images</h2>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.images.filter(img => typeof img === 'string').map((url, index) => (
                <div key={index} className="relative">
                  <img src={url as string} alt={`Gym image ${index + 1}`} className="w-full h-32 object-cover rounded" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Upload New Images:</h3>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full text-gray-800 text-sm sm:text-base"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Upload new images to replace the current ones (max 4)
            </p>
          </div>
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
         <h2 className="text-xl font-semibold text-gray-800 mb-4">Membership Plans</h2>
         
         <div className="space-y-4">
           {formData.plans.map((plan) => (
             <div key={plan.id} className="flex flex-col space-y-4 p-4 border rounded-lg">
               <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                 <div className="w-full sm:w-1/3">
                   <label className="block text-sm text-gray-600 mb-1">Plan Name</label>
                   <input
                     type="text"
                     value={plan.name}
                     onChange={(e) => handlePlanChange(plan.id, 'name', e.target.value)}
                     placeholder="e.g., Monthly Pass"
                     className="w-full p-2 border text-gray-800 rounded-md text-sm"
                   />
                 </div>
                 
                 <div className="w-full sm:w-1/3">
                   <label className="block text-sm text-gray-600 mb-1">Duration</label>
                   <input
                     type="text"
                     value={plan.duration}
                     onChange={(e) => handlePlanChange(plan.id, 'duration', e.target.value)}
                     placeholder="e.g., 1 month, 3 months"
                     className="w-full p-2 border text-gray-800 rounded-md text-sm"
                   />
                 </div>

                 <div className="w-full sm:w-1/3">
                   <label className="block text-sm text-gray-600 mb-1">Price (₹)</label>
                   <input
                     type="number"
                     value={plan.price}
                     onChange={(e) => handlePlanChange(plan.id, 'price', parseInt(e.target.value) || 0)}
                     placeholder="Price"
                     className="w-full p-2 border text-gray-800 rounded-md text-sm"
                     min="0"
                   />
                 </div>
               </div>

               <div className="flex justify-between items-center">
                 <label className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     checked={plan.isActive}
                     onChange={(e) => handlePlanChange(plan.id, 'isActive', e.target.checked)}
                     className="rounded text-indigo-600"
                   />
                   <span className="text-sm text-gray-700">Active Plan</span>
                 </label>

                 {formData.plans.length > 1 && (
                   <button
                     type="button"
                     onClick={() => handleRemovePlan(plan.id)}
                     className="text-red-600 hover:text-red-700 p-2 flex items-center"
                   >
                     <TrashIcon className="h-5 w-5 mr-1" />
                     <span>Remove Plan</span>
                   </button>
                 )}
               </div>
             </div>
           ))}

           <button
             type="button"
             onClick={handleAddPlan}
             className="flex items-center text-indigo-600 hover:text-indigo-700"
           >
             <PlusIcon className="h-5 w-5 mr-1" />
             Add New Plan
           </button>
         </div>
       </div>

       {/* Submit Button */}
       <div className="flex space-x-4">
         <button
           type="button"
           onClick={() => router.push('/dashboard/gyms')}
           className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm sm:text-base"
         >
           Cancel
         </button>
         <button
           type="submit"
           disabled={saving}
           className="flex-1 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 text-sm sm:text-base"
         >
           {saving ? 'Saving Changes...' : 'Save Changes'}
         </button>
       </div>
     </form>
   </div>
 );
}



// // 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { gymService } from '@/services/gymService';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/config/firebase';
// import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
// import { Gym, Location, WeeklySchedule, GymPlan, initialSchedule } from '@/types';

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
//   'Silchar',
//   'ALL'
// ];

// const initialGymState: Omit<Gym, 'id' | 'createdAt'> = {
//   name: '',
//   location: 'Guwahati',
//   facilities: [],
//   equipment: [''],
//   images: [],
//   schedule: initialSchedule,
//   googleMapsLink: '',
//   plans: [
//     {
//       id: '1',
//       name: '',
//       duration: '',
//       price: 0,
//       isActive: true
//     }
//   ],
//   ownerId: '',
// };

// export default function EditGymPage({ params }: { params: { gymId: string } }) {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [isGymOwner, setIsGymOwner] = useState(false);
//   const [formData, setFormData] = useState<Omit<Gym, 'id' | 'createdAt'>>(initialGymState);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const initializePage = async () => {
//       if (!user) {
//         setLoading(false);
//         router.push('/login'); // Redirect to login if no user
//         return;
//       }

//       if (!params.gymId) {
//         setError('No gym ID provided');
//         setLoading(false);
//         return;
//       }

//       try {
//         // Check gym owner status
//         const gymOwnersRef = doc(db, 'gymOwners', 'list');
//         const docSnap = await getDoc(gymOwnersRef);
        
//         if (!docSnap.exists()) {
//           setError('Gym owners list not found');
//           setLoading(false);
//           return;
//         }

//         const ownerData = docSnap.data();
//         const isOwner = ownerData?.uids?.includes(user.uid) || false;
//         setIsGymOwner(isOwner);

//         if (!isOwner) {
//           setError('Unauthorized access');
//           setLoading(false);
//           return;
//         }

//         // Fetch gym data
//         const gymData = await gymService.getGymById(params.gymId);
        
//         if (!gymData) {
//           setError('Gym not found');
//           toast.error('Gym not found');
//           router.push('/dashboard/gyms');
//           return;
//         }

//         // Verify ownership
//         if (gymData.ownerId !== user.uid) {
//           setError('Unauthorized access');
//           toast.error('Unauthorized access');
//           router.push('/dashboard/gyms');
//           return;
//         }

//         // Omit id and createdAt from the fetched data
//         const { id, createdAt, ...formDataWithoutId } = gymData;
        
//         // Ensure all required fields are present
//         const sanitizedData = {
//           ...initialGymState,
//           ...formDataWithoutId,
//           // Ensure arrays are initialized
//           facilities: formDataWithoutId.facilities || [],
//           equipment: formDataWithoutId.equipment || [''],
//           images: formDataWithoutId.images || [],
//           plans: formDataWithoutId.plans || [initialGymState.plans[0]]
//         };

//         setFormData(sanitizedData);
//       } catch (error) {
//         console.error('Error initializing page:', error);
//         setError('Failed to load gym data');
//         toast.error('Failed to load gym data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializePage();
//   }, [user, params.gymId, router]);

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
//       const currentImages = formData.images.filter(img => typeof img === 'string');
//       setFormData({
//         ...formData,
//         images: [...currentImages, ...filesArray]
//       });
//     }
//   };

//   const handleScheduleChange = (
//     day: keyof WeeklySchedule,
//     session: 'morningSession' | 'eveningSession',
//     field: 'openTime' | 'closeTime' | 'isOpen',
//     value: string | boolean
//   ) => {
//     const updatedSchedule = { ...formData.schedule };
    
//     if (field === 'isOpen') {
//       updatedSchedule[day] = {
//         ...updatedSchedule[day],
//         isOpen: value as boolean
//       };
//     } else {
//       updatedSchedule[day] = {
//         ...updatedSchedule[day],
//         [session]: {
//           ...updatedSchedule[day][session],
//           [field]: value
//         }
//       };
//     }

//     setFormData({ ...formData, schedule: updatedSchedule });
//   };

//   const handleAddPlan = () => {
//     setFormData({
//       ...formData,
//       plans: [
//         ...formData.plans,
//         {
//           id: (formData.plans.length + 1).toString(),
//           name: '',
//           duration: '',
//           price: 0,
//           isActive: true
//         }
//       ]
//     });
//   };

//   const handleRemovePlan = (planId: string) => {
//     setFormData({
//       ...formData,
//       plans: formData.plans.filter(plan => plan.id !== planId)
//     });
//   };

//   const handlePlanChange = (planId: string, field: keyof GymPlan, value: string | number | boolean) => {
//     setFormData({
//       ...formData,
//       plans: formData.plans.map(plan =>
//         plan.id === planId
//           ? { ...plan, [field]: value }
//           : plan
//       )
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!user || !isGymOwner) {
//       toast.error('You are not authorized to edit this gym');
//       return;
//     }

//     if (!formData.name || !formData.location) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     if (formData.plans.some(plan => !plan.name || !plan.duration)) {
//       toast.error('Please fill in all plan details');
//       return;
//     }

//     try {
//       setSaving(true);

//       // Filter out any empty equipment entries
//       const sanitizedFormData = {
//         ...formData,
//         equipment: formData.equipment.filter(item => item.trim() !== ''),
//         ownerId: user.uid
//       };

//       await gymService.updateGym(params.gymId, sanitizedFormData);
//       toast.success('Gym updated successfully!');
//       router.push('/dashboard/gyms');
//     } catch (error) {
//       console.error('Error updating gym:', error);
//       toast.error('Failed to update gym');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
//           Error
//         </h1>
//         <p className="text-center text-gray-600">
//           {error}
//         </p>
//       </div>
//     );
//   }

//   if (!isGymOwner) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
//           Unauthorized Access
//         </h1>
//         <p className="text-center text-gray-600">
//           You are not authorized to edit this gym. Please contact the administrator if you believe this is an error.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">Edit Gym Details</h1>

//       <form onSubmit={handleSubmit} className="space-y-8">
//         {/* Basic Information */}
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
          
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
//                 className="w-full p-2 text-gray-800 border rounded-md text-sm sm:text-base"
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
//                 className="w-full p-2 text-gray-800 border rounded-md text-sm sm:text-base"
//               >
//                 <option value="">Select Location</option>
//                 {locationOptions.map((location) => (
//                   <option key={location} value={location}>
//                     {location}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Google Maps Link
//               </label>
//               <input
//                 type="url"
//                 value={formData.googleMapsLink}
//                 onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
//                 placeholder="Paste Google Maps link here"
//                 className="w-full p-2 border text-gray-700 rounded-md text-sm sm:text-base"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Facilities */}
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
//           <h2 className="text-xl text-gray-700 font-semibold mb-4">Facilities</h2>
          
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
//             {facilityOptions.map((facility) => (
//               <label key={facility} className="flex items-center space-x-2 text-sm sm:text-base">
//                 <input
//                   type="checkbox"
//                   checked={formData.facilities.some(f => f.name === facility)}
//                   onChange={() => handleFacilityToggle(facility)}
//                   className="rounded text-indigo-600"
//                 />
//                 <span className="text-gray-800">{facility}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Equipment */}
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
//           <h2 className="text-xl text-gray-800 font-semibold mb-4">Equipment</h2>
          
//           <div className="space-y-2">
//             {formData.equipment.map((item, index) => (
//               <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//                 <input
//                   type="text"
//                   value={item}
//                   onChange={(e) => handleEquipmentChange(index, e.target.value)}
//                   placeholder="Equipment name"
//                   className="flex-1 p-2 border text-black rounded-md text-sm sm:text-base"
//                 />
//                 {index === formData.equipment.length - 1 && (
//                   <button
//                     type="button"
//                     onClick={handleEquipmentAdd}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm sm:text-base"
//                   >
//                     Add More
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Images */}
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Gym Images</h2>
          
//           <div className="mb-4">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//               {formData.images.filter(img => typeof img === 'string').map((url, index) => (
//                 <div key={index} className="relative">
//                   <img src={url as string} alt={`Gym image ${index + 1}`} className="w-full h-32 object-cover rounded" />
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <div>
//             <h3 className="text-sm font-medium text-gray-700 mb-2">Upload New Images:</h3>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageChange}
//               className="w-full text-gray-800 text-sm sm:text-base"
//             />
//             <p className="text-xs sm:text-sm text-gray-500 mt-2">
//               Upload new images to replace the current ones (max 4)
//             </p>
//           </div>
//         </div>

//         {/* Schedule */}
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6">Operating Hours</h2>
          
//           <div className="grid grid-cols-5 gap-4 mb-4 items-center">
//             <div className="font-medium text-gray-700">Day</div>
//             <div className="col-span-2 text-center font-medium text-gray-700">Morning Session</div>
//             <div className="col-span-2 text-center font-medium text-gray-700">Evening Session</div>
//           </div>

//           {Object.entries(formData.schedule).map(([day, schedule]) => (
//             <div key={day} className="grid grid-cols-5 gap-4 mb-4 items-center">
//               <div className="flex items-center">
//                 <input
//                  type="checkbox"
//                  checked={schedule.isOpen}
//                  onChange={(e) => handleScheduleChange(
//                    day as keyof WeeklySchedule,
//                    'morningSession',
//                    'isOpen',
//                    e.target.checked
//                  )}
//                  className="mr-2"
//                />
//                <span className="capitalize text-sm text-gray-800">{day}</span>
//              </div>
             
//              <div className="col-span-2 grid grid-cols-2 gap-2">
//                <input
//                  type="time"
//                  value={schedule.morningSession.openTime}
//                  onChange={(e) => handleScheduleChange(
//                    day as keyof WeeklySchedule,
//                    'morningSession',
//                    'openTime',
//                    e.target.value
//                  )}
//                  disabled={!schedule.isOpen}
//                  className="p-2 border text-gray-800 rounded-md text-sm"
//                />
//                <input
//                  type="time"
//                  value={schedule.morningSession.closeTime}
//                  onChange={(e) => handleScheduleChange(
//                    day as keyof WeeklySchedule,
//                    'morningSession',
//                    'closeTime',
//                    e.target.value
//                  )}
//                  disabled={!schedule.isOpen}
//                  className="p-2 border text-gray-800 rounded-md text-sm"
//                />
//              </div>

//              <div className="col-span-2 grid grid-cols-2 gap-2">
//                <input
//                  type="time"
//                  value={schedule.eveningSession.openTime}
//                  onChange={(e) => handleScheduleChange(
//                    day as keyof WeeklySchedule,
//                    'eveningSession',
//                    'openTime',
//                    e.target.value
//                  )}
//                  disabled={!schedule.isOpen}
//                  className="p-2 border text-gray-800 rounded-md text-sm"
//                />
//                <input
//                  type="time"
//                  value={schedule.eveningSession.closeTime}
//                  onChange={(e) => handleScheduleChange(
//                    day as keyof WeeklySchedule,
//                    'eveningSession',
//                    'closeTime',
//                    e.target.value
//                  )}
//                  disabled={!schedule.isOpen}
//                  className="p-2 border text-gray-800 rounded-md text-sm"
//                />
//              </div>
//            </div>
//          ))}
//        </div>

//        {/* Plans */}
//        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
//          <h2 className="text-xl font-semibold text-gray-800 mb-4">Membership Plans</h2>
         
//          <div className="space-y-4">
//            {formData.plans.map((plan) => (
//              <div key={plan.id} className="flex flex-col space-y-4 p-4 border rounded-lg">
//                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
//                  <div className="w-full sm:w-1/3">
//                    <label className="block text-sm text-gray-600 mb-1">Plan Name</label>
//                    <input
//                      type="text"
//                      value={plan.name}
//                      onChange={(e) => handlePlanChange(plan.id, 'name', e.target.value)}
//                      placeholder="e.g., Monthly Pass"
//                      className="w-full p-2 border text-gray-800 rounded-md text-sm"
//                    />
//                  </div>
                 
//                  <div className="w-full sm:w-1/3">
//                    <label className="block text-sm text-gray-600 mb-1">Duration</label>
//                    <input
//                      type="text"
//                      value={plan.duration}
//                      onChange={(e) => handlePlanChange(plan.id, 'duration', e.target.value)}
//                      placeholder="e.g., 1 month, 3 months"
//                      className="w-full p-2 border text-gray-800 rounded-md text-sm"
//                    />
//                  </div>

//                  <div className="w-full sm:w-1/3">
//                    <label className="block text-sm text-gray-600 mb-1">Price (₹)</label>
//                    <input
//                      type="number"
//                      value={plan.price}
//                      onChange={(e) => handlePlanChange(plan.id, 'price', parseInt(e.target.value) || 0)}
//                      placeholder="Price"
//                      className="w-full p-2 border text-gray-800 rounded-md text-sm"
//                      min="0"
//                    />
//                  </div>
//                </div>

//                <div className="flex justify-between items-center">
//                  <label className="flex items-center space-x-2">
//                    <input
//                      type="checkbox"
//                      checked={plan.isActive}
//                      onChange={(e) => handlePlanChange(plan.id, 'isActive', e.target.checked)}
//                      className="rounded text-indigo-600"
//                    />
//                    <span className="text-sm text-gray-700">Active Plan</span>
//                  </label>

//                  {formData.plans.length > 1 && (
//                    <button
//                      type="button"
//                      onClick={() => handleRemovePlan(plan.id)}
//                      className="text-red-600 hover:text-red-700 p-2 flex items-center"
//                    >
//                      <TrashIcon className="h-5 w-5 mr-1" />
//                      <span>Remove Plan</span>
//                    </button>
//                  )}
//                </div>
//              </div>
//            ))}

//            <button
//              type="button"
//              onClick={handleAddPlan}
//              className="flex items-center text-indigo-600 hover:text-indigo-700"
//            >
//              <PlusIcon className="h-5 w-5 mr-1" />
//              Add New Plan
//            </button>
//          </div>
//        </div>

//        {/* Submit Button */}
//        <div className="flex space-x-4">
//          <button
//            type="button"
//            onClick={() => router.push('/dashboard/gyms')}
//            className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm sm:text-base"
//          >
//            Cancel
//          </button>
//          <button
//            type="submit"
//            disabled={saving}
//            className="flex-1 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 text-sm sm:text-base"
//          >
//            {saving ? 'Saving Changes...' : 'Save Changes'}
//          </button>
//        </div>
//      </form>
//    </div>
//  );
// }