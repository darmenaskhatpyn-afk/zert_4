import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Play, 
  Target, 
  Dumbbell, 
  CheckCircle2, 
  ChevronRight,
  RefreshCw,
  Zap,
  HeartPulse
} from 'lucide-react';
import { Workout, UserProfile } from '../types/fitness';

interface RecommendedWorkoutsProps {
  goal: UserProfile['goal'];
  completedTodayCount: number;
  caloriesBurnedToday: number;
  workouts: Workout[];
  onStartWorkout: (workout: Workout) => void;
  onUpdateGoal: (newGoal: UserProfile['goal']) => void;
  onOpenWorkoutsTab: () => void;
}

export const RecommendedWorkouts: React.FC<RecommendedWorkoutsProps> = ({
  goal,
  completedTodayCount,
  caloriesBurnedToday,
  workouts,
  onStartWorkout,
  onUpdateGoal,
  onOpenWorkoutsTab
}) => {
  const [showGoalPicker, setShowGoalPicker] = useState(false);

  const goalConfigs = {
    aryqtau: {
      labelKz: 'Салмақ тастау (Май жағу)',
      shortLabel: 'Салмақ тастау',
      icon: Flame,
      color: 'text-orange-400',
      badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      description: 'Жоғары қарқынды кардио және интервалды жаттығулар арқылы калорияны барынша көп жағуға бағытталған.',
      preferredCategories: ['cardio', 'home'],
      matchTag: '🎯 Май жағуға 100% сай'
    },
    bulshyqet: {
      labelKz: 'Бұлшықет жинау (Күш)',
      shortLabel: 'Бұлшықет жинау',
      icon: Dumbbell,
      color: 'text-blue-400',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      description: 'Негізгі бұлшықет топтарына гипертрофиялық жүктеме беріп, күш пен рельефті арттырады.',
      preferredCategories: ['strength', 'home'],
      matchTag: '💪 Бұлшықет өсіруге сай'
    },
    tonus: {
      labelKz: 'Дене тонусы (Мығым дене)',
      shortLabel: 'Дене тонусы',
      icon: Zap,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      description: 'Бел, баспасөз және жалпы дене бұлшықеттерін қатайтып, сымбатты пішін қалыптастырады.',
      preferredCategories: ['abs', 'home', 'strength'],
      matchTag: '⚡ Мықты тонусқа сай'
    },
    tozimdilik: {
      labelKz: 'Төзімділік және созылу',
      shortLabel: 'Төзімділік / Созылу',
      icon: HeartPulse,
      color: 'text-teal-400',
      badgeBg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      description: 'Буындар мен омыртқа икемділігін дамытып, шаршауды басатын функционалды бағдарлама.',
      preferredCategories: ['stretch', 'cardio'],
      matchTag: '🧘 Икемділікке сай'
    }
  };

  const currentGoalCfg = goalConfigs[goal] || goalConfigs.tonus;

  // Smart recommendation filtering based on Goal + Today's Activity level
  const hasHighActivityToday = completedTodayCount >= 1 || caloriesBurnedToday >= 200;

  let recommendedList: { workout: Workout; reasonKz: string; badgeKz: string }[] = [];

  if (hasHighActivityToday) {
    // If user already did workouts today, recommend Recovery / Stretch first, then next target
    const stretchWorkout = workouts.find(w => w.category === 'stretch') || workouts[workouts.length - 1];
    const goalWorkout = workouts.find(w => currentGoalCfg.preferredCategories.includes(w.category) && w.id !== stretchWorkout?.id) || workouts[0];

    if (stretchWorkout) {
      recommendedList.push({
        workout: stretchWorkout,
        badgeKz: '🌿 Қалпына келу',
        reasonKz: 'Бүгін белсенді жаттықтыңыз! Бұлшықеттердегі спазмды басып, икемділікті қалпына келтіру үшін ұсынылады.'
      });
    }

    if (goalWorkout) {
      recommendedList.push({
        workout: goalWorkout,
        badgeKz: currentGoalCfg.matchTag,
        reasonKz: `Мақсатыңызға сәйкес келесі кезеңдегі жаттығу.`
      });
    }
  } else {
    // Fresh user today: prioritize highest match to user's goal
    const matchingWorkouts = workouts.filter(w => currentGoalCfg.preferredCategories.includes(w.category));
    const sorted = matchingWorkouts.length > 0 ? matchingWorkouts : workouts;

    // Pick top 2-3 distinct workouts
    sorted.slice(0, 3).forEach((w, idx) => {
      let reason = '';
      let badge = '';

      if (goal === 'aryqtau') {
        badge = idx === 0 ? '🔥 Жылдам май жағу' : '⚡ Метаболизм арттыру';
        reason = `Тәуліктік калория дефициті мен майды тез жағу мақсатыңыз үшін таңдалды (${w.caloriesBurned} ккал).`;
      } else if (goal === 'bulshyqet') {
        badge = idx === 0 ? '💪 Негізгі күш кешені' : '🎯 Мақсатты жүктеме';
        reason = `Ірі бұлшықет талшықтарын шынықтыру және масса өсіру мақсатыңызға дәл келеді.`;
      } else if (goal === 'tonus') {
        badge = idx === 0 ? '⚡ Толық тонус' : '🎯 Сымбатты сызықтар';
        reason = `Күнделікті дене тонусын сергек ұстау мен бел корсетін нығайтуға арналған.`;
      } else {
        badge = idx === 0 ? '🧘 Икемділік пен тыныс' : '🌿 Буын саулығы';
        reason = `Буындар мен омыртқа бағанасын босаңсытып, төзімділікті арттырады.`;
      }

      recommendedList.push({
        workout: w,
        badgeKz: badge,
        reasonKz: reason
      });
    });
  }

  return (
    <div className="space-y-3.5">
      {/* Section Header with Goal Indicator & Switcher Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-bold font-display text-white">
            Сізге арналған ұсыныстар
          </h2>
        </div>

        <button
          onClick={() => setShowGoalPicker(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 transition-colors active:scale-95"
          title="Мақсатты ауыстыру"
        >
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span>{currentGoalCfg.shortLabel}</span>
          <RefreshCw className="w-3 h-3 text-slate-500 ml-0.5" />
        </button>
      </div>

      {/* Activity Context Subtitle Banner */}
      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-start gap-2.5 text-xs">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <Target className="w-3.5 h-3.5" />
        </div>
        <div className="text-[11px] text-slate-300 leading-relaxed">
          <span>
            {hasHighActivityToday ? (
              <>Бүгінгі белсенділігіңіз жоғары (<strong className="text-white font-tabular">{completedTodayCount} жаттығу</strong>, <strong className="text-white font-tabular">{caloriesBurnedToday} ккал</strong>). Салмақ түскен бұлшықеттерді қалпына келтіру мен мақсатты кешендер ұсынылады:</>
            ) : (
              <>Мақсатыңыз — <strong className="text-emerald-400">{currentGoalCfg.labelKz}</strong>. Бүгін әлі жаттығу орындалмады, мына кешендерден бастау ұсынылады:</>
            )}
          </span>
        </div>
      </div>

      {/* Recommended Cards Stack */}
      <div className="space-y-3">
        {recommendedList.map(({ workout, badgeKz, reasonKz }, idx) => (
          <div
            key={workout.id}
            className="group relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 p-4 transition-all duration-200"
          >
            {/* Top Match Tag */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {badgeKz}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {workout.difficulty} · {workout.exercises.length} жаттығу
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="text-base font-bold font-display text-white mb-1">
              {workout.titleKz}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1 mb-2">
              {reasonKz}
            </p>

            {/* Target Muscles */}
            <div className="flex flex-wrap gap-1 mb-3">
              {workout.targetMusclesKz.slice(0, 3).map((m, i) => (
                <span key={i} className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-md">
                  {m}
                </span>
              ))}
            </div>

            {/* Bottom Row with Stats & Start */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/70 text-xs">
              <div className="flex items-center gap-3.5 text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-tabular font-semibold text-white">{workout.durationMinutes}</span> мин
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-tabular font-semibold text-white">{workout.caloriesBurned}</span> ккал
                </span>
              </div>

              <button
                onClick={() => onStartWorkout(workout)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>Бастау</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Goal Switcher Modal */}
      <AnimatePresence>
        {showGoalPicker && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="bg-slate-950 border-t border-slate-800 rounded-t-[36px] w-full max-w-lg p-5 max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-white">Негізгі мақсатты таңдау</h3>
                  <p className="text-xs text-slate-400">Ұсынылатын жаттығулар осы мақсатқа бейімделеді</p>
                </div>
                <button
                  onClick={() => setShowGoalPicker(false)}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5 my-2">
                {(Object.keys(goalConfigs) as UserProfile['goal'][]).map(gKey => {
                  const cfg = goalConfigs[gKey];
                  const isSelected = goal === gKey;
                  const Icon = cfg.icon;

                  return (
                    <div
                      key={gKey}
                      onClick={() => {
                        onUpdateGoal(gKey);
                        setShowGoalPicker(false);
                      }}
                      className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all active:scale-[0.99] ${
                        isSelected 
                          ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30' 
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{cfg.labelKz}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {cfg.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowGoalPicker(false)}
                className="w-full mt-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
              >
                Жабу
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
