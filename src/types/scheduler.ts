export type Talk = {
    slotId: string;
    id: string;
    title: string;
    speaker: string;
    duration: number;
    track?: string;
  };
  
  export interface TimeSlot {
    id: string;
    time: string;
    day: string;
    track: string;
    talkIds: string[];
    remainingMinutes: number;
    mergedIntoId?: string;
  }

  export type DaySchedule = {
    date: string;
    slots: TimeSlot[];
  };