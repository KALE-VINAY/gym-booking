'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { bookingService } from '@/services/bookingService';
import { gymService } from '@/services/gymService';
// import { Booking, Gym } from '@/types';

export default function MembersPage() {
  const { user } = useAuth();
  interface Member {
    id: string;
    name: string;
    email: string;
    gymCount: number;
  }

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user) return;
      try {
        const ownerGyms = await gymService.getGymsByOwner(user.uid);
        
        const memberBookings = await Promise.all(
          ownerGyms.map(gym => bookingService.getGymBookings(gym.id))
        );

        const uniqueMembers = memberBookings.flat().reduce((acc: Member[], booking) => {
          if (!acc.find(member => member.id === booking.userDetails.id)) {
            acc.push({
              ...booking.userDetails,
              gymCount: memberBookings.flat().filter(
                b => b.userDetails.id === booking.userDetails.id
              ).length
            });
          }
          return acc;
        }, []);

        setMembers(uniqueMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl   text-gray-800 font-bold mb-6">Members</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3  text-gray-800  text-left">Name</th>
              <th className="p-3   text-gray-800 text-left">Email</th>
              <th className="p-3   text-gray-800 text-left">Gyms Booked</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id} className="border-b">
                <td className=" text-gray-800  p-3">{member.name}</td>
                <td className=" text-gray-800  p-3">{member.email}</td>
                <td className=" text-gray-800  p-3">{member.gymCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}