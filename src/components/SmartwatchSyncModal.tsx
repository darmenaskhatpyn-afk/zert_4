import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Watch, 
  Activity, 
  Heart, 
  Flame, 
  Footprints, 
  RefreshCw, 
  Check, 
  X, 
  Smartphone, 
  CheckCircle2,
  Zap,
  Radio
} from 'lucide-react';
import { workoutAudio } from '../utils/audio';

interface SmartwatchSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncData: (syncedSteps: number, syncedCalories: number) => void;
  currentSteps: number;
}

export const SmartwatchSyncModal: React.FC<SmartwatchSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncData,
  currentSteps
}) => {
  const [deviceType, setDeviceType] = useState<'apple' | 'google' | 'garmin'>('apple');
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Бүгін, 14:20');
  const [liveBpm, setLiveBpm] = useState(74);

  // Simulated device readings
  const deviceData = {
    steps: 8450,
    activeKcal: 380,
    bpm: liveBpm,
    distanceKm: 5.9,
    batteryPercent: 88
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    workoutAudio.playNotificationBell();

    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setLastSyncTime(`Бүгін, ${timeStr}`);
      setLiveBpm(76);
      onSyncData(deviceData.steps, deviceData.activeKcal);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="bg-slate-950 border-t sm:border border-slate-800 rounded-t-[36px] sm:rounded-3xl w-full max-w-lg p-5 max-h-[92vh] overflow-y-auto no-scrollbar relative"
        >
          {/* Grab handle for mobile */}
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Watch className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-display text-white">
                    Смарт-сағатпен синхрондау
                  </h3>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 font-semibold px-2 py-0.5 rounded-full border border-cyan-500/30">
                    &lt;&lt;extend&gt;&gt; API
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Сыртқы жүйе акторы (Apple Health / Google Fit)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Device Selection Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { id: 'apple', label: 'Apple Watch', sub: 'Apple Health' },
              { id: 'google', label: 'Wear OS', sub: 'Google Fit' },
              { id: 'garmin', label: 'Garmin', sub: 'Garmin Connect' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setDeviceType(d.id as 'apple' | 'google' | 'garmin')}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  deviceType === d.id
                    ? 'bg-cyan-950/30 border-cyan-500/50 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{d.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{d.sub}</div>
              </button>
            ))}
          </div>

          {/* Connection Status Card */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800/80 mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-white">
                  Құрылғы қосулы (Bluetooth LE)
                </span>
              </div>
              <span className="text-[11px] font-tabular text-slate-400">
                Батарея: {deviceData.batteryPercent}%
              </span>
            </div>

            {/* Live Readings Metric Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
              {/* Pulse */}
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-center">
                <div className="flex items-center justify-center gap-1 text-rose-400 mb-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-400 animate-pulse" />
                  <span className="text-[10px] font-bold">Тамыр соғысы</span>
                </div>
                <div className="text-lg font-bold font-tabular text-white">
                  {liveBpm} <span className="text-[10px] font-normal text-slate-400">соқ/мин</span>
                </div>
              </div>

              {/* Steps */}
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-center">
                <div className="flex items-center justify-center gap-1 text-teal-400 mb-1">
                  <Footprints className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">Қадамдар</span>
                </div>
                <div className="text-lg font-bold font-tabular text-white">
                  {deviceData.steps.toLocaleString()}
                </div>
              </div>

              {/* Active Calories */}
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-center">
                <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">Жағылған</span>
                </div>
                <div className="text-lg font-bold font-tabular text-white">
                  {deviceData.activeKcal} <span className="text-[10px] font-normal text-slate-400">ккал</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Соңғы синк: {lastSyncTime}</span>
              <span className="text-emerald-400 font-medium">Авто-синк белсенді</span>
            </div>
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Деректер импортталуда...' : 'Қазір синхрондау (Деректерді тасымалдау)'}</span>
          </button>

          {/* Architectural Note */}
          <div className="mt-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-cyan-300 font-semibold">UML UC-2 ескертпесі:</span> Пайдаланушы күнделікті белсенділікті қолмен енгізе алады немесе бұл баламалы сценарий арқылы смарт-сағаттан қадамдар мен калорияларды автоматты түрде қосымшаға тартады.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
