// src/app/dashboard/layout.tsx

'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  CalendarIcon, 
  UserGroupIcon,
  Cog6ToothIcon
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
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="flex flex-col h-full">
            <div className="h-16 flex items-center px-6">
              <span className="text-xl font-bold">GymBook Dashboard</span>
            </div>
            
            <nav className="flex-1 px-4 py-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 mt-2 text-gray-600 rounded-lg ${
                      pathname === item.href
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t">
              <button
                onClick={() => logout()}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}