import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu } from '@headlessui/react';
import { UserCircleIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToGyms = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('browse-gyms');
    if (element) {
      const offset = element.offsetTop - 64; // 64px is navbar height
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center sm:ml-2 md:ml-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/rfithublogo1.png"
              alt="Gym Logo"
              width={160} // Adjust for responsiveness
              height={50}
              className="object-contain"
              priority
            />
          </Link>
        </div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={scrollToGyms}
              className="flex flex-row items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 transition duration-200"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-1" />
              Gyms
            </button>

            {!user ? (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition">
                  Login
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  {/* <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                      >
                        My Profile
                      </Link>
                    )}
                  </Menu.Item> */}
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/userbookings"
                        className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                      >
                        My Bookings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => logout()}
                        className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}
                      >
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white py-2 px-4 shadow-lg">
           <button
              onClick={scrollToGyms}
              className="flex w-full items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 transition duration-200"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-1" />
              Gyms
            </button>
           
              <Link href="/" className="flex w-full items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 transition duration-200">
                      {/* <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-1" /> */}
                      Home
                    </Link>
           
            
            

            {!user ? (
              <div className="flex flex-col space-y-2 mt-2">
                <Link href="/login" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition">
                  Login
                </Link>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                {/* <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  My Profile
                </Link> */}
                <Link href="/userbookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  My Bookings
                </Link>
                <button
                  onClick={() => logout()}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
