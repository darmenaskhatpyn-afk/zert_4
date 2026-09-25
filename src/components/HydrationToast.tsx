import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, Check, Clock, X, ChevronRight } from 'lucide-react';
import { HydrationSlot } from '../types/fitness';
import { workoutAudio } from '../utils/audio';

interface HydrationToastProps {
  currentSlot: HydrationSlot | null;
  currentWaterMl: number;
  dailyGoalMl: number;
  isOpen: boolean;
  onLogWater: (amountMl: number, slotId?: string) => void;
  onSnooze: () => void;
  onDismiss: () => void;
  onOpenDetails: () => void;
}

export const HydrationToast: React.FC<HydrationToastProps> = ({
  currentSlot,
  currentWaterMl,
  dailyGoalMl,
  isOpen,
  onLogWater,
  onSnooze,
  onDismiss,
  onOpenDetails
}) => {
  if (!isOpen || !currentSlot) return null;

  const defaultAmt = currentSlot.recommendedMl || 250;
  const progressPercent = Math.min(100, Math.round((currentWaterMl / dailyGoalMl) * 100));

  const handleQuickLog = (amount: number) => {
    workoutAudio.playWaterTap();
    onLogWater(amount, currentSlot.id);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto"
      >
        <div className="p-4 rounded-3xl bg-slate-900/95 border border-blue-500/40 shadow-[0_20px_40px_-15px_rgba(2,132,199,0.4)] backdrop-blur-xl text-white">
          {/* Top Bar with Slot Time and Close */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center animate-bounce">
                <Droplet className="w-4 h-4 fill-blue-400 text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{currentSlot.time} · Су ішетін уақыт!</span>
                </span>
                <h4 className="text-xs font-bold text-white leading-tight">
                  {currentSlot.labelKz}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onOpenDetails}
                className="text-[10px] text-blue-300 hover:text-white px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors flex items-center gap-0.5"
              >
                <span>Кесте</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={onDismiss}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
                aria-label="Жабу"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description & Current Progress */}
          <div className="flex items-center justify-between text-xs text-slate-300 my-2 px-0.5">
            <span className="text-[11px] text-slate-400">
              Ұсыныс: <strong className="text-blue-300 font-tabular">{defaultAmt} мл</strong>
            </span>
            <span className="text-[11px] font-tabular text-slate-400">
              Бүгін: <strong className="text-white">{currentWaterMl}</strong> / {dailyGoalMl} мл ({progressPercent}%)
            </span>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickLog(defaultAmt)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-blue-500 hover:bg-blue-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>+{defaultAmt} мл іштім</span>
            </button>

            <button
              onClick={() => handleQuickLog(500)}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-xs transition-colors"
            >
              +500 мл
            </button>

            <button
              onClick={onSnooze}
              className="py-2.5 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 active:scale-95 text-[11px] text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap"
            >
              Кейінге (15м)
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
