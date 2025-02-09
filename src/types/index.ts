// src/types/index.ts

// export interface Gym {
//     id: string;
//     name: string;
//     location: Location;
//     googleMapsLink?: string;
//     facilities: Facility[];
//     equipment: string[];
//     images: string[];
//     schedule: WeeklySchedule;
//     plans: GymPlan[];
//     ownerId: string;
//   }

export interface Gym {
  id: string;
  name: string;
  location: Location;
  facilities: Facility[];
  equipment: string[];
  images: (string | File)[];
  schedule: WeeklySchedule;
  googleMapsLink: string;
  plans: GymPlan[];
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
}
  
  export type Location = 
    | 'Guwahati'
    | 'Tezpur'
    | 'Jorhat'
    | 'Dibrugarh'
    | 'Tinsukia'
    | 'Silchar'
    | 'ALL';
  
  export interface Facility {
    name: string;
    available: boolean;
  }
  
  export interface WeeklySchedule {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  }
  
  export interface SessionTime {
    openTime: string;
    closeTime: string;
  }

  export interface DaySchedule {
    morningSession: SessionTime;
  eveningSession: SessionTime;
    isOpen: boolean;
  }
  
  export interface GymPlan {
    id: string;
    name: string;
    duration: 'day'|'month' | '3months' | '6months' | 'year';
    price: number;
  }

  // export interface GymPlan {
  //   id: string;
  //   name: string;
  //   duration: string;
  //   price: number;
  //   isActive: boolean;
  // }
  
  export interface Booking {
    id: string;
    userId: string;
    gymId: string;
    planId: string;
    startDate: Date | null;
    endDate: Date | null;
    status: 'active'|'upcoming' | 'completed' | 'cancelled';
    otp: string; // Added otp property
    userDetails: {
      id: string;
      name: string;
      email: string;
    };
    gym: Gym; // Add gym property
    plan: GymPlan; // Add plan property
  }

  // interface BookingData extends Omit<Booking, 'id'> {
  //   userId: string;
  //   gymId: string;
  //   planId: string;
  //   startDate: Date;
  //   endDate: Date;
  //   status: Booking['status'];
  //   otp: string;
  //   userDetails: {
  //     id: string;
  //     name: string;
  //     email: string;
  //   };
  //   gym: Gym; // Add gym property
  //   plan: GymPlan; // Add plan property
  // }

  export const initialSchedule: WeeklySchedule = {
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