import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  TrendingUp, 
  Settings, 
  Flame, 
  Clock, 
  Dumbbell, 
  Award, 
  Check, 
  X, 
  Scale, 
  Volume2, 
  VolumeX,
  Target,
  BarChart3,
  ChevronRight,
  Bell,
  BellRing
} from 'lucide-react';
import { UserProfile, WeightHistoryPoint, DailyLog } from '../types/fitness';
import { MonthlyWorkoutCalendar } from './MonthlyWorkoutCalendar';

interface ProfileProgressTabProps {
  userProfile: UserProfile;
  weightHistory: WeightHistoryPoint[];
  dailyLog: DailyLog;
  sixPmAlertEnabled: boolean;
  onUpdateProfile: (updated: UserProfile) => void;
  onAddWeightPoint: (weight: number) => void;
  onOpenWeeklySummary: () => void;
  onToggleSixPmAlert: (enabled: boolean) => void;
  onTestSixPmAlert: () => void;
}

export const ProfileProgressTab: React.FC<ProfileProgressTabProps> = ({
  userProfile,
  weightHistory,
  dailyLog,
  sixPmAlertEnabled,
  onUpdateProfile,
  onAddWeightPoint,
  onOpenWeeklySummary,
  onToggleSixPmAlert,
  onTestSixPmAlert
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState(userProfile.weightKg.toString());

  // Settings form state
  const [editProfile, setEditProfile] = useState<UserProfile>({ ...userProfile });

  // BMI Calculation
  const heightM = userProfile.heightCm / 100;
  const bmi = Math.round((userProfile.weightKg / (heightM * heightM)) * 10) / 10;

  const getBmiStatus = (bmiVal: number) => {
    if (bmiVal < 18.5) return { label: 'Салмақ тапшылығы', color: 'text-blue-400', desc: 'Бұлшықет салмағын жинау ұсынылады' };
    if (bmiVal <= 24.9) return { label: 'Қалыпты салмақ', color: 'text-emerald-400', desc: 'Керемет форма! Осы қалыпты сақтаңыз' };
    if (bmiVal <= 29.9) return { label: 'Артық салмақ', color: 'text-amber-400', desc: 'Кардио және калория дефициті ұсынылады' };
    return { label: 'Семіздік', color: 'text-rose-400', desc: 'Дәрігермен кеңесіп, жүйелі жаттығу бастаңыз' };
  };

  const bmiInfo = getBmiStatus(bmi);

  // Achievements
  const achievements = [
    {
      id: 'first_workout',
      title: 'Алғашқы қадам',
      desc: 'Бірінші жаттығуды аяқтадыңыз',
      unlocked: true,
      icon: '🎯'
    },
    {
      id: 'seven_days',
      title: 'Темір тәртіп',
      desc: '5 күн қатарынан белсенді жаттығу',
      unlocked: true,
      icon: '🔥'
    },
    {
      id: 'hydration_master',
      title: 'Су балансы',
      desc: 'Күнделікті 2000 мл су ішу',
      unlocked: dailyLog.waterMl >= 2000,
      icon: '💧'
    },
    {
      id: 'ten_thousand_steps',
      title: 'Жылдам саяхатшы',
      desc: 'Күніне 10 000 қадам жасау',
      unlocked: dailyLog.steps >= 10000,
      icon: '👟'
    },
    {
      id: 'power_beast',
      title: 'Шыныққан батыр',
      desc: 'Күш жаттығуын толық орындау',
      unlocked: true,
      icon: '⚡'
    }
  ];

  const handleSaveSettings = () => {
    onUpdateProfile(editProfile);
    setShowSettings(false);
  };

  const handleSaveWeight = () => {
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 30 && val < 250) {
      onAddWeightPoint(val);
      setShowAddWeight(false);
    }
  };

  // SVG Chart points calculation for weight history
  const minWeight = Math.min(...weightHistory.map(w => w.weightKg)) - 1;
  const maxWeight = Math.max(...weightHistory.map(w => w.weightKg)) + 1;
  const range = Math.max(1, maxWeight - minWeight);

  const chartPoints = weightHistory.map((pt, i) => {
    const x = (i / Math.max(1, weightHistory.length - 1)) * 260 + 20;
    const y = 90 - ((pt.weightKg - minWeight) / range) * 70;
    return { x, y, pt };
  });

  const svgPath = chartPoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="space-y-5 pb-6">
      {/* Header with Settings Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">
            Прогресс және профиль
          </h1>
          <p className="text-xs text-slate-400">
            Дене өлшемдері мен жетістіктер
          </p>
        </div>

        <button
          onClick={() => {
            setEditProfile({ ...userProfile });
            setShowSettings(true);
          }}
          className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center active:scale-95 transition-transform"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* User Stats Card with BMI */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-lg font-bold font-display">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{userProfile.name}</h3>
              <span className="text-xs text-slate-400">{userProfile.age} жас · {userProfile.heightCm} см</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Ағымдағы салмақ</span>
            <div className="text-2xl font-display font-extrabold text-white font-tabular">
              {userProfile.weightKg}
              <span className="text-xs font-normal text-slate-400 ml-1">кг</span>
            </div>
          </div>
        </div>

        {/* BMI calculation container */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">ДМИ (BMI):</span>
              <span className="text-sm font-bold text-white font-tabular">{bmi}</span>
              <span className={`text-xs font-semibold ${bmiInfo.color}`}>
                · {bmiInfo.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{bmiInfo.desc}</p>
          </div>

          <button
            onClick={() => {
              setNewWeightInput(userProfile.weightKg.toString());
              setShowAddWeight(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Жаңарту</span>
          </button>
        </div>
      </div>

      {/* Monthly Workout Calendar with Activity Dots */}
      <MonthlyWorkoutCalendar dailyLog={dailyLog} />

      {/* Weight History Dynamics Chart */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Салмақ динамикасы (кг)</span>
          </div>
          <span className="text-slate-400">Мақсат: {userProfile.targetWeightKg} кг</span>
        </div>

        {/* SVG Interactive Line Chart */}
        <div className="w-full h-32 relative flex items-center justify-center my-2">
          <svg viewBox="0 0 300 110" className="w-full h-full overflow-visible">
            {/* Guide lines */}
            <line x1="20" y1="20" x2="280" y2="20" stroke="#1E293B" strokeDasharray="3 3" />
            <line x1="20" y1="55" x2="280" y2="55" stroke="#1E293B" strokeDasharray="3 3" />
            <line x1="20" y1="90" x2="280" y2="90" stroke="#1E293B" strokeDasharray="3 3" />

            {/* Target line */}
            <line 
              x1="20" 
              y1={90 - ((userProfile.targetWeightKg - minWeight) / range) * 70} 
              x2="280" 
              y2={90 - ((userProfile.targetWeightKg - minWeight) / range) * 70} 
              stroke="#059669" 
              strokeWidth="1" 
              strokeDasharray="4 4" 
            />

            {/* Path */}
            <path
              d={svgPath}
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dots */}
            {chartPoints.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4.5" fill="#059669" stroke="#10B981" strokeWidth="2" />
                <text
                  x={p.x}
                  y={p.y - 9}
                  fill="#94A3B8"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {p.pt.weightKg}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>{weightHistory[0]?.date || 'Басы'}</span>
          <span>Соңғы өлшем: {weightHistory[weightHistory.length - 1]?.date || 'Бүгін'}</span>
        </div>
      </div>

      {/* 7-Day Weekly Summary Dashboard Button Banner */}
      <div 
        onClick={onOpenWeeklySummary}
        className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-900/50 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between group transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              7 күндік апталық қорытынды есеп
            </h3>
            <p className="text-xs text-slate-400">
              Калория, жаттығу уақыты мен қадамдар графигі
            </p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
      </div>

      {/* Push Notifications & 6 PM Goal Reminder Section */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Сағат 18:00 ескертпесі</span>
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                  Push Alert
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Күнделікті мақсат орындалмаса, сағат 18:00-де ескертеді
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            checked={sixPmAlertEnabled}
            onChange={(e) => onToggleSixPmAlert(e.target.checked)}
            className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            title="18:00 ескертпесін қосу/өшіру"
          />
        </div>

        <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Браузер хабарламасы мен сигналды тексеру:
          </span>

          <button
            onClick={onTestSixPmAlert}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/30 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Сынап көру (Тест)</span>
          </button>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <Dumbbell className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-lg font-bold font-tabular text-white">18</div>
          <span className="text-[10px] text-slate-400">Жаттығу саны</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <div className="text-lg font-bold font-tabular text-white">3,420</div>
          <span className="text-[10px] text-slate-400">Жағылған ккал</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold font-tabular text-white">285</div>
          <span className="text-[10px] text-slate-400">Белсенді минут</span>
        </div>
      </div>

      {/* Badges / Achievements */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold font-display text-white">Жетістіктер</h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {achievements.map(a => (
            <div
              key={a.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                a.unlocked 
                  ? 'bg-slate-900/90 border-emerald-500/30 text-white' 
                  : 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-60'
              }`}
            >
              <div className="text-2xl">{a.icon}</div>
              <div>
                <h4 className="text-xs font-semibold mb-0.5">{a.title}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Weight Modal */}
      <AnimatePresence>
        {showAddWeight && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xs w-full text-center space-y-4"
            >
              <h3 className="text-base font-bold text-white">Жаңа салмақты енгізу</h3>
              <p className="text-xs text-slate-400">
                Дене салмағын таңертең аш қарынға өлшеу дұрыс нәтиже береді.
              </p>

              <div className="flex items-center justify-center gap-2 my-2">
                <input
                  type="number"
                  step="0.1"
                  value={newWeightInput}
                  onChange={(e) => setNewWeightInput(e.target.value)}
                  className="w-24 text-3xl font-display font-extrabold text-emerald-400 bg-slate-950 border border-slate-800 rounded-2xl text-center py-2 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-sm font-semibold text-slate-400">кг</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleSaveWeight}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Сақтау
                </button>
                <button
                  onClick={() => setShowAddWeight(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Бас тарту
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-slate-900 border-t border-slate-800 rounded-t-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Профиль параметрлері</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div>
                  <label className="block text-slate-400 mb-1">Есіміңіз:</label>
                  <input
                    type="text"
                    value={editProfile.name}
                    onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Жасы:</label>
                    <input
                      type="number"
                      value={editProfile.age}
                      onChange={(e) => setEditProfile({ ...editProfile, age: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-tabular"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Бойы (см):</label>
                    <input
                      type="number"
                      value={editProfile.heightCm}
                      onChange={(e) => setEditProfile({ ...editProfile, heightCm: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-tabular"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Мақсатты салмақ (кг):</label>
                    <input
                      type="number"
                      value={editProfile.targetWeightKg}
                      onChange={(e) => setEditProfile({ ...editProfile, targetWeightKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-tabular"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Күнделікті қадам:</label>
                    <input
                      type="number"
                      value={editProfile.dailyStepGoal}
                      onChange={(e) => setEditProfile({ ...editProfile, dailyStepGoal: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-tabular"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Су нормасы (мл):</label>
                    <input
                      type="number"
                      step="100"
                      value={editProfile.dailyWaterGoalMl}
                      onChange={(e) => setEditProfile({ ...editProfile, dailyWaterGoalMl: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-tabular"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Калория лимиті (ккал):</label>
                    <input
                      type="number"
                      step="50"
                      value={editProfile.dailyCalorieGoal}
                      onChange={(e) => setEditProfile({ ...editProfile, dailyCalorieGoal: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-tabular"
                    />
                  </div>
                </div>

                {/* Sound Toggle */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {editProfile.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                    <span className="text-xs">Жаттығу дыбыстық сигналдары</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editProfile.soundEnabled}
                    onChange={(e) => setEditProfile({ ...editProfile, soundEnabled: e.target.checked })}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full mt-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                Параметрлерді сақтау
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
