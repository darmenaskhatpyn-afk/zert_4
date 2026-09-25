import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplet, 
  Check, 
  Clock, 
  X, 
  Bell, 
  BellOff, 
  Sparkles, 
  Plus, 
  Volume2, 
  Info,
  Calendar
} from 'lucide-react';
import { HydrationSlot, HydrationSettings, UserProfile } from '../types/fitness';
import { workoutAudio } from '../utils/audio';

interface HydrationModalProps {
  slots: HydrationSlot[];
  currentWaterMl: number;
  userProfile: UserProfile;
  settings: HydrationSettings;
  isOpen: boolean;
  onClose: () => void;
  onLogWater: (amountMl: number, slotId?: string) => void;
  onToggleSlot: (slotId: string) => void;
  onUpdateSettings: (settings: HydrationSettings) => void;
  onTriggerTestReminder: () => void;
}

export const HydrationModal: React.FC<HydrationModalProps> = ({
  slots,
  currentWaterMl,
  userProfile,
  settings,
  isOpen,
  onClose,
  onLogWater,
  onToggleSlot,
  onUpdateSettings,
  onTriggerTestReminder
}) => {
  const [customMl, setCustomMl] = useState(250);

  if (!isOpen) return null;

  const goalMl = userProfile.dailyWaterGoalMl || 2500;
  const progressPercent = Math.min(100, Math.round((currentWaterMl / goalMl) * 100));
  const remainingMl = Math.max(0, goalMl - currentWaterMl);

  const quickAmounts = [150, 250, 330, 500, 750];

  const handleQuickAdd = (amt: number) => {
    workoutAudio.playWaterTap();
    onLogWater(amt);
  };

  const handleCustomAdd = () => {
    if (customMl > 0) {
      workoutAudio.playWaterTap();
      onLogWater(customMl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="bg-slate-950 border-t border-slate-800 rounded-t-[36px] w-full max-w-lg p-5 max-h-[92vh] overflow-y-auto no-scrollbar"
      >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Droplet className="w-5 h-5 fill-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Су балансы мен кестесі</h2>
              <p className="text-xs text-slate-400">Күнделікті мақсатқа жету кестесі</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Animated Hydration Gauge / Fluid Cylinder */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-blue-900/40 relative overflow-hidden mb-5">
          {/* Subtle blue background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-400 font-semibold block mb-0.5">
                Бүгінгі нәтиже
              </span>
              <div className="text-3xl font-display font-black text-white font-tabular">
                {currentWaterMl}
                <span className="text-sm font-normal text-slate-400 ml-1.5">/ {goalMl} мл</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {remainingMl > 0 ? (
                  <span>Мақсатқа дейін <strong className="text-white font-tabular">{remainingMl} мл</strong> қалды</span>
                ) : (
                  <span className="text-emerald-400 font-semibold">Күнделікті норма орындалды! 🎉</span>
                )}
              </p>
            </div>

            {/* Fluid Wave Progress Circle */}
            <div className="relative w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center shrink-0">
              {/* Fluid fill with animated wave */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-sky-400 opacity-80"
                initial={{ height: 0 }}
                animate={{ height: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <div className="relative z-10 text-center">
                <span className="text-lg font-black font-display text-white font-tabular drop-shadow">
                  {progressPercent}%
                </span>
                <span className="text-[9px] font-semibold text-slate-200 block drop-shadow">норма</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Log Buttons */}
        <div className="space-y-2 mb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Жылдам су қосу:
          </span>
          <div className="grid grid-cols-5 gap-2">
            {quickAmounts.map(amt => (
              <button
                key={amt}
                onClick={() => handleQuickAdd(amt)}
                className="py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 active:scale-95 text-xs font-bold text-white transition-all hover:bg-blue-500/10"
              >
                +{amt} мл
              </button>
            ))}
          </div>

          {/* Custom amount row */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              step="50"
              value={customMl}
              onChange={(e) => setCustomMl(Number(e.target.value))}
              placeholder="Басқа мөлшер"
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-tabular focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleCustomAdd}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Қосу</span>
            </button>
          </div>
        </div>

        {/* Daily Scheduled Checklist based on Daily Water Goal */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Күнделікті су кестесі ({slots.length} қабылдау)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Күні бойы біркелкі</span>
          </div>

          <div className="space-y-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                onClick={() => onToggleSlot(slot.id)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                  slot.completed
                    ? 'bg-blue-950/20 border-blue-500/40 text-slate-300'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    slot.completed ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {slot.completed ? <Check className="w-4 h-4 stroke-[3]" /> : <Clock className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white font-tabular">{slot.time}</span>
                      <span className="text-xs text-slate-300">· {slot.labelKz}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Ұсыныс: {slot.recommendedMl} мл {slot.completed && '✓ Орындалды'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold font-tabular ${slot.completed ? 'text-blue-400' : 'text-slate-400'}`}>
                    +{slot.recommendedMl} мл
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminder Settings & Immediate Test Trigger */}
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.remindersEnabled ? (
                <Bell className="w-4 h-4 text-emerald-400" />
              ) : (
                <BellOff className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <h4 className="text-xs font-bold text-white">Су ішу ескертпелері</h4>
                <p className="text-[10px] text-slate-400">Кесте уақыты келгенде еске салады</p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={settings.remindersEnabled}
              onChange={(e) => onUpdateSettings({ ...settings, remindersEnabled: e.target.checked })}
              className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
            />
          </div>

          {/* Test reminder trigger button */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-300">Хабарламаны сынау:</span>
            <button
              onClick={() => {
                onTriggerTestReminder();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Сынамалық ескертуді ашу</span>
            </button>
          </div>
        </div>

        {/* Health Tip */}
        <div className="p-4 rounded-3xl bg-blue-950/20 border border-blue-900/30 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white block mb-0.5">Пайдалы кеңес:</span>
            Суды бір мезетте көп мөлшерде емес, күні бойы 200-250 миллилитрден біркелкі ішу ағзаға зат алмасуды жеделдетуге және энергияны тұрақты ұстауға барынша көмектеседі.
          </div>
        </div>
      </motion.div>
    </div>
  );
};
