// src/types/index.ts

export interface Gym {
    id: string;
    name: string;
    location: Location;
    googleMapsLink?: string;
    facilities: Facility[];
    equipment: string[];
    images: string[];
    schedule: WeeklySchedule;
    plans: GymPlan[];
    ownerId: string;
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
  
  export interface DaySchedule {
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }
  
  export interface GymPlan {
    id: string;
    name: string;
    duration: 'day'|'1Week' | '3months' | '6months' | 'year';
    price: number;
  }
  
  export interface Booking {
    id: string;
    userId: string;
    gymId: string;
    planId: string;
    startDate: Date;
    endDate: Date;
    status: 'active' | 'completed' | 'cancelled';
    otp: string; // Added otp property
    userDetails: {
      id: string;
      name: string;
      email: string;
    };
  }