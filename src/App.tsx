/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Dumbbell, 
  BookOpen, 
  UtensilsCrossed, 
  User, 
  Smartphone, 
  Monitor,
  Flame,
  BarChart3,
  Droplet,
  Bell,
  Watch,
  MessageSquare,
  Shield,
  Network
} from 'lucide-react';

import { Workout, DailyLog, UserProfile, WeightHistoryPoint, LoggedMeal, WeeklyDayData, HydrationSlot, HydrationSettings } from './types/fitness';
import { INITIAL_WORKOUTS } from './data/workouts';
import { INITIAL_WEEKLY_DATA } from './data/mockWeeklyData';
import { workoutAudio } from './utils/audio';
import { generateDailyHydrationSlots, findCurrentReminderSlot, DEFAULT_HYDRATION_SETTINGS } from './utils/hydration';
import { evaluateDailyActivityGoal, sendBrowserPushNotification, STORAGE_KEYS_NOTIFICATIONS, ActivityGoalCheckResult } from './utils/notifications';

import { HomeTab } from './components/HomeTab';
import { WorkoutsTab } from './components/WorkoutsTab';
import { ExercisesTab } from './components/ExercisesTab';
import { NutritionTab } from './components/NutritionTab';
import { ProfileProgressTab } from './components/ProfileProgressTab';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { WeeklySummaryDashboard } from './components/WeeklySummaryDashboard';
import { HydrationToast } from './components/HydrationToast';
import { HydrationModal } from './components/HydrationModal';
import { SixPmGoalAlert } from './components/SixPmGoalAlert';
import { CoachChatModal } from './components/CoachChatModal';
import { SmartwatchSyncModal } from './components/SmartwatchSyncModal';
import { AdminConsoleModal } from './components/AdminConsoleModal';
import { UmlUseCaseViewerModal } from './components/UmlUseCaseViewerModal';

type ActiveTab = 'home' | 'workouts' | 'exercises' | 'nutrition' | 'profile';

const STORAGE_KEYS = {
  PROFILE: 'shynyq_profile_v1',
  LOG: 'shynyq_daily_log_v1',
  WORKOUTS: 'shynyq_workouts_v1',
  WEIGHT_HISTORY: 'shynyq_weight_history_v1',
  WEEKLY_DATA: 'shynyq_weekly_data_v1',
  HYDRATION_SLOTS: 'shynyq_hydration_slots_v1',
  HYDRATION_SETTINGS: 'shynyq_hydration_settings_v1'
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Дәрмен',
  gender: 'male',
  age: 25,
  heightCm: 178,
  weightKg: 74.0,
  targetWeightKg: 70.0,
  dailyStepGoal: 10000,
  dailyWaterGoalMl: 2500,
  dailyCalorieGoal: 2100,
  goal: 'tonus',
  soundEnabled: true
};

const DEFAULT_WEIGHT_HISTORY: WeightHistoryPoint[] = [
  { date: '01 Қыр', weightKg: 77.2 },
  { date: '08 Қыр', weightKg: 76.5 },
  { date: '15 Қыр', weightKg: 75.3 },
  { date: '22 Қыр', weightKg: 74.5 },
  { date: '25 Қыр', weightKg: 74.0 }
];

const DEFAULT_DAILY_LOG: DailyLog = {
  date: '2026-09-25',
  steps: 6420,
  waterMl: 1500,
  completedWorkouts: [
    {
      workoutId: 'w_morning_boost',
      workoutTitleKz: 'Таңғы қуат пен сергектік',
      durationMinutes: 10,
      caloriesBurned: 95,
      completedAt: '08:30'
    }
  ],
  meals: [
    {
      id: 'meal_1',
      foodId: 'f_oatmeal',
      nameKz: 'Сұлы жармасы (Овсянка)',
      mealType: 'Таңғы ас',
      amount: 150,
      calories: 180,
      protein: 6.8,
      fat: 3.8,
      carbs: 30.0,
      timestamp: '08:45'
    },
    {
      id: 'meal_2',
      foodId: 'f_egg',
      nameKz: 'Тауық жұмыртқасы (Піскен)',
      mealType: 'Таңғы ас',
      amount: 100,
      calories: 144,
      protein: 12.6,
      fat: 9.6,
      carbs: 0.8,
      timestamp: '08:50'
    }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [isMobileFrameMode, setIsMobileFrameMode] = useState(false);
  const [showWeeklySummaryModal, setShowWeeklySummaryModal] = useState(false);

  // Lab #4 Actors & Use Cases Modals
  const [showCoachChatModal, setShowCoachChatModal] = useState(false);
  const [showSmartwatchSyncModal, setShowSmartwatchSyncModal] = useState(false);
  const [showAdminConsoleModal, setShowAdminConsoleModal] = useState(false);
  const [showUmlModal, setShowUmlModal] = useState(false);

  // Persistent States
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [dailyLog, setDailyLog] = useState<DailyLog>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOG);
      return saved ? JSON.parse(saved) : DEFAULT_DAILY_LOG;
    } catch {
      return DEFAULT_DAILY_LOG;
    }
  });

  const [weeklyData, setWeeklyData] = useState<WeeklyDayData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEEKLY_DATA);
      return saved ? JSON.parse(saved) : INITIAL_WEEKLY_DATA;
    } catch {
      return INITIAL_WEEKLY_DATA;
    }
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
    } catch {
      return INITIAL_WORKOUTS;
    }
  });

  const [weightHistory, setWeightHistory] = useState<WeightHistoryPoint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEIGHT_HISTORY);
      return saved ? JSON.parse(saved) : DEFAULT_WEIGHT_HISTORY;
    } catch {
      return DEFAULT_WEIGHT_HISTORY;
    }
  });

  // Hydration Tracking States
  const [hydrationSettings, setHydrationSettings] = useState<HydrationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HYDRATION_SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_HYDRATION_SETTINGS;
    } catch {
      return DEFAULT_HYDRATION_SETTINGS;
    }
  });

  const [hydrationSlots, setHydrationSlots] = useState<HydrationSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HYDRATION_SLOTS);
      if (saved) return JSON.parse(saved);
      return generateDailyHydrationSlots(DEFAULT_PROFILE.dailyWaterGoalMl);
    } catch {
      return generateDailyHydrationSlots(DEFAULT_PROFILE.dailyWaterGoalMl);
    }
  });

  const [showHydrationModal, setShowHydrationModal] = useState(false);
  const [showHydrationToast, setShowHydrationToast] = useState(true);
  const [currentReminderSlot, setCurrentReminderSlot] = useState<HydrationSlot | null>(() => {
    return findCurrentReminderSlot(generateDailyHydrationSlots(DEFAULT_PROFILE.dailyWaterGoalMl));
  });

  // 6 PM (18:00) Daily Activity Goal Alert State
  const [sixPmAlertEnabled, setSixPmAlertEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('shynyq_six_pm_enabled_v1');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [showSixPmAlert, setShowSixPmAlert] = useState(false);
  const [isSixPmTestMode, setIsSixPmTestMode] = useState(false);
  const [sixPmGoalStatus, setSixPmGoalStatus] = useState<ActivityGoalCheckResult>(() => {
    return evaluateDailyActivityGoal(dailyLog, userProfile);
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('shynyq_six_pm_enabled_v1', JSON.stringify(sixPmAlertEnabled));
    } catch {}
  }, [sixPmAlertEnabled]);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOG, JSON.stringify(dailyLog));
    } catch {}
  }, [dailyLog]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEEKLY_DATA, JSON.stringify(weeklyData));
    } catch {}
  }, [weeklyData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HYDRATION_SLOTS, JSON.stringify(hydrationSlots));
    } catch {}
  }, [hydrationSlots]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HYDRATION_SETTINGS, JSON.stringify(hydrationSettings));
    } catch {}
  }, [hydrationSettings]);

  // Adjust slots when daily water goal changes
  useEffect(() => {
    setHydrationSlots(prev => {
      const newSlots = generateDailyHydrationSlots(userProfile.dailyWaterGoalMl);
      // preserve completed status
      return newSlots.map(ns => {
        const existing = prev.find(p => p.time === ns.time);
        return existing ? { ...ns, completed: existing.completed, completedAt: existing.completedAt } : ns;
      });
    });
  }, [userProfile.dailyWaterGoalMl]);

  // Check for due hydration reminders periodically
  useEffect(() => {
    if (!hydrationSettings.remindersEnabled) return;

    const checkHydration = () => {
      const dueSlot = findCurrentReminderSlot(hydrationSlots);
      if (dueSlot) {
        setCurrentReminderSlot(dueSlot);
      }
    };

    checkHydration();
    const interval = setInterval(checkHydration, 30000);
    return () => clearInterval(interval);
  }, [hydrationSlots, hydrationSettings.remindersEnabled]);

  // Check 6 PM (18:00) Daily Activity Goal status periodically
  useEffect(() => {
    if (!sixPmAlertEnabled) return;

    const checkSixPmGoal = () => {
      const evalResult = evaluateDailyActivityGoal(dailyLog, userProfile);
      setSixPmGoalStatus(evalResult);

      const todayStr = new Date().toISOString().split('T')[0];
      const lastDismissed = localStorage.getItem(STORAGE_KEYS_NOTIFICATIONS.LAST_DISMISSED_DATE);

      // If it's 6 PM or later, goals not met, and not dismissed today:
      if (evalResult.shouldAlert && evalResult.isPastSixPm && lastDismissed !== todayStr) {
        sendBrowserPushNotification('Shynyq: Сағат 18:00 мақсат ескертпесі! ⏰', {
          body: evalResult.missingTextKz
        });
        setIsSixPmTestMode(false);
        setShowSixPmAlert(true);
      }
    };

    checkSixPmGoal();
    const interval = setInterval(checkSixPmGoal, 30000);
    return () => clearInterval(interval);
  }, [dailyLog, userProfile, sixPmAlertEnabled]);

  // Dynamically update today's stats in weeklyData
  useEffect(() => {
    setWeeklyData(prev => {
      const totalTodayCal = dailyLog.completedWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
      const totalTodayTime = dailyLog.completedWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0);
      const todayIndex = prev.findIndex(d => d.isToday || d.date === '2026-09-25');
      if (todayIndex !== -1) {
        const updated = [...prev];
        updated[todayIndex] = {
          ...updated[todayIndex],
          caloriesBurned: Math.max(updated[todayIndex].caloriesBurned, totalTodayCal),
          workoutMinutes: Math.max(updated[todayIndex].workoutMinutes, totalTodayTime),
          steps: Math.max(updated[todayIndex].steps, dailyLog.steps),
          waterMl: Math.max(updated[todayIndex].waterMl, dailyLog.waterMl),
          workoutsCompleted: Math.max(updated[todayIndex].workoutsCompleted, dailyLog.completedWorkouts.length)
        };
        return updated;
      }
      return prev;
    });
  }, [dailyLog]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    } catch {}
  }, [workouts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEIGHT_HISTORY, JSON.stringify(weightHistory));
    } catch {}
  }, [weightHistory]);

  useEffect(() => {
    workoutAudio.enabled = userProfile.soundEnabled;
  }, [userProfile.soundEnabled]);

  // Actions
  const handleAddWater = (amountMl: number) => {
    workoutAudio.playWaterTap();
    setDailyLog(prev => ({
      ...prev,
      waterMl: prev.waterMl + amountMl
    }));
  };

  const handleLogWaterFromToast = (amountMl: number, slotId?: string) => {
    handleAddWater(amountMl);
    if (slotId) {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setHydrationSlots(prev => prev.map(s => s.id === slotId ? { ...s, completed: true, completedAt: timeStr } : s));
    }
    setShowHydrationToast(false);
  };

  const handleToggleHydrationSlot = (slotId: string) => {
    const targetSlot = hydrationSlots.find(s => s.id === slotId);
    if (!targetSlot) return;

    if (!targetSlot.completed) {
      handleAddWater(targetSlot.recommendedMl);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setHydrationSlots(prev => prev.map(s => s.id === slotId ? { ...s, completed: true, completedAt: timeStr } : s));
    } else {
      setHydrationSlots(prev => prev.map(s => s.id === slotId ? { ...s, completed: false, completedAt: undefined } : s));
    }
  };

  const handleSnoozeHydration = () => {
    setShowHydrationToast(false);
  };

  const handleTriggerTestReminder = () => {
    const slot = currentReminderSlot || hydrationSlots[0];
    setCurrentReminderSlot(slot);
    setShowHydrationToast(true);
    workoutAudio.playWaterTap();
  };

  const handleTriggerSixPmTestAlert = () => {
    const evalResult = evaluateDailyActivityGoal(dailyLog, userProfile, true);
    setSixPmGoalStatus(evalResult);
    setIsSixPmTestMode(true);
    setShowSixPmAlert(true);
    sendBrowserPushNotification('Shynyq: Сағат 18:00 мақсат ескертпесі (Тест)! ⏰', {
      body: evalResult.missingTextKz
    });
  };

  const handleDismissSixPmAlert = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      localStorage.setItem(STORAGE_KEYS_NOTIFICATIONS.LAST_DISMISSED_DATE, todayStr);
    } catch {}
    setShowSixPmAlert(false);
  };

  const handleSmartwatchSync = (syncedSteps: number, syncedCalories: number) => {
    setDailyLog(prev => ({
      ...prev,
      steps: Math.max(prev.steps, syncedSteps)
    }));
  };

  const handleAddSteps = (stepsToAdd: number) => {
    setDailyLog(prev => ({
      ...prev,
      steps: prev.steps + stepsToAdd
    }));
  };

  const handleWorkoutComplete = (stats: { workoutId: string; titleKz: string; durationMinutes: number; caloriesBurned: number }) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setDailyLog(prev => ({
      ...prev,
      completedWorkouts: [
        {
          workoutId: stats.workoutId,
          workoutTitleKz: stats.titleKz,
          durationMinutes: stats.durationMinutes,
          caloriesBurned: stats.caloriesBurned,
          completedAt: timeStr
        },
        ...prev.completedWorkouts
      ]
    }));
  };

  const handleAddCustomWorkout = (newWorkout: Workout) => {
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  const handleAddMeal = (mealData: Omit<LoggedMeal, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMeal: LoggedMeal = {
      ...mealData,
      id: `meal_${Date.now()}`,
      timestamp: timeStr
    };

    setDailyLog(prev => ({
      ...prev,
      meals: [newMeal, ...prev.meals]
    }));
  };

  const handleDeleteMeal = (mealId: string) => {
    setDailyLog(prev => ({
      ...prev,
      meals: prev.meals.filter(m => m.id !== mealId)
    }));
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
  };

  const handleAddWeightPoint = (newWeight: number) => {
    const months = ['Қаң', 'Ақп', 'Нау', 'Сәу', 'Мам', 'Мау', 'Шіл', 'Там', 'Қыр', 'Қаз', 'Қар', 'Жел'];
    const now = new Date();
    const dateStr = `${now.getDate()} ${months[now.getMonth()]}`;

    setUserProfile(prev => ({ ...prev, weightKg: newWeight }));
    setWeightHistory(prev => [
      ...prev,
      { date: dateStr, weightKg: newWeight }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start antialiased font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Outer Shell for Mobile Frame vs Responsive Mode */}
      <div 
        className={`w-full flex flex-col justify-between transition-all duration-300 ${
          isMobileFrameMode 
            ? 'max-w-[430px] my-4 min-h-[92vh] max-h-[92vh] rounded-[48px] border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden relative' 
            : 'max-w-lg min-h-screen relative'
        }`}
      >
        {/* Dynamic Notch / Status indicator on mobile frame */}
        {isMobileFrameMode && (
          <div className="w-full h-8 bg-slate-950 flex items-center justify-between px-7 shrink-0 z-40 select-none">
            <span className="text-[12px] font-bold text-slate-400 font-tabular">09:41</span>
            <div className="w-24 h-4 bg-slate-900 rounded-full" />
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
              <span>5G</span>
              <div className="w-4 h-2 rounded-sm border border-slate-400 p-0.5">
                <div className="h-full w-2.5 bg-emerald-400 rounded-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Top App Bar (Pattern 2: Mobile Top Bar Contract) */}
        <header className="sticky top-0 z-30 h-14 bg-slate-950/85 backdrop-blur-md border-b border-slate-900/90 px-4 flex items-center justify-between shrink-0">
          {/* Brand Wordmark (Display Font, single element) */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Flame className="w-4 h-4 text-slate-950 fill-slate-950" />
            </div>
            <span className="font-display font-black text-lg tracking-tight text-white">
              Shynyq
            </span>
          </div>

          {/* Desktop Frame / Responsive Toggle & Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowUmlModal(true)}
              className="px-2 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-[11px] font-bold text-emerald-400 flex items-center gap-1 transition-colors border border-emerald-500/30 active:scale-95"
              title="№4 Зертханалық: UML Use Case диаграммасы (Вариант №7)"
            >
              <Network className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xs:inline">UML №4</span>
            </button>

            <button
              onClick={() => setShowSmartwatchSyncModal(true)}
              className="px-2 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-[11px] font-semibold text-cyan-400 flex items-center gap-1 transition-colors border border-cyan-500/30 active:scale-95"
              title="Смарт-сағат синхрондау (Apple Health / Google Fit)"
            >
              <Watch className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Сағат</span>
            </button>

            <button
              onClick={() => setShowCoachChatModal(true)}
              className="px-2 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-[11px] font-semibold text-amber-400 flex items-center gap-1 transition-colors border border-amber-500/30 active:scale-95"
              title="Жаттықтырушымен онлайн чат"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Чат</span>
            </button>

            <button
              onClick={() => setShowWeeklySummaryModal(true)}
              className="px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-medium text-emerald-400 flex items-center gap-1 transition-colors border border-slate-800/80 active:scale-95"
              title="7 күндік апталық қорытынды есеп"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">7 күндік</span>
            </button>

            <button
              onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
              className="px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-medium text-slate-300 flex items-center gap-1 transition-colors border border-slate-800/80 active:scale-95"
              title={isMobileFrameMode ? "Толық экранға ауысу" : "Смартфон үлгісінде көру"}
            >
              {isMobileFrameMode ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Толық</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Мобильді</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Viewport Content */}
        <main className={`flex-1 px-4 pt-4 pb-24 overflow-y-auto no-scrollbar ${isMobileFrameMode ? 'h-[calc(92vh-120px)]' : ''}`}>
          {activeTab === 'home' && (
            <HomeTab
              userProfile={userProfile}
              dailyLog={dailyLog}
              workouts={workouts}
              weeklyData={weeklyData}
              onStartWorkout={(w) => setActiveWorkout(w)}
              onAddWater={handleAddWater}
              onAddSteps={handleAddSteps}
              onOpenWorkoutsTab={() => setActiveTab('workouts')}
              onOpenWeeklySummary={() => setShowWeeklySummaryModal(true)}
              onOpenHydrationModal={() => setShowHydrationModal(true)}
              onUpdateGoal={(newGoal) => setUserProfile(prev => ({ ...prev, goal: newGoal }))}
              onOpenCoachChat={() => setShowCoachChatModal(true)}
              onOpenSmartwatchSync={() => setShowSmartwatchSyncModal(true)}
              onOpenAdminConsole={() => setShowAdminConsoleModal(true)}
              onOpenUmlModal={() => setShowUmlModal(true)}
            />
          )}

          {activeTab === 'workouts' && (
            <WorkoutsTab
              workouts={workouts}
              onStartWorkout={(w) => setActiveWorkout(w)}
              onAddCustomWorkout={handleAddCustomWorkout}
            />
          )}

          {activeTab === 'exercises' && (
            <ExercisesTab />
          )}

          {activeTab === 'nutrition' && (
            <NutritionTab
              userProfile={userProfile}
              loggedMeals={dailyLog.meals}
              onAddMeal={handleAddMeal}
              onDeleteMeal={handleDeleteMeal}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileProgressTab
              userProfile={userProfile}
              weightHistory={weightHistory}
              dailyLog={dailyLog}
              sixPmAlertEnabled={sixPmAlertEnabled}
              onUpdateProfile={handleUpdateProfile}
              onAddWeightPoint={handleAddWeightPoint}
              onOpenWeeklySummary={() => setShowWeeklySummaryModal(true)}
              onToggleSixPmAlert={setSixPmAlertEnabled}
              onTestSixPmAlert={handleTriggerSixPmTestAlert}
            />
          )}
        </main>

        {/* Fixed Ergonomic Bottom Tab Bar (Pattern 1: Navigation Anchor) */}
        <nav 
          className={`fixed bottom-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-900 pb-safe ${
            isMobileFrameMode ? 'absolute left-0 right-0 rounded-b-[40px]' : 'left-0 right-0 max-w-lg mx-auto'
          }`}
        >
          <div className="grid grid-cols-5 items-center h-16 px-1">
            {/* Tab 1: Басты бет */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] active:scale-95 transition-transform ${
                activeTab === 'home' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] font-medium tracking-tight mt-1">Басты</span>
            </button>

            {/* Tab 2: Жаттығулар */}
            <button
              onClick={() => setActiveTab('workouts')}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] active:scale-95 transition-transform ${
                activeTab === 'workouts' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Dumbbell className={`w-5 h-5 ${activeTab === 'workouts' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] font-medium tracking-tight mt-1">Жаттығу</span>
            </button>

            {/* Tab 3: База */}
            <button
              onClick={() => setActiveTab('exercises')}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] active:scale-95 transition-transform ${
                activeTab === 'exercises' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <BookOpen className={`w-5 h-5 ${activeTab === 'exercises' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] font-medium tracking-tight mt-1">База</span>
            </button>

            {/* Tab 4: Тамақтану */}
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] active:scale-95 transition-transform ${
                activeTab === 'nutrition' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <UtensilsCrossed className={`w-5 h-5 ${activeTab === 'nutrition' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] font-medium tracking-tight mt-1">Тамақтану</span>
            </button>

            {/* Tab 5: Профиль */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] active:scale-95 transition-transform ${
                activeTab === 'profile' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] font-medium tracking-tight mt-1">Профиль</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Full Screen Interactive Workout Player Modal */}
      {activeWorkout && (
        <WorkoutPlayer
          workout={activeWorkout}
          onClose={() => setActiveWorkout(null)}
          onComplete={(stats) => {
            handleWorkoutComplete(stats);
          }}
        />
      )}

      {/* 7-Day Weekly Summary Full Dashboard Sheet Modal */}
      <AnimatePresence>
        {showWeeklySummaryModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="bg-slate-950 border-t border-slate-800 rounded-t-[36px] w-full max-w-lg p-5 max-h-[92vh] overflow-y-auto no-scrollbar"
            >
              <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4" />
              <WeeklySummaryDashboard
                isModal
                weeklyData={weeklyData}
                userProfile={userProfile}
                onClose={() => setShowWeeklySummaryModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Hydration Reminder Toast (scheduled prompt based on daily goal) */}
      <HydrationToast
        isOpen={showHydrationToast}
        currentSlot={currentReminderSlot}
        currentWaterMl={dailyLog.waterMl}
        dailyGoalMl={userProfile.dailyWaterGoalMl}
        onLogWater={handleLogWaterFromToast}
        onSnooze={handleSnoozeHydration}
        onDismiss={() => setShowHydrationToast(false)}
        onOpenDetails={() => {
          setShowHydrationToast(false);
          setShowHydrationModal(true);
        }}
      />

      {/* Full Hydration Schedule & Management Modal */}
      <HydrationModal
        isOpen={showHydrationModal}
        slots={hydrationSlots}
        currentWaterMl={dailyLog.waterMl}
        userProfile={userProfile}
        settings={hydrationSettings}
        onClose={() => setShowHydrationModal(false)}
        onLogWater={handleAddWater}
        onToggleSlot={handleToggleHydrationSlot}
        onUpdateSettings={setHydrationSettings}
        onTriggerTestReminder={handleTriggerTestReminder}
      />

      {/* 6 PM (18:00) Daily Activity Goal Push Notification Alert */}
      <SixPmGoalAlert
        isOpen={showSixPmAlert}
        goalStatus={sixPmGoalStatus}
        recommendedWorkout={workouts[0]}
        isTestMode={isSixPmTestMode}
        onClose={handleDismissSixPmAlert}
        onStartWorkout={(workout) => {
          handleDismissSixPmAlert();
          setActiveWorkout(workout);
        }}
        onAddQuickSteps={(steps) => {
          handleAddSteps(steps);
          handleDismissSixPmAlert();
        }}
      />

      {/* Lab #4 Actor: Fitness Coach Online Chat & Custom Plan Modal */}
      <CoachChatModal
        isOpen={showCoachChatModal}
        onClose={() => setShowCoachChatModal(false)}
        workouts={workouts}
        onStartWorkout={(workout) => {
          setShowCoachChatModal(false);
          setActiveWorkout(workout);
        }}
      />

      {/* Lab #4 External System: Smartwatch / Apple Health / Google Fit Sync Modal (<<extend>>) */}
      <SmartwatchSyncModal
        isOpen={showSmartwatchSyncModal}
        onClose={() => setShowSmartwatchSyncModal(false)}
        currentSteps={dailyLog.steps}
        onSyncData={handleSmartwatchSync}
      />

      {/* Lab #4 Secondary Actor: System Admin Console Modal (Moderation & Weekly Reports) */}
      <AdminConsoleModal
        isOpen={showAdminConsoleModal}
        onClose={() => setShowAdminConsoleModal(false)}
      />

      {/* Lab #4 Interactive UML Use Case Diagram Architecture Viewer Modal */}
      <UmlUseCaseViewerModal
        isOpen={showUmlModal}
        onClose={() => setShowUmlModal(false)}
        onOpenCoachChat={() => setShowCoachChatModal(true)}
        onOpenSmartwatchSync={() => setShowSmartwatchSyncModal(true)}
        onOpenAdminConsole={() => setShowAdminConsoleModal(true)}
        onOpenWorkoutsCatalog={() => setActiveTab('workouts')}
        onOpenWeeklySummary={() => setShowWeeklySummaryModal(true)}
      />
    </div>
  );
}
