import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Dumbbell, ShieldAlert, Wind, Lightbulb, ChevronRight } from 'lucide-react';
import { EXERCISE_CATALOG, ExerciseCatalogItem } from '../data/exercises';
import { ExerciseAnimation } from './ExerciseAnimation';

export const ExercisesTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Барлығы');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseCatalogItem | null>(null);

  const muscleFilters = [
    'Барлығы',
    'Аяқ және бөксе',
    'Кеуде және трицепс',
    'Құрсақ және бел (Core)',
    'Баспасөз / Пресс',
    'Жүрек және кардио',
    'Қол және трицепс'
  ];

  const filteredExercises = EXERCISE_CATALOG.filter(ex => {
    const matchesSearch = 
      ex.nameKz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscleKz.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMuscle = selectedMuscle === 'Барлығы' || ex.targetMuscleKz.includes(selectedMuscle) || ex.primaryMuscleKz.includes(selectedMuscle);

    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight">
          Жаттығулар базасы
        </h1>
        <p className="text-xs text-slate-400">
          Дұрыс орындау техникасы мен биомеханикасы
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Жаттығу аты немесе бұлшықет бойынша іздеу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-xs"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Muscle Group Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        {muscleFilters.map(muscle => (
          <button
            key={muscle}
            onClick={() => setSelectedMuscle(muscle)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedMuscle === muscle
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {muscle}
          </button>
        ))}
      </div>

      {/* Exercises Grid */}
      <div className="space-y-3">
        {filteredExercises.map(ex => (
          <div
            key={ex.id}
            onClick={() => setSelectedExercise(ex)}
            className="group p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {ex.nameKz}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                  <span>{ex.targetMuscleKz}</span>
                  <span>·</span>
                  <span>{ex.equipmentKz}</span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        ))}

        {filteredExercises.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/40 rounded-3xl border border-slate-800/40">
            Жаттығу табылмады. Басқа сөз тіркесін енгізіп көріңіз.
          </div>
        )}
      </div>

      {/* Exercise Detail Sheet */}
      <AnimatePresence>
        {selectedExercise && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-slate-900 border-t border-slate-800 rounded-t-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

              {/* Close Button & Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-emerald-400 font-semibold">
                  {selectedExercise.equipmentKz} · {selectedExercise.primaryMuscleKz}
                </span>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl font-bold font-display text-white mb-3">
                {selectedExercise.nameKz}
              </h2>

              {/* Animated illustration demonstration */}
              <div className="mb-4">
                <ExerciseAnimation animType={selectedExercise.animType} />
              </div>

              {/* Step by step technique */}
              <div className="space-y-4 text-xs text-slate-300">
                <div>
                  <h4 className="text-xs uppercase font-semibold text-emerald-400 tracking-wider mb-2">
                    Орындау реті:
                  </h4>
                  <ol className="space-y-2 list-decimal list-inside text-slate-300">
                    {selectedExercise.instructionsKz.map((step, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Breathing Guide */}
                <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-900/40 flex items-start gap-2.5 text-blue-200">
                  <Wind className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-blue-300 mb-0.5">Тыныс алу ережесі:</span>
                    <p className="leading-relaxed">{selectedExercise.breathingKz}</p>
                  </div>
                </div>

                {/* Common Mistakes to Avoid */}
                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/30 flex items-start gap-2.5 text-rose-200">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-rose-300 mb-1">Жиі жіберілетін қателіктер:</span>
                    <ul className="space-y-1 list-disc list-inside text-rose-200/90">
                      {selectedExercise.commonMistakesKz.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Coach Tips */}
                {selectedExercise.tipsKz && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 flex items-start gap-2.5 text-emerald-200">
                    <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-emerald-300 mb-0.5">Бапкер кеңесі:</span>
                      <p className="leading-relaxed">{selectedExercise.tipsKz}</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedExercise(null)}
                className="w-full mt-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
              >
                Түсінікті, жабу
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
