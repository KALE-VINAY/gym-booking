// src/components/GymLandingPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { Gym, Location } from '@/types';
import { gymService } from '@/services/gymService';
import { useAuth } from '@/context/AuthContext';
import LocationFilter from '@/components/LocationFilter';
import Link from 'next/link';
import { MapPinIcon, CalendarIcon, TicketIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

export default function GymLandingPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location>('ALL');
  const { user } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

        {/* Add Navbar at the top */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-900 h-screen">
        <div className="absolute inset-0">
          <Image
            src="https://images.creativemarket.com/0.1.0/ps/5850983/1820/1213/m1/fpnw/wm1/iblcsxcrrsyk5q1od294ouwgrtupdxmi11fsjeoermvh8tn6vzfupmaz25w68mzr-.jpg?1549634378&s=ef5caa2ee9c3bd2ec510dadf76727247"
            alt="Gym background"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Helping people live their
              <span className="block text-6xl sm:text-8xl text-green-400 mt-2">
                BEST LIVES
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-100 max-w-3xl mx-auto">
              Health on your mind? We have you covered. Join thousands of fitness enthusiasts
              finding their perfect workout space across Northeast India.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-10"
            >
              <Link
                href="#browse-gyms"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-500 hover:bg-green-600 transition-all duration-200"
              >
                I Want To Get Healthy!
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Rest of the component remains the same ... */}
        {/* Copy the remaining JSX from the previous component */}
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

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-black">300+</div>
              <div className="mt-2 text-lg text-gray-600">Partner Gyms</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-black">10K+</div>
              <div className="mt-2 text-lg text-gray-600">Active Members</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-black">7</div>
              <div className="mt-2 text-lg text-gray-600">Major Cities</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="browse-gyms" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover Nearby Gyms</h2>
            <h3 className='text-gray-400 mt-2 mb-1'>Select Location</h3>
            <div className="w-full sm:w-64">
              <LocationFilter
                selectedLocation={selectedLocation}
                onChange={setSelectedLocation}
                
              />
            </div>
          </div>
          {user && (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                href="/userbookings" 
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors duration-200"
              >
                <TicketIcon className="h-5 w-5 mr-2" />
                My Bookings
              </Link>
            </motion.div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {gyms.map((gym, index) => (
              <motion.div
                key={gym.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  href={`/gyms/${gym.id}`}
                  className="block hover:shadow-lg transition-all duration-300"
                >
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="h-48 w-full relative">
                      <Image
                        src={typeof gym.images[0] === 'string' ? gym.images[0] : ''}
                        alt={gym.name}
                        layout="fill"
                        objectFit="cover"
                        className="transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{gym.name}</h3>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {gym.location}
                      </div>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {gym.facilities.slice(0, 3).map((facility, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {facility.name}
                            </span>
                          ))}
                          {gym.facilities.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{gym.facilities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Plans from ₹{Math.min(...gym.plans.map(p => p.price))}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors duration-200"
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
        )}



      </div>
    </div>
  );
}