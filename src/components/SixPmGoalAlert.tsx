import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Clock, 
  Flame, 
  Footprints, 
  Dumbbell, 
  Play, 
  X, 
  CheckCircle2, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { ActivityGoalCheckResult, getNotificationStatus, requestNotificationPermission } from '../utils/notifications';
import { Workout } from '../types/fitness';
import { workoutAudio } from '../utils/audio';

interface SixPmGoalAlertProps {
  isOpen: boolean;
  goalStatus: ActivityGoalCheckResult;
  recommendedWorkout?: Workout;
  isTestMode?: boolean;
  onClose: () => void;
  onStartWorkout: (workout: Workout) => void;
  onAddQuickSteps: (steps: number) => void;
}

export const SixPmGoalAlert: React.FC<SixPmGoalAlertProps> = ({
  isOpen,
  goalStatus,
  recommendedWorkout,
  isTestMode = false,
  onClose,
  onStartWorkout,
  onAddQuickSteps
}) => {
  const [permissionState, setPermissionState] = React.useState(getNotificationStatus().permission);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionState(res);
    if (res === 'granted') {
      workoutAudio.playNotificationBell();
    }
  };

  const handleQuickSteps = () => {
    workoutAudio.playWaterTap();
    onAddQuickSteps(1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="bg-slate-950 border-t sm:border border-amber-500/40 rounded-t-[36px] sm:rounded-3xl w-full max-w-lg p-5 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.3)] max-h-[92vh] overflow-y-auto no-scrollbar relative"
        >
          {/* Subtle amber ambient glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Grab Handle on mobile */}
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center animate-pulse">
                <Bell className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Сағат 18:00 ескертпесі</span>
                  </span>
                  {isTestMode && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.2 rounded border border-amber-500/30">
                      Сынамалық режим
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold font-display text-white">
                  Күнделікті мақсатқа жету уақыты! 🎯
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-95 transition-all"
              aria-label="Жабу"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Missing Goal Description */}
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 mb-4">
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {goalStatus.missingTextKz}
            </p>
          </div>

          {/* Today's Activity Progress Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Workouts */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <Dumbbell className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-base font-bold font-tabular text-white">
                {goalStatus.workoutsCompleted}
                <span className="text-xs font-normal text-slate-400 ml-0.5">/ 1</span>
              </div>
              <span className="text-[10px] text-slate-400">Жаттығу</span>
            </div>

            {/* Calories */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <div className="text-base font-bold font-tabular text-white">
                {goalStatus.totalCaloriesBurned}
              </div>
              <span className="text-[10px] text-slate-400">ккал (мақсат 400)</span>
            </div>

            {/* Steps */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <Footprints className="w-4 h-4 text-teal-400 mx-auto mb-1" />
              <div className="text-base font-bold font-tabular text-white">
                {goalStatus.stepsCount.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">Қадам саны</span>
            </div>
          </div>

          {/* Quick Action: Start Recommended Workout */}
          {recommendedWorkout && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                  Ұсынылатын қысқа кешен:
                </span>
                <h4 className="text-xs font-bold text-white">
                  {recommendedWorkout.titleKz}
                </h4>
                <span className="text-[11px] text-slate-400 font-tabular">
                  {recommendedWorkout.durationMinutes} мин · {recommendedWorkout.caloriesBurned} ккал
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onStartWorkout(recommendedWorkout);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Бастау</span>
              </button>
            </div>
          )}

          {/* Browser Notification Permission Button if not granted */}
          {permissionState !== 'granted' && (
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] text-slate-300">
                  Браузердің нақты Push хабарламаларын қосу
                </span>
              </div>
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-semibold transition-colors active:scale-95"
              >
                Рұқсат беру
              </button>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
            <button
              onClick={handleQuickSteps}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <Footprints className="w-3.5 h-3.5 text-teal-400" />
              <span>+1,500 қадам қосу</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors active:scale-95"
            >
              Бүгінге жабу
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
