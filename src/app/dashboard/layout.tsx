// // src/app/dashboard/layout.tsx

// 'use client';

// import { useAuth } from '@/context/AuthContext';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import { 
//   HomeIcon, 
//   BuildingOfficeIcon, 
//   CalendarIcon, 
//   UserGroupIcon,
//   Cog6ToothIcon
// } from '@heroicons/react/24/outline';

// const navigation = [
//   { name: 'Overview', href: '/dashboard', icon: HomeIcon },
//   { name: 'My Gyms', href: '/dashboard/gyms', icon: BuildingOfficeIcon },
//   { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarIcon },
//   { name: 'Members', href: '/dashboard/members', icon: UserGroupIcon },
//   { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
// ];

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, logout } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   if (!user) {
//     router.push('/login');
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="flex">
//         {/* Sidebar */}
//         <div className="w-64 bg-white shadow-lg min-h-screen">
//           <div className="flex flex-col h-full">
//             <div className="h-16 flex items-center px-6">
//               <span className="text-xl text-gray-700 font-bold">GymBook Dashboard</span>
//             </div>
            
//             <nav className="flex-1 px-4 py-4">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     href={item.href}
//                     className={`flex items-center px-4 py-2 mt-2 text-gray-600 rounded-lg ${
//                       pathname === item.href
//                         ? 'bg-indigo-50 text-indigo-700'
//                         : 'hover:bg-gray-50'
//                     }`}
//                   >
//                     <Icon className="h-5 w-5 mr-3" />
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </nav>

//             <div className="p-4 border-t">
//               <button
//                 onClick={() => logout()}
//                 className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
//               >
//                 Sign Out
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1">
//           <main className="p-6">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// }
// 
// 
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  CalendarIcon, 
  UserGroupIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'My Gyms', href: '/dashboard/gyms', icon: BuildingOfficeIcon },
  { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarIcon },
  { name: 'Members', href: '/dashboard/members', icon: UserGroupIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Full-screen loading indicator with responsive design
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Mobile top bar - always visible on mobile */}
      <div className="lg:hidden bg-white shadow-lg p-4 flex items-center justify-between">
        <span className="text-base sm:text-xl text-gray-700 font-bold">GymBook Dashboard</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {sidebarOpen ? <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" /> : <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />}
        </button>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar - Fully responsive */}
        <div
          className={`
            fixed inset-0 z-40 
            lg:static lg:block lg:w-64 w-2/3
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            bg-white shadow-lg
          `}
        >
          <div className="flex flex-col w-full h-full ">
            {/* Mobile close button */}
            <div className="lg:hidden flex items-center justify-between h-16 px-4 sm:px-6">
              <span className="text-base sm:text-xl text-gray-700 font-bold">GymBook Dashboard</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-600 focus:outline-none"
                aria-label="Close Menu"
              >
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-2 sm:px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center 
                      px-3 sm:px-4 py-2 
                      text-sm sm:text-base 
                      text-gray-600 
                      rounded-lg 
                      ${pathname === item.href
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-2 sm:p-4 border-t">
              <button
                onClick={() => logout()}
                className="
                  w-full 
                  px-3 sm:px-4 
                  py-2 
                  text-xs sm:text-sm 
                  text-gray-600 
                  hover:bg-gray-50 
                  rounded-lg
                "
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area - Responsive Padding */}
        <div className="flex-1 w-full lg:ml-64">
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>

        {/* Overlay for mobile menu */}
        {sidebarOpen && (
          <div 
            className="lg:hidden  fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}