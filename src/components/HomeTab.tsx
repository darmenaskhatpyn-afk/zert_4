import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Footprints, 
  Droplet, 
  Clock, 
  Play, 
  ChevronRight, 
  Plus, 
  Trophy, 
  Sparkles,
  Calendar,
  Check,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Watch,
  Shield,
  Network
} from 'lucide-react';
import { Workout, DailyLog, UserProfile, WeeklyDayData } from '../types/fitness';
import { workoutAudio } from '../utils/audio';
import { RecommendedWorkouts } from './RecommendedWorkouts';

interface HomeTabProps {
  userProfile: UserProfile;
  dailyLog: DailyLog;
  workouts: Workout[];
  weeklyData: WeeklyDayData[];
  onStartWorkout: (workout: Workout) => void;
  onAddWater: (amountMl: number) => void;
  onAddSteps: (steps: number) => void;
  onOpenWorkoutsTab: () => void;
  onOpenWeeklySummary: () => void;
  onOpenHydrationModal: () => void;
  onUpdateGoal: (newGoal: UserProfile['goal']) => void;
  onOpenCoachChat: () => void;
  onOpenSmartwatchSync: () => void;
  onOpenAdminConsole: () => void;
  onOpenUmlModal: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  userProfile,
  dailyLog,
  workouts,
  weeklyData,
  onStartWorkout,
  onAddWater,
  onAddSteps,
  onOpenWorkoutsTab,
  onOpenWeeklySummary,
  onOpenHydrationModal,
  onUpdateGoal,
  onOpenCoachChat,
  onOpenSmartwatchSync,
  onOpenAdminConsole,
  onOpenUmlModal
}) => {
  const [miniMetric, setMiniMetric] = useState<'calories' | 'time' | 'steps'>('calories');

  const daysOfWeek = [
    { label: 'Дүй', day: 21, active: true },
    { label: 'Сей', day: 22, active: true },
    { label: 'Сәр', day: 23, active: true },
    { label: 'Бей', day: 24, active: true },
    { label: 'Жұм', day: 25, active: true, today: true },
    { label: 'Сен', day: 26, active: false },
    { label: 'Жек', day: 27, active: false }
  ];

  const totalCaloriesBurned = dailyLog.completedWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const totalMinutes = dailyLog.completedWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0);
  
  const stepPercent = Math.min(100, Math.round((dailyLog.steps / userProfile.dailyStepGoal) * 100));
  const waterPercent = Math.min(100, Math.round((dailyLog.waterMl / userProfile.dailyWaterGoalMl) * 100));
  const caloriePercent = Math.min(100, Math.round((totalCaloriesBurned / 400) * 100));

  const featuredWorkout = workouts[0] || null;

  // 7-day stats for preview
  const weeklyTotalCal = weeklyData.reduce((acc, d) => acc + d.caloriesBurned, 0);
  const weeklyTotalTime = weeklyData.reduce((acc, d) => acc + d.workoutMinutes, 0);
  const weeklyTotalSteps = weeklyData.reduce((acc, d) => acc + d.steps, 0);

  const maxValForMini = Math.max(...weeklyData.map(d => 
    miniMetric === 'calories' ? d.caloriesBurned : miniMetric === 'time' ? d.workoutMinutes : d.steps
  ));

  return (
    <div className="space-y-6 pb-6">
      {/* User Greeting & Date */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Дені саудың — жаны сау!</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight mt-0.5">
            Сәлем, {userProfile.name}! 👋
          </h1>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center font-bold text-emerald-400 text-sm">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Weekly Streak Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Апталық белсенділік</span>
          </span>
          <span className="text-emerald-400 font-medium">5 күн қатарынан 🔥</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {daysOfWeek.map((d, i) => (
            <div
              key={i}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-colors ${
                d.today 
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
                  : d.active 
                    ? 'bg-slate-800/60 text-slate-300' 
                    : 'bg-slate-950/40 text-slate-600'
              }`}
            >
              <span className="text-[10px] font-medium">{d.label}</span>
              <span className="text-xs font-bold font-tabular mt-1">{d.day}</span>
              <div className="mt-1.5">
                {d.active ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-800" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Weekly Progress Interactive Preview Card */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">7 күндік график</h3>
          </div>
          <button
            onClick={onOpenWeeklySummary}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 active:scale-95 transition-all"
          >
            <span>Толық есеп</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini metric pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 rounded-xl text-[11px]">
          <button
            onClick={() => setMiniMetric('calories')}
            className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
              miniMetric === 'calories' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Калория
          </button>
          <button
            onClick={() => setMiniMetric('time')}
            className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
              miniMetric === 'time' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Уақыт
          </button>
          <button
            onClick={() => setMiniMetric('steps')}
            className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
              miniMetric === 'steps' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Қадам
          </button>
        </div>

        {/* Mini 7-Day Bar Chart */}
        <div 
          onClick={onOpenWeeklySummary}
          className="grid grid-cols-7 gap-1.5 items-end h-20 pt-2 pb-1 cursor-pointer group"
          title="Толық апталық диаграмманы ашу үшін басыңыз"
        >
          {weeklyData.map((d, i) => {
            const val = miniMetric === 'calories' ? d.caloriesBurned : miniMetric === 'time' ? d.workoutMinutes : d.steps;
            const barH = Math.max(15, Math.round((val / (maxValForMini || 1)) * 100));

            return (
              <div key={i} className="flex flex-col items-center justify-end h-full">
                <div className="w-full h-full flex items-end justify-center">
                  <div
                    className={`w-3.5 rounded-t-md transition-all duration-300 group-hover:opacity-100 ${
                      d.isToday ? 'opacity-100 ring-1 ring-white/60' : 'opacity-75'
                    } ${
                      miniMetric === 'calories' ? 'bg-orange-500' : miniMetric === 'time' ? 'bg-sky-400' : 'bg-emerald-400'
                    }`}
                    style={{ height: `${barH}%` }}
                  />
                </div>
                <span className={`text-[9px] mt-1 font-semibold ${d.isToday ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {d.dayShortKz}
                </span>
              </div>
            );
          })}
        </div>

        {/* 7-Day Quick Total Line */}
        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/60 text-slate-400">
          <span>Апталық жиынтық:</span>
          <span className="font-bold text-white font-tabular">
            {miniMetric === 'calories' 
              ? `${weeklyTotalCal.toLocaleString()} ккал` 
              : miniMetric === 'time' 
                ? `${Math.floor(weeklyTotalTime / 60)} сағ ${weeklyTotalTime % 60} мин` 
                : `${weeklyTotalSteps.toLocaleString()} қадам`}
          </span>
        </div>
      </div>

      {/* Core Activity Dashboard Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {/* Steps Card */}
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
            <button
              onClick={() => onAddSteps(1000)}
              className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3 h-3" />
              <span>1000</span>
            </button>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-tabular text-white tracking-tight">
              {dailyLog.steps.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
              <span>Қадам саны</span>
              <span>{stepPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${stepPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Calories Card */}
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400">Мақсат: 400</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-tabular text-white tracking-tight">
              {totalCaloriesBurned}
              <span className="text-xs font-normal text-slate-400 ml-1">ккал</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
              <span>Жағылған энергия</span>
              <span>{caloriePercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${caloriePercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Water Balance Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-900/30">
        <div className="flex items-center justify-between mb-3">
          <div 
            onClick={onOpenHydrationModal}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Droplet className="w-4 h-4 fill-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                  Су балансы
                </h3>
                <span className="text-[10px] text-blue-400 font-medium bg-blue-500/10 px-1.5 py-0.2 rounded">
                  Кесте 💧
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {dailyLog.waterMl} мл / {userProfile.dailyWaterGoalMl} мл ({waterPercent}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onAddWater(250)}
              className="px-2.5 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Plus className="w-3 h-3" />
              <span>250 мл</span>
            </button>
            <button
              onClick={onOpenHydrationModal}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 active:scale-95 transition-transform"
              title="Толық кестені көру"
            >
              <span>Кесте</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div 
          onClick={onOpenHydrationModal}
          className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden cursor-pointer"
        >
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${waterPercent}%` }}
          />
        </div>
      </div>

      {/* UML Use Case Lab #4 Actors & Ecosystem Card Strip */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold font-display text-white">
              №4 Зертханалық: Жүйе акторлары мен функциялары
            </h2>
          </div>
          <button
            onClick={onOpenUmlModal}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 active:scale-95 transition-colors"
          >
            <span>UML Сызбасы</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Actor 1: Coach Chat */}
          <div
            onClick={onOpenCoachChat}
            className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 hover:border-amber-400/60 cursor-pointer transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                Жаттықтырушы
              </span>
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              Онлайн чат
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Айдос Нұрланұлымен байланыс
            </p>
          </div>

          {/* Actor 2: Smartwatch Sync */}
          <div
            onClick={onOpenSmartwatchSync}
            className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400/60 cursor-pointer transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Watch className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                &lt;&lt;extend&gt;&gt;
              </span>
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
              Смарт-сағат
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Apple Health / Google Fit синк
            </p>
          </div>

          {/* Actor 3: Admin Console */}
          <div
            onClick={onOpenAdminConsole}
            className="p-3.5 rounded-2xl bg-slate-900 border border-purple-500/30 hover:border-purple-400/60 cursor-pointer transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                Әкімшілік
              </span>
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
              Жүйелік Әкімші
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Модерация & Апталық есеп
            </p>
          </div>

          {/* Feature 4: Interactive UML Diagram */}
          <div
            onClick={onOpenUmlModal}
            className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-400/60 cursor-pointer transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Network className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Вариант №7
              </span>
            </div>
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
              UML Use Case
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              4 Актор, Include / Extend сызбасы
            </p>
          </div>
        </div>
      </div>

      {/* Recommended for You based on Goal & Activity Level */}
      <RecommendedWorkouts
        goal={userProfile.goal}
        completedTodayCount={dailyLog.completedWorkouts.length}
        caloriesBurnedToday={totalCaloriesBurned}
        workouts={workouts}
        onStartWorkout={onStartWorkout}
        onUpdateGoal={onUpdateGoal}
        onOpenWorkoutsTab={onOpenWorkoutsTab}
      />

      {/* Completed Workouts Log for Today */}
      {dailyLog.completedWorkouts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold font-display text-white">
            Бүгінгі орындалған жаттығулар
          </h2>

          <div className="space-y-2">
            {dailyLog.completedWorkouts.map((w, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{w.workoutTitleKz}</h4>
                    <span className="text-[10px] text-slate-400 font-tabular">{w.completedAt}</span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-bold text-emerald-400 font-tabular">+{w.caloriesBurned} ккал</span>
                  <p className="text-[10px] text-slate-400 font-tabular">{w.durationMinutes} мин</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Motivation Box */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/50 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white mb-0.5">Күн ұраны</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            «Жеңіс бір күнде келмейді, бірақ күн сайынғы жаттығу оны жақындатады!»
          </p>
        </div>
      </div>
    </div>
  );
};
