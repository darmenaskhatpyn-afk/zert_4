import { HydrationSlot, HydrationSettings } from '../types/fitness';

export const DEFAULT_HYDRATION_SETTINGS: HydrationSettings = {
  remindersEnabled: true,
  intervalHours: 2,
  wakeUpTime: '08:00',
  sleepTime: '22:00',
  soundEnabled: true
};

const DEFAULT_SLOT_DESCRIPTIONS = [
  { time: '08:30', labelKz: 'Таңғы ояну сергітуі' },
  { time: '10:30', labelKz: 'Түске дейінгі сергектік' },
  { time: '12:30', labelKz: 'Түскі ас алдындағы су' },
  { time: '14:30', labelKz: 'Күндізгі жұмыс қуаты' },
  { time: '16:30', labelKz: 'Жаттығу алдындағы су' },
  { time: '18:30', labelKz: 'Кешкі серпіліс' },
  { time: '20:30', labelKz: 'Ұйқы алдындағы баланс' }
];

export function generateDailyHydrationSlots(goalMl: number): HydrationSlot[] {
  const slotCount = DEFAULT_SLOT_DESCRIPTIONS.length;
  // Distribute water evenly, rounded to nearest 50ml
  const approxPerSlot = Math.round(goalMl / slotCount / 50) * 50;

  return DEFAULT_SLOT_DESCRIPTIONS.map((s, idx) => {
    // Slightly adjust last slot if needed
    const recommended = idx === slotCount - 1 ? Math.max(150, approxPerSlot - 50) : approxPerSlot;
    return {
      id: `slot_${idx}_${s.time.replace(':', '')}`,
      time: s.time,
      labelKz: s.labelKz,
      recommendedMl: recommended,
      completed: false
    };
  });
}

// Find the active or next reminder slot for the current time
export function findCurrentReminderSlot(slots: HydrationSlot[]): HydrationSlot | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find first uncompleted slot that is around now or passed
  for (const slot of slots) {
    const [h, m] = slot.time.split(':').map(Number);
    const slotMinutes = h * 60 + m;

    if (!slot.completed) {
      // If within 90 minutes of slot time or already passed today, it's due
      if (currentMinutes >= slotMinutes - 30) {
        return slot;
      }
    }
  }

  // If all due are completed, return first incomplete slot
  return slots.find(s => !s.completed) || null;
}
