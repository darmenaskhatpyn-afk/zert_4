import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  X, 
  Volume2, 
  VolumeX, 
  Flame, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Info,
  Plus
} from 'lucide-react';
import { Workout, ExerciseItem } from '../types/fitness';
import { ExerciseAnimation } from './ExerciseAnimation';
import { workoutAudio } from '../utils/audio';

interface WorkoutPlayerProps {
  workout: Workout;
  onClose: () => void;
  onComplete: (stats: { workoutId: string; titleKz: string; durationMinutes: number; caloriesBurned: number }) => void;
}

type PlayerState = 'prep' | 'active' | 'rest' | 'finished';

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  workout,
  onClose,
  onComplete
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>('prep');
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3); // 3 sec prep
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showTechniqueInfo, setShowTechniqueInfo] = useState(false);

  const currentExercise: ExerciseItem = workout.exercises[currentIdx];
  const nextExercise: ExerciseItem | undefined = workout.exercises[currentIdx + 1];

  const totalExercises = workout.exercises.length;
  const progressPercent = Math.round(((currentIdx + (playerState === 'finished' ? 1 : 0)) / totalExercises) * 100);

  // Sync sound settings
  useEffect(() => {
    workoutAudio.enabled = soundOn;
  }, [soundOn]);

  // Overall workout time counter
  useEffect(() => {
    if (playerState === 'finished' || isPaused) return;
    const interval = setInterval(() => {
      setTotalSecondsElapsed(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [playerState, isPaused]);

  // State-specific countdown timer
  useEffect(() => {
    if (isPaused || playerState === 'finished') return;

    if (playerState === 'prep') {
      if (timeLeft > 0) {
        workoutAudio.playTick(500);
        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        workoutAudio.playStartSignal();
        // Transition to active exercise
        setPlayerState('active');
        if (currentExercise.type === 'seconds') {
          setTimeLeft(currentExercise.durationOrReps);
        } else {
          setTimeLeft(0);
        }
      }
    } else if (playerState === 'active') {
      if (currentExercise.type === 'seconds') {
        if (timeLeft > 0) {
          if (timeLeft <= 3) workoutAudio.playTick(440);
          const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
          return () => clearTimeout(timer);
        } else {
          handleExerciseComplete();
        }
      }
    } else if (playerState === 'rest') {
      if (timeLeft > 0) {
        if (timeLeft <= 3) workoutAudio.playTick(520);
        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Move to next exercise
        workoutAudio.playStartSignal();
        goToExercise(currentIdx + 1);
      }
    }
  }, [timeLeft, playerState, isPaused, currentIdx]);

  const handleExerciseComplete = () => {
    if (currentIdx + 1 >= totalExercises) {
      // Workout fully completed!
      workoutAudio.playVictory();
      setPlayerState('finished');
      const elapsedMinutes = Math.max(1, Math.round(totalSecondsElapsed / 60));
      onComplete({
        workoutId: workout.id,
        titleKz: workout.titleKz,
        durationMinutes: elapsedMinutes,
        caloriesBurned: workout.caloriesBurned
      });
    } else {
      // Transition to rest period
      setPlayerState('rest');
      setTimeLeft(currentExercise.restSeconds || 20);
    }
  };

  const goToExercise = (idx: number) => {
    if (idx >= totalExercises) {
      setPlayerState('finished');
      return;
    }
    setCurrentIdx(idx);
    const nextEx = workout.exercises[idx];
    setPlayerState('active');
    if (nextEx.type === 'seconds') {
      setTimeLeft(nextEx.durationOrReps);
    } else {
      setTimeLeft(0);
    }
  };

  const addRestTime = (seconds: number) => {
    setTimeLeft(t => t + seconds);
    workoutAudio.playWaterTap();
  };

  const skipRest = () => {
    goToExercise(currentIdx + 1);
  };

  const formatMinSec = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Top Bar */}
      <div className="pt-safe px-4 py-3 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white bg-slate-900/80 active:scale-95 transition-transform"
          aria-label="Жабу"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-400 font-medium tracking-tight">
            {playerState === 'finished' 
              ? 'Аяқталды' 
              : `${currentIdx + 1} / ${totalExercises} жаттығу`}
          </span>
          <span className="text-sm font-semibold text-slate-200 max-w-[200px] truncate text-center">
            {workout.titleKz}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white bg-slate-900/80 active:scale-95 transition-transform"
            aria-label="Дыбыс"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="w-full bg-slate-900 h-1.5">
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 flex flex-col justify-center px-4 py-2 max-w-lg mx-auto w-full overflow-y-auto no-scrollbar">
        {playerState === 'prep' && (
          <div className="flex flex-col items-center justify-center text-center my-auto">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">
              Дайындық
            </span>
            <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 flex items-center justify-center my-6 animate-pulse">
              <span className="text-6xl font-display font-extrabold text-white font-tabular">
                {timeLeft}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-1">{currentExercise.nameKz}</h3>
            <p className="text-xs text-slate-400">{currentExercise.targetMuscleKz}</p>
          </div>
        )}

        {playerState === 'active' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Visual Animated Kinematic Guide */}
            <div className="w-full">
              <ExerciseAnimation animType={currentExercise.animType} isActive={!isPaused} />
            </div>

            {/* Exercise Header */}
            <div className="text-center w-full">
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
                <span>{currentExercise.targetMuscleKz}</span>
                <span>·</span>
                <button 
                  onClick={() => setShowTechniqueInfo(true)}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-300 underline underline-offset-2 text-xs"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Техникасы</span>
                </button>
              </div>
              <h2 className="text-2xl font-bold font-display text-white tracking-tight">
                {currentExercise.nameKz}
              </h2>
            </div>

            {/* Timer or Reps Counter */}
            {currentExercise.type === 'seconds' ? (
              <div className="flex flex-col items-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      className="stroke-slate-800"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      className="stroke-emerald-400 transition-all duration-1000 ease-linear"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 62}
                      strokeDashoffset={2 * Math.PI * 62 * (1 - timeLeft / (currentExercise.durationOrReps || 1))}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-display font-bold font-tabular text-white">
                      {timeLeft}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">секунд</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-2">
                <div className="px-6 py-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center min-w-[200px]">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Мақсатты қайталау</span>
                  <div className="text-5xl font-display font-extrabold text-emerald-400 font-tabular">
                    {currentExercise.durationOrReps}
                    <span className="text-lg font-normal text-slate-400 ml-1">рет</span>
                  </div>
                </div>

                <button
                  onClick={handleExerciseComplete}
                  className="mt-4 px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-transform"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Орындалды</span>
                </button>
              </div>
            )}
          </div>
        )}

        {playerState === 'rest' && (
          <div className="flex flex-col items-center justify-center text-center space-y-4 my-auto">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              Тынығу уақыты
            </span>

            {/* Rest Countdown */}
            <div className="text-6xl font-display font-black text-white font-tabular my-2">
              {formatMinSec(timeLeft)}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => addRestTime(20)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs text-slate-200 flex items-center gap-1.5 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+20 секунд</span>
              </button>
              <button
                onClick={skipRest}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs text-white font-semibold flex items-center gap-1.5 transition-transform shadow-md"
              >
                <span>Өткізіп жіберу</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Next Exercise Preview */}
            {nextExercise && (
              <div className="w-full mt-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Келесі жаттығу</span>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{nextExercise.nameKz}</h4>
                    <p className="text-xs text-slate-400">{nextExercise.targetMuscleKz}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    {nextExercise.type === 'seconds' ? `${nextExercise.durationOrReps} сек` : `${nextExercise.durationOrReps} рет`}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {playerState === 'finished' && (
          <div className="flex flex-col items-center justify-center text-center space-y-6 my-auto">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-3xl font-display font-extrabold text-white mb-2">
                Жарайсың!
              </h2>
              <p className="text-sm text-slate-300 max-w-xs mx-auto">
                Жаттығу сәтті аяқталды. Сіз өз денсаулығыңыз бен күшіңізге үлкен қадам жасадыңыз!
              </p>
            </div>

            {/* Completed Metrics Summary */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold font-tabular text-white">{workout.caloriesBurned}</div>
                  <span className="text-xs text-slate-400">ккал жағылды</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold font-tabular text-white">{formatMinSec(totalSecondsElapsed)}</div>
                  <span className="text-xs text-slate-400">уақыт</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/20 transition-all"
            >
              Күнделікке сақтау және шығу
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar (when not finished) */}
      {playerState !== 'finished' && (
        <div className="pb-safe px-6 py-4 border-t border-slate-900 bg-slate-950/90 backdrop-blur-md flex items-center justify-between">
          {/* Previous Exercise */}
          <button
            onClick={() => {
              if (currentIdx > 0) goToExercise(currentIdx - 1);
            }}
            disabled={currentIdx === 0}
            className="w-12 h-12 rounded-2xl bg-slate-900 text-slate-300 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Алдыңғы жаттығу"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
            aria-label={isPaused ? "Жалғастыру" : "Кідірту"}
          >
            {isPaused ? <Play className="w-7 h-7 fill-slate-950 ml-1" /> : <Pause className="w-7 h-7 fill-slate-950" />}
          </button>

          {/* Skip / Next Exercise */}
          <button
            onClick={() => {
              if (currentIdx + 1 < totalExercises) {
                goToExercise(currentIdx + 1);
              } else {
                handleExerciseComplete();
              }
            }}
            className="w-12 h-12 rounded-2xl bg-slate-900 text-slate-300 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Келесі жаттығу"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Technique Bottom Sheet Modal */}
      <AnimatePresence>
        {showTechniqueInfo && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-slate-900 border-t border-slate-800 rounded-t-3xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">{currentExercise.nameKz}</h3>
                <button
                  onClick={() => setShowTechniqueInfo(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div>
                  <h4 className="text-xs uppercase font-semibold text-emerald-400 mb-2">Орындау техникасы:</h4>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-300 text-xs">
                    {currentExercise.instructionsKz.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">{step}</li>
                    ))}
                  </ul>
                </div>

                {currentExercise.tipsKz && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs">
                    <span className="font-semibold">Бапкер кеңесі: </span>
                    {currentExercise.tipsKz}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowTechniqueInfo(false)}
                className="w-full mt-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors"
              >
                Түсінікті, жалғастыру
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Exit Confirmation Dialog */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xs w-full text-center space-y-4"
            >
              <h3 className="text-lg font-bold text-white">Жаттығуды тоқтату керек пе?</h3>
              <p className="text-xs text-slate-400">
                Прогресс сақталмайды және нәтиже күйіп кетеді.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
                >
                  Жалғастыру
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 text-xs font-medium transition-colors"
                >
                  Шығу
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
