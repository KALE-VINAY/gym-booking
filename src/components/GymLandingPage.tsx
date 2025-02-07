'use client';

import { useState, useEffect } from 'react';
import { Gym, Location } from '@/types';
import { gymService } from '@/services/gymService';
import { useAuth } from '@/context/AuthContext';
import LocationFilter from '@/components/LocationFilter';
import Link from 'next/link';
import { MapPinIcon, CalendarIcon, TicketIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

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

  return (
    <div className="min-h-screen bg-white">
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

      {/* Stats Section
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { number: "300+", text: "Partner Gyms" },
              { number: "10K+", text: "Active Members" },
              { number: "7", text: "Major Cities" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-6 bg-white rounded-lg shadow-lg"
              >
                <div className="text-4xl font-bold text-[#6bc272]">{stat.number}</div>
                <div className="mt-2 text-lg text-gray-600">{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div id="browse-gyms" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="w-full sm:w-auto">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              Discover Nearby Gyms
            </motion.h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-600 mb-2">Select Location</h3>
                <div className="w-full sm:w-64 ">
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
                    className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6bc272] focus:border-transparent placeholder-gray-400"
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
                className="flex items-center justify-center px-6 py-3 bg-[#6bc272] text-white rounded-md hover:bg-[#6bc272]/90 text-sm font-medium transition-colors duration-200 w-full sm:w-auto shadow-md"
              >
                <TicketIcon className="h-5 w-5 mr-2" />
                My Bookings
              </Link>
            </motion.div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6bc272]"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                  className="block group hover:#6bc272"
                >
                  <div className="bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border hover:shadow-[#6bc272]/40">
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
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#6bc272]/20 text-[#6bc272]"
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
                          className="px-4 py-2 bg-[#6bc272] text-white rounded-md hover:bg-[#6bc272]/90 text-sm font-medium transition-colors duration-200 shadow-md"
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