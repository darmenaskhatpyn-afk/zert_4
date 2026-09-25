import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Clock, 
  Footprints, 
  TrendingUp, 
  Award, 
  Calendar, 
  CheckCircle2, 
  ChevronRight,
  ArrowUpRight,
  Info,
  X
} from 'lucide-react';
import { WeeklyDayData, UserProfile } from '../types/fitness';

interface WeeklySummaryDashboardProps {
  weeklyData: WeeklyDayData[];
  userProfile: UserProfile;
  onClose?: () => void;
  isModal?: boolean;
}

type MetricType = 'calories' | 'time' | 'steps';

export const WeeklySummaryDashboard: React.FC<WeeklySummaryDashboardProps> = ({
  weeklyData,
  userProfile,
  onClose,
  isModal = false
}) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('calories');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(weeklyData.length - 1); // default to today

  // Calculations across the 7 days
  const totalCalories = weeklyData.reduce((acc, d) => acc + d.caloriesBurned, 0);
  const avgCalories = Math.round(totalCalories / weeklyData.length);

  const totalMinutes = weeklyData.reduce((acc, d) => acc + d.workoutMinutes, 0);
  const avgMinutes = Math.round(totalMinutes / weeklyData.length);
  const totalHoursFormatted = `${Math.floor(totalMinutes / 60)} сағ ${totalMinutes % 60} мин`;

  const totalSteps = weeklyData.reduce((acc, d) => acc + d.steps, 0);
  const avgSteps = Math.round(totalSteps / weeklyData.length);

  // Targets
  const targetCaloriesDaily = 400;
  const targetMinutesDaily = 35;
  const targetStepsDaily = userProfile.dailyStepGoal || 10000;

  // Metric configurations
  const metricConfigs = {
    calories: {
      id: 'calories',
      label: 'Калория',
      unit: 'ккал',
      icon: Flame,
      color: '#F97316',
      accentBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      activeTabClass: 'bg-orange-500 text-slate-950 font-bold',
      gradientStart: '#FB923C',
      gradientEnd: '#EA580C',
      target: targetCaloriesDaily,
      totalFormatted: `${totalCalories.toLocaleString()} ккал`,
      avgFormatted: `${avgCalories} ккал/күн`,
      getValue: (d: WeeklyDayData) => d.caloriesBurned,
      percentOfGoal: Math.round((avgCalories / targetCaloriesDaily) * 100)
    },
    time: {
      id: 'time',
      label: 'Жаттығу уақыты',
      unit: 'мин',
      icon: Clock,
      color: '#38BDF8',
      accentBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      activeTabClass: 'bg-sky-500 text-slate-950 font-bold',
      gradientStart: '#38BDF8',
      gradientEnd: '#2563EB',
      target: targetMinutesDaily,
      totalFormatted: totalHoursFormatted,
      avgFormatted: `${avgMinutes} мин/күн`,
      getValue: (d: WeeklyDayData) => d.workoutMinutes,
      percentOfGoal: Math.round((avgMinutes / targetMinutesDaily) * 100)
    },
    steps: {
      id: 'steps',
      label: 'Қадам саны',
      unit: 'қадам',
      icon: Footprints,
      color: '#10B981',
      accentBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      activeTabClass: 'bg-emerald-500 text-slate-950 font-bold',
      gradientStart: '#34D399',
      gradientEnd: '#059669',
      target: targetStepsDaily,
      totalFormatted: totalSteps.toLocaleString(),
      avgFormatted: `${avgSteps.toLocaleString()} қадам/күн`,
      getValue: (d: WeeklyDayData) => d.steps,
      percentOfGoal: Math.round((avgSteps / targetStepsDaily) * 100)
    }
  };

  const currentCfg = metricConfigs[activeMetric];

  // Find max value in dataset to scale chart cleanly
  const currentValues = weeklyData.map(d => currentCfg.getValue(d));
  const maxValue = Math.max(...currentValues, currentCfg.target);
  const chartHeight = 150;
  const bestDayIdx = currentValues.indexOf(Math.max(...currentValues));

  const selectedDay = weeklyData[selectedDayIndex] || weeklyData[weeklyData.length - 1];

  return (
    <div className={`space-y-5 pb-6 ${isModal ? 'p-1' : ''}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Соңғы 7 күндік қорытынды есеп</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">
            Апталық прогресс
          </h1>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 3 Metric Selector Tabs (Zero-pill Segmented Control) */}
      <div className="p-1 bg-slate-900/90 border border-slate-800/80 rounded-2xl grid grid-cols-3 gap-1">
        <button
          onClick={() => setActiveMetric('calories')}
          className={`py-2 px-1 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeMetric === 'calories' ? metricConfigs.calories.activeTabClass : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span className="font-semibold">Калория</span>
        </button>

        <button
          onClick={() => setActiveMetric('time')}
          className={`py-2 px-1 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeMetric === 'time' ? metricConfigs.time.activeTabClass : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="font-semibold">Уақыт</span>
        </button>

        <button
          onClick={() => setActiveMetric('steps')}
          className={`py-2 px-1 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeMetric === 'steps' ? metricConfigs.steps.activeTabClass : 'text-slate-400 hover:text-white'
          }`}
        >
          <Footprints className="w-3.5 h-3.5" />
          <span className="font-semibold">Қадамдар</span>
        </button>
      </div>

      {/* Top 3 High-Impact KPI Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Calories Card */}
        <div 
          onClick={() => setActiveMetric('calories')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeMetric === 'calories' 
              ? 'bg-orange-950/20 border-orange-500/50 ring-1 ring-orange-500/20' 
              : 'bg-slate-900/70 border-slate-800/70 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-semibold uppercase">Калория</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-base font-bold font-display text-white font-tabular">
            {totalCalories.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-tabular">
            ~{avgCalories} ккал/күн
          </div>
        </div>

        {/* Workout Time Card */}
        <div 
          onClick={() => setActiveMetric('time')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeMetric === 'time' 
              ? 'bg-sky-950/20 border-sky-500/50 ring-1 ring-sky-500/20' 
              : 'bg-slate-900/70 border-slate-800/70 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-semibold uppercase">Жаттығу</span>
            <Clock className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-base font-bold font-display text-white font-tabular">
            {totalMinutes} мин
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-tabular">
            ~{avgMinutes} мин/күн
          </div>
        </div>

        {/* Steps Card */}
        <div 
          onClick={() => setActiveMetric('steps')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeMetric === 'steps' 
              ? 'bg-emerald-950/20 border-emerald-500/50 ring-1 ring-emerald-500/20' 
              : 'bg-slate-900/70 border-slate-800/70 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-semibold uppercase">Қадамдар</span>
            <Footprints className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-display text-white font-tabular">
            {Math.round(totalSteps / 1000)}k
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-tabular">
            ~{avgSteps.toLocaleString()} /күн
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 relative overflow-hidden">
        {/* Header inside Chart Card */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">7 күндік {currentCfg.label}:</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+14% өсім</span>
              </span>
            </div>
            <div className="text-2xl font-bold font-display text-white font-tabular mt-0.5">
              {currentCfg.totalFormatted}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Орташа</span>
            <span className="text-sm font-bold text-slate-200 font-tabular">{currentCfg.avgFormatted}</span>
          </div>
        </div>

        {/* SVG Bar Chart Visualization */}
        <div className="relative w-full select-none pt-4 pb-2">
          {/* Target Reference Line */}
          {currentCfg.target > 0 && (
            <div 
              className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
              style={{
                top: `${Math.max(10, Math.min(85, (1 - currentCfg.target / (maxValue * 1.15)) * 100))}%`
              }}
            >
              <div className="w-full border-t border-dashed border-slate-600/70" />
              <span className="text-[9px] font-medium text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded ml-1 whitespace-nowrap">
                Мақсат: {currentCfg.target.toLocaleString()}
              </span>
            </div>
          )}

          {/* Bar Columns Container */}
          <div className="grid grid-cols-7 gap-2 items-end h-44 relative">
            {weeklyData.map((day, idx) => {
              const val = currentCfg.getValue(day);
              const heightPercent = Math.max(12, Math.round((val / (maxValue * 1.15)) * 100));
              const isSelected = selectedDayIndex === idx;
              const isBest = bestDayIdx === idx;

              return (
                <div
                  key={day.date}
                  onClick={() => setSelectedDayIndex(idx)}
                  className="flex flex-col items-center justify-end h-full group cursor-pointer"
                >
                  {/* Tooltip badge above best day */}
                  {isBest && (
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded-full mb-1">
                      ★ Топ
                    </span>
                  )}

                  {/* Value label on hover/select */}
                  <span className={`text-[10px] font-tabular transition-opacity mb-1 ${
                    isSelected ? 'opacity-100 font-bold text-white' : 'opacity-0 group-hover:opacity-100 text-slate-400'
                  }`}>
                    {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                  </span>

                  {/* The Bar */}
                  <div className="w-full max-w-[28px] h-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className={`w-full rounded-t-xl transition-all duration-200 relative ${
                        isSelected 
                          ? 'ring-2 ring-white shadow-lg' 
                          : 'opacity-85 hover:opacity-100'
                      }`}
                      style={{
                        background: isSelected 
                          ? `linear-gradient(180deg, ${currentCfg.gradientStart}, ${currentCfg.gradientEnd})`
                          : isBest
                            ? `linear-gradient(180deg, ${currentCfg.gradientStart}, ${currentCfg.gradientEnd})`
                            : `linear-gradient(180deg, ${currentCfg.gradientStart}99, ${currentCfg.gradientEnd}66)`
                      }}
                    />
                  </div>

                  {/* Day Label */}
                  <div className="mt-2 text-center">
                    <span className={`text-[11px] font-semibold block transition-colors ${
                      isSelected 
                        ? 'text-white font-bold' 
                        : day.isToday 
                          ? 'text-emerald-400' 
                          : 'text-slate-400'
                    }`}>
                      {day.dayShortKz}
                    </span>
                    <span className="text-[9px] text-slate-500 block font-tabular">
                      {day.date.slice(8)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector Box */}
        {selectedDay && (
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedDay.dayFullKz}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-tabular">
                <span>🔥 {selectedDay.caloriesBurned} ккал</span>
                <span>·</span>
                <span>⏱️ {selectedDay.workoutMinutes} мин</span>
                <span>·</span>
                <span>👟 {selectedDay.steps.toLocaleString()} қадам</span>
              </div>
            </div>

            <div className="text-right">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                Орындалды
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 7-Day Detailed Breakdown Table/List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-display text-white">
            Күндер бойынша толық көрсеткіштер
          </h3>
          <span className="text-[11px] text-slate-500">7 күн тарихы</span>
        </div>

        <div className="space-y-2">
          {weeklyData.slice().reverse().map((day, i) => {
            const meetsCalorieGoal = day.caloriesBurned >= targetCaloriesDaily;
            const meetsStepGoal = day.steps >= targetStepsDaily;

            return (
              <div
                key={day.date}
                onClick={() => {
                  const originalIndex = weeklyData.findIndex(d => d.date === day.date);
                  if (originalIndex !== -1) setSelectedDayIndex(originalIndex);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedDay.date === day.date
                    ? 'bg-slate-900 border-emerald-500/40'
                    : 'bg-slate-900/60 border-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    day.isToday 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {day.dayShortKz}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      {day.dayFullKz}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{day.workoutsCompleted} жаттығу</span>
                      <span>·</span>
                      <span>{day.waterMl} мл су</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-xs font-bold text-white font-tabular block">
                      {day.caloriesBurned} ккал
                    </span>
                    <span className="text-[10px] text-slate-400 font-tabular block">
                      {day.steps.toLocaleString()} қадам · {day.workoutMinutes} мин
                    </span>
                  </div>

                  {meetsCalorieGoal && meetsStepGoal ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly AI-like Coach Insight Card in Kazakh */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/30 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <Award className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-white">Бапкер қорытындысы мен кеңесі</h4>
          <p className="text-slate-300 leading-relaxed">
            Сіз 7 күн ішінде жалпы <span className="font-bold text-emerald-400">{totalCalories.toLocaleString()} ккал</span> жағып, <span className="font-bold text-sky-400">{totalHoursFormatted}</span> белсенді жаттығу жасадыңыз. Ең қарқынды күн — Сәрсенбі (520 ккал, 12,640 қадам). Апталық ырғақты сақтап қалғаныңыз жақсы нәтиже!
          </p>
        </div>
      </div>
    </div>
  );
};
