'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { gymService } from '@/services/gymService';
import { Gym } from '@/types';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function MyGymsPage() {
  const { user } = useAuth();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGyms = async () => {
      if (!user) return;
      try {
        const ownerGyms = await gymService.getGymsByOwner(user.uid);
        setGyms(ownerGyms);
      } catch (error) {
        console.error('Error fetching gyms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, [user]);

  const handleDeleteGym = async (gymId: string) => {
    try {
      await gymService.deleteGym(gymId);
      setGyms(gyms.filter(gym => gym.id !== gymId));
    } catch (error) {
      console.error('Error deleting gym:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold  text-gray-800 ">My Gyms</h1>
        <Link href="/dashboard/gyms/register" className="btn btn-primary text-gray-800 flex items-center">
          <PlusIcon className="h-5 w-5 mr-2  text-gray-800 " /> Add New Gym
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gyms.map(gym => (
          <div key={gym.id} className="bg-white shadow-md rounded-lg p-6">
            <img 
              src={gym.images[0]} 
              alt={gym.name} 
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h2 className="text-xl font-semibold  text-gray-800  mb-2">{gym.name}</h2>
            <p className="text-gray-600    mb-4">{gym.location}</p>
            <div className="flex space-x-2">
              <Link 
                href={`/dashboard/gyms/${gym.id}`} 
                className="btn btn-secondary flex-1 text-gray-800  flex items-center justify-center"
              >
                <EyeIcon className="h-5  text-gray-800  w-5 mr-2" /> View
              </Link>
              <Link 
                href={`/dashboard/gyms/edit/${gym.id}`} 
                className="btn btn-primary flex-1 text-gray-800  flex items-center justify-center"
              >
                <PencilIcon className="h-5  text-gray-800  w-5 mr-2" /> Edit
              </Link>
              <button 
                onClick={() => handleDeleteGym(gym.id)}
                className="btn btn-danger flex-1  text-gray-800 flex items-center justify-center"
              >
                <TrashIcon className="h-5  text-gray-800  w-5 mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}