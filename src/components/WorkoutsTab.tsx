import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Clock, 
  Flame, 
  Plus, 
  SlidersHorizontal, 
  Check, 
  ChevronRight, 
  X,
  Dumbbell,
  Sparkles,
  Layers
} from 'lucide-react';
import { Workout, WorkoutCategory, DifficultyLevel, ExerciseItem } from '../types/fitness';
import { EXERCISE_CATALOG } from '../data/exercises';

interface WorkoutsTabProps {
  workouts: Workout[];
  onStartWorkout: (workout: Workout) => void;
  onAddCustomWorkout: (workout: Workout) => void;
}

export const WorkoutsTab: React.FC<WorkoutsTabProps> = ({
  workouts,
  onStartWorkout,
  onAddCustomWorkout
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Барлығы' | DifficultyLevel>('Барлығы');
  const [selectedWorkoutDetail, setSelectedWorkoutDetail] = useState<Workout | null>(null);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  // Custom Workout Builder States
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<WorkoutCategory>('home');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'Барлығы' },
    { id: 'home', label: 'Үйдегі' },
    { id: 'strength', label: 'Күш' },
    { id: 'cardio', label: 'Кардио / HIIT' },
    { id: 'abs', label: 'Пресс' },
    { id: 'stretch', label: 'Созылу' }
  ];

  const difficulties: ('Барлығы' | DifficultyLevel)[] = ['Барлығы', 'Бастаушы', 'Орташа', 'Жетілдірілген'];

  const filteredWorkouts = workouts.filter(w => {
    const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'Барлығы' || w.difficulty === selectedDifficulty;
    return matchCat && matchDiff;
  });

  const toggleSelectExercise = (id: string) => {
    setSelectedExerciseIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSaveCustomWorkout = () => {
    if (!customTitle.trim() || selectedExerciseIds.length === 0) return;

    const chosenExercises: ExerciseItem[] = selectedExerciseIds.map(id => {
      const found = EXERCISE_CATALOG.find(e => e.id === id)!;
      return {
        id: found.id,
        nameKz: found.nameKz,
        nameEn: found.nameEn,
        targetMuscleKz: found.targetMuscleKz,
        type: found.type,
        durationOrReps: found.durationOrReps,
        restSeconds: found.restSeconds,
        instructionsKz: found.instructionsKz,
        tipsKz: found.tipsKz,
        animType: found.animType
      };
    });

    const newCustomWorkout: Workout = {
      id: `custom_${Date.now()}`,
      titleKz: customTitle,
      subtitleKz: 'Жеке құрастырылған жаттығу кешені',
      category: customCategory,
      durationMinutes: Math.round(chosenExercises.length * 2.5),
      caloriesBurned: chosenExercises.length * 25,
      difficulty: 'Орташа',
      targetMusclesKz: ['Жеке таңдау'],
      descriptionKz: 'Сіздің жеке мақсатыңызға сәйкес арнайы таңдалған жаттығулар жиынтығы.',
      accentColor: '#10B981',
      gradient: 'from-emerald-950 via-slate-900 to-slate-950',
      exercises: chosenExercises,
      isCustom: true
    };

    onAddCustomWorkout(newCustomWorkout);
    setShowBuilderModal(false);
    setCustomTitle('');
    setSelectedExerciseIds([]);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header & Custom Builder Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">
            Жаттығулар
          </h1>
          <p className="text-xs text-slate-400">
            Кез келген деңгейге арналған дайын кешендер
          </p>
        </div>

        <button
          onClick={() => setShowBuilderModal(true)}
          className="px-3.5 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Өз жоспарың</span>
        </button>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as WorkoutCategory)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Difficulty Sub-filter */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 text-[11px] font-medium">Деңгей:</span>
        <div className="flex items-center gap-1.5">
          {difficulties.map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Workout Cards List */}
      <div className="space-y-3.5">
        {filteredWorkouts.map(workout => (
          <div
            key={workout.id}
            onClick={() => setSelectedWorkoutDetail(workout)}
            className="group relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800/80 p-5 hover:border-emerald-500/40 cursor-pointer transition-all active:scale-[0.99]"
          >
            {/* Category / Difficulty Indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-semibold">{workout.difficulty}</span>
                <span>·</span>
                <span>{workout.exercises.length} жаттығу</span>
                {workout.isCustom && (
                  <>
                    <span>·</span>
                    <span className="text-amber-400 font-medium">Жеке жоспар</span>
                  </>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-lg font-bold font-display text-white mb-1">
              {workout.titleKz}
            </h3>
            <p className="text-xs text-slate-400 mb-3 line-clamp-1">
              {workout.subtitleKz}
            </p>

            {/* Target Muscles */}
            <div className="flex flex-wrap gap-1 mb-4">
              {workout.targetMusclesKz.map((m, i) => (
                <span key={i} className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                  {m}
                </span>
              ))}
            </div>

            {/* Bottom Row: Stats & Quick Start */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-4 text-slate-300">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onStartWorkout(workout);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>Бастау</span>
              </button>
            </div>
          </div>
        ))}

        {filteredWorkouts.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/40 rounded-3xl border border-slate-800/40">
            Бұл санат бойынша әзірге жаттығу табылмады.
          </div>
        )}
      </div>

      {/* Workout Detail Sheet */}
      <AnimatePresence>
        {selectedWorkoutDetail && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-slate-900 border-t border-slate-800 rounded-t-3xl w-full max-w-lg p-6 max-h-[88vh] flex flex-col"
            >
              {/* Drag Handle */}
              <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-emerald-400 font-semibold">
                  {selectedWorkoutDetail.difficulty} · {selectedWorkoutDetail.durationMinutes} минут
                </span>
                <button
                  onClick={() => setSelectedWorkoutDetail(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl font-bold font-display text-white mb-1">
                {selectedWorkoutDetail.titleKz}
              </h2>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                {selectedWorkoutDetail.descriptionKz}
              </p>

              {/* Exercises List inside workout */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2 no-scrollbar">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  Жаттығулар тізімі ({selectedWorkoutDetail.exercises.length}):
                </span>

                {selectedWorkoutDetail.exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/70 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-slate-200">{ex.nameKz}</h4>
                        <p className="text-[11px] text-slate-400">{ex.targetMuscleKz}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-400 font-tabular">
                      {ex.type === 'seconds' ? `${ex.durationOrReps} сек` : `${ex.durationOrReps} рет`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Start Workout Button pinned at bottom */}
              <button
                onClick={() => {
                  const toStart = selectedWorkoutDetail;
                  setSelectedWorkoutDetail(null);
                  onStartWorkout(toStart);
                }}
                className="w-full mt-4 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Жаттығуды бастау ({selectedWorkoutDetail.durationMinutes} мин)</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Workout Builder Modal */}
      <AnimatePresence>
        {showBuilderModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-slate-900 border-t border-slate-800 rounded-t-3xl w-full max-w-lg p-6 max-h-[90vh] flex flex-col"
            >
              <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Өз жаттығуыңды құру</h3>
                </div>
                <button
                  onClick={() => setShowBuilderModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Input: Title */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Жаттығу атауы:</label>
                  <input
                    type="text"
                    placeholder="Мысалы: Менің кешкі кешенім"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Санаты:</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as WorkoutCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="home">Үйдегі жаттығу</option>
                    <option value="strength">Күш жаттығуы</option>
                    <option value="cardio">Кардио / HIIT</option>
                    <option value="abs">Пресс / Құрсақ</option>
                    <option value="stretch">Созылу</option>
                  </select>
                </div>
              </div>

              {/* Exercise Selector */}
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
                Жаттығуларды таңдаңыз ({selectedExerciseIds.length} таңдалды):
              </span>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar my-1">
                {EXERCISE_CATALOG.map(ex => {
                  const isSelected = selectedExerciseIds.includes(ex.id);
                  return (
                    <div
                      key={ex.id}
                      onClick={() => toggleSelectExercise(ex.id)}
                      className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-white' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <h4 className="font-semibold text-white">{ex.nameKz}</h4>
                        <span className="text-[11px] text-slate-400">{ex.targetMuscleKz} · {ex.type === 'seconds' ? `${ex.durationOrReps} сек` : `${ex.durationOrReps} рет`}</span>
                      </div>

                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Save Button */}
              <button
                disabled={!customTitle.trim() || selectedExerciseIds.length === 0}
                onClick={handleSaveCustomWorkout}
                className="w-full mt-4 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-sm shadow-md transition-all"
              >
                Жаттығу жоспарын сақтау
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
