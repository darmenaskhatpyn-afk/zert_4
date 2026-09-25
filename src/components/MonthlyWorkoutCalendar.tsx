import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  Flame, 
  Clock, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { DailyLog } from '../types/fitness';

interface CompletedDayWorkout {
  titleKz: string;
  durationMinutes: number;
  caloriesBurned: number;
}

interface MonthlyWorkoutCalendarProps {
  dailyLog: DailyLog;
}

export const MonthlyWorkoutCalendar: React.FC<MonthlyWorkoutCalendarProps> = ({ dailyLog }) => {
  // Current displayed month/year state
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 8, 25)); // Sept 2026
  const [selectedDayNum, setSelectedDayNum] = useState<number>(25);

  const monthsKz = [
    'Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым',
    'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'
  ];

  const weekDayHeaders = ['Дүй', 'Сей', 'Сәр', 'Бей', 'Жұм', 'Сен', 'Жек'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (8 = September)

  // Initial persistent sample workout history for September 2026
  const historyMap: Record<string, CompletedDayWorkout[]> = {
    '2026-09-02': [{ titleKz: 'Таңғы қуат пен сергектік', durationMinutes: 10, caloriesBurned: 95 }],
    '2026-09-04': [{ titleKz: 'Толық дене күші мен тонусы', durationMinutes: 22, caloriesBurned: 185 }],
    '2026-09-07': [{ titleKz: 'Тас баған баспасөз (Пресс)', durationMinutes: 14, caloriesBurned: 120 }],
    '2026-09-09': [{ titleKz: 'Сымбатты аяқ және бөксе', durationMinutes: 16, caloriesBurned: 150 }],
    '2026-09-11': [{ titleKz: 'Толық дене күші мен тонусы', durationMinutes: 22, caloriesBurned: 185 }],
    '2026-09-14': [{ titleKz: 'Жоғары қарқынды HIIT май жағу', durationMinutes: 18, caloriesBurned: 240 }],
    '2026-09-16': [{ titleKz: 'Таңғы қуат пен сергектік', durationMinutes: 10, caloriesBurned: 95 }],
    '2026-09-18': [{ titleKz: 'Толық дене күші мен тонусы', durationMinutes: 22, caloriesBurned: 185 }],
    '2026-09-19': [{ titleKz: 'Толық дене күші мен тонусы', durationMinutes: 22, caloriesBurned: 185 }],
    '2026-09-20': [{ titleKz: 'Кешкі релакс және созылу', durationMinutes: 12, caloriesBurned: 55 }],
    '2026-09-21': [
      { titleKz: 'Таңғы қуат пен сергектік', durationMinutes: 10, caloriesBurned: 95 },
      { titleKz: 'Жоғары қарқынды HIIT май жағу', durationMinutes: 18, caloriesBurned: 240 }
    ],
    '2026-09-22': [{ titleKz: 'Тас баған баспасөз (Пресс)', durationMinutes: 14, caloriesBurned: 120 }],
    '2026-09-23': [
      { titleKz: 'Сымбатты аяқ және бөксе', durationMinutes: 16, caloriesBurned: 150 },
      { titleKz: 'Толық дене күші мен тонусы', durationMinutes: 22, caloriesBurned: 185 }
    ],
    '2026-09-24': [{ titleKz: 'Толық дене күші мен тонусы', durationMinutes: 22, caloriesBurned: 185 }],
    // Today dynamically includes dailyLog.completedWorkouts
    '2026-09-25': dailyLog.completedWorkouts.map(w => ({
      titleKz: w.workoutTitleKz,
      durationMinutes: w.durationMinutes,
      caloriesBurned: w.caloriesBurned
    }))
  };

  // Helper to format date string YYYY-MM-DD
  const formatDateStr = (y: number, m: number, d: number) => {
    const mm = (m + 1).toString().padStart(2, '0');
    const dd = d.toString().padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Month calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  // Convert so Monday is 0, Sunday is 6
  const startOffset = (firstDayOfWeek + 6) % 7;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayNum(1);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayNum(1);
  };

  // Count days with at least one workout in the current month
  let activeDaysInCurrentMonth = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const key = formatDateStr(year, month, d);
    if (historyMap[key] && historyMap[key].length > 0) {
      activeDaysInCurrentMonth++;
    }
  }

  // Selected date details
  const selectedDateKey = formatDateStr(year, month, selectedDayNum);
  const selectedDayWorkouts = historyMap[selectedDateKey] || [];
  const isSelectedToday = year === 2026 && month === 8 && selectedDayNum === 25;

  return (
    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 space-y-4">
      {/* Calendar Header with Month and Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold font-display text-white">
              Айлық жаттығу күнтізбесі
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Жаттығу орындалған күндер жасыл нүктемен белгіленеді
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={prevMonth}
            className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all"
            aria-label="Алдыңғы ай"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-white px-2 whitespace-nowrap font-display">
            {monthsKz[month]} {year}
          </span>

          <button
            onClick={nextMonth}
            className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all"
            aria-label="Келесі ай"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Month Stats Pill */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">
            Орындалған жаттығулар: <strong className="text-emerald-400 font-tabular">{activeDaysInCurrentMonth} күн</strong>
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          Тәртіп деңгейі: <strong className="text-white font-tabular">{Math.round((activeDaysInCurrentMonth / daysInMonth) * 100)}%</strong>
        </span>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDayHeaders.map((dayName, idx) => (
          <span 
            key={idx} 
            className={`text-[11px] font-semibold py-1 ${
              idx >= 5 ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            {dayName}
          </span>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Leading Empty Pad Days */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`pad-${i}`} className="h-11 rounded-2xl opacity-0 pointer-events-none" />
        ))}

        {/* Days of Month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateKey = formatDateStr(year, month, dayNum);
          const dayWorkouts = historyMap[dateKey] || [];
          const hasWorkout = dayWorkouts.length > 0;
          const isToday = year === 2026 && month === 8 && dayNum === 25;
          const isSelected = selectedDayNum === dayNum;

          return (
            <button
              key={dayNum}
              onClick={() => setSelectedDayNum(dayNum)}
              className={`h-11 rounded-2xl flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                isSelected
                  ? 'bg-slate-800 border-2 border-emerald-500 text-white shadow-md'
                  : isToday
                    ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-300'
                    : hasWorkout
                      ? 'bg-slate-950/70 border border-slate-800 text-slate-200 hover:border-slate-700'
                      : 'bg-slate-950/30 border border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {/* Day Number */}
              <span className={`text-xs font-bold font-tabular leading-none ${
                isSelected ? 'text-white' : isToday ? 'text-emerald-300' : ''
              }`}>
                {dayNum}
              </span>

              {/* Activity Dot(s) */}
              <div className="h-2 flex items-center justify-center gap-0.5 mt-1">
                {hasWorkout && (
                  <span 
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                    title={`${dayWorkouts.length} жаттығу орындалды`}
                  />
                )}
                {dayWorkouts.length > 1 && (
                  <span 
                    className="w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                    title={`${dayWorkouts.length} жаттығу орындалды`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Inspector Card */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span>{selectedDayNum} {monthsKz[month]} {year}</span>
              {isSelectedToday && (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                  Бүгін
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-400 font-medium">
              {selectedDayWorkouts.length > 0 
                ? `${selectedDayWorkouts.length} жаттығу орындалды` 
                : 'Демалыс күні'}
            </span>
          </div>

          {selectedDayWorkouts.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              {selectedDayWorkouts.map((w, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 text-xs">{w.titleKz}</h4>
                      <span className="text-[10px] text-slate-400 font-tabular">
                        {w.durationMinutes} мин · {w.caloriesBurned} ккал
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 font-tabular">
                    +{w.caloriesBurned} ккал
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-1">
              Бұл күні жаттығу тіркелмеген. Дене белсенділіктен кейін тынығады.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
