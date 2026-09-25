import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Utensils, 
  Trash2, 
  Search, 
  X, 
  Sparkles,
  PieChart,
  Apple
} from 'lucide-react';
import { FoodItem, LoggedMeal, UserProfile } from '../types/fitness';
import { FOOD_CATALOG } from '../data/foodCatalog';

interface NutritionTabProps {
  userProfile: UserProfile;
  loggedMeals: LoggedMeal[];
  onAddMeal: (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => void;
  onDeleteMeal: (mealId: string) => void;
}

export const NutritionTab: React.FC<NutritionTabProps> = ({
  userProfile,
  loggedMeals,
  onAddMeal,
  onDeleteMeal
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMealType, setActiveMealType] = useState<LoggedMeal['mealType']>('Таңғы ас');
  const [searchQuery, setSearchQuery] = useState('');
  const [amountGrams, setAmountGrams] = useState(100);
  const [customFoodMode, setCustomFoodMode] = useState(false);

  // Custom food fields
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState(150);
  const [customProtein, setCustomProtein] = useState(10);
  const [customFat, setCustomFat] = useState(5);
  const [customCarbs, setCustomCarbs] = useState(15);

  const mealTypes: LoggedMeal['mealType'][] = ['Таңғы ас', 'Түскі ас', 'Кешкі ас', 'Тіскебасар'];

  // Calculations
  const totalCalories = loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = loggedMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalFat = loggedMeals.reduce((acc, m) => acc + m.fat, 0);
  const totalCarbs = loggedMeals.reduce((acc, m) => acc + m.carbs, 0);

  // Target macros (estimated based on daily calorie goal)
  // E.g. Protein 30%, Fat 25%, Carbs 45%
  const targetProtein = Math.round((userProfile.dailyCalorieGoal * 0.3) / 4);
  const targetFat = Math.round((userProfile.dailyCalorieGoal * 0.25) / 9);
  const targetCarbs = Math.round((userProfile.dailyCalorieGoal * 0.45) / 4);

  const calorieRemaining = Math.max(0, userProfile.dailyCalorieGoal - totalCalories);
  const caloriePercent = Math.min(100, Math.round((totalCalories / userProfile.dailyCalorieGoal) * 100));

  const filteredFoods = FOOD_CATALOG.filter(f => 
    f.nameKz.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.categoryKz.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFood = (food: FoodItem) => {
    const factor = amountGrams / 100;
    onAddMeal({
      foodId: food.id,
      nameKz: food.nameKz,
      mealType: activeMealType,
      amount: amountGrams,
      calories: Math.round(food.calories * factor),
      protein: Math.round(food.protein * factor * 10) / 10,
      fat: Math.round(food.fat * factor * 10) / 10,
      carbs: Math.round(food.carbs * factor * 10) / 10
    });
    setShowAddModal(false);
  };

  const handleAddCustomMeal = () => {
    if (!customName.trim()) return;
    onAddMeal({
      foodId: `custom_food_${Date.now()}`,
      nameKz: customName,
      mealType: activeMealType,
      amount: amountGrams,
      calories: Number(customCalories),
      protein: Number(customProtein),
      fat: Number(customFat),
      carbs: Number(customCarbs)
    });
    setShowAddModal(false);
    setCustomName('');
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">
            Тамақтану
          </h1>
          <p className="text-xs text-slate-400">
            Калория мен макронутриенттер күнделігі
          </p>
        </div>

        <button
          onClick={() => {
            setCustomFoodMode(false);
            setShowAddModal(true);
          }}
          className="px-3.5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Тағам қосу</span>
        </button>
      </div>

      {/* Daily Calories Big Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Бүгінгі калория</span>
          <span>Мақсат: {userProfile.dailyCalorieGoal} ккал</span>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-3xl font-display font-extrabold text-white font-tabular">
              {totalCalories}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">қабылданды</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-emerald-400 font-tabular">
              {calorieRemaining}
            </span>
            <span className="text-xs text-slate-400 ml-1">қалды</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalCalories > userProfile.dailyCalorieGoal ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${caloriePercent}%` }}
          />
        </div>

        {/* Macros: Protein, Fat, Carbs */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/70 text-center">
          {/* Protein */}
          <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/50">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ақуыз</span>
            <div className="text-base font-bold font-tabular text-emerald-400 mt-0.5">
              {Math.round(totalProtein)}г
              <span className="text-[10px] font-normal text-slate-500 block">/ {targetProtein}г</span>
            </div>
          </div>

          {/* Fat */}
          <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/50">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Май</span>
            <div className="text-base font-bold font-tabular text-amber-400 mt-0.5">
              {Math.round(totalFat)}г
              <span className="text-[10px] font-normal text-slate-500 block">/ {targetFat}г</span>
            </div>
          </div>

          {/* Carbs */}
          <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/50">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Көмірсу</span>
            <div className="text-base font-bold font-tabular text-blue-400 mt-0.5">
              {Math.round(totalCarbs)}г
              <span className="text-[10px] font-normal text-slate-500 block">/ {targetCarbs}г</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meals by Type */}
      <div className="space-y-4">
        {mealTypes.map(mType => {
          const typeMeals = loggedMeals.filter(m => m.mealType === mType);
          const typeCalories = typeMeals.reduce((acc, m) => acc + m.calories, 0);

          return (
            <div key={mType} className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800/70">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">{mType}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300 font-tabular">{typeCalories} ккал</span>
                  <button
                    onClick={() => {
                      setActiveMealType(mType);
                      setCustomFoodMode(false);
                      setShowAddModal(true);
                    }}
                    className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {typeMeals.length > 0 ? (
                <div className="space-y-2 mt-3">
                  {typeMeals.map(meal => (
                    <div
                      key={meal.id}
                      className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-medium text-slate-200">{meal.nameKz}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <span>{meal.amount}г</span>
                          <span>·</span>
                          <span>А: {meal.protein}г</span>
                          <span>·</span>
                          <span>М: {meal.fat}г</span>
                          <span>·</span>
                          <span>К: {meal.carbs}г</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-emerald-400 font-tabular">
                          {meal.calories} ккал
                        </span>
                        <button
                          onClick={() => onDeleteMeal(meal.id)}
                          className="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic py-1">Әлі ештеңе қосылмады</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-slate-900 border-t border-slate-800 rounded-t-3xl w-full max-w-lg p-6 max-h-[90vh] flex flex-col"
            >
              <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Тағам қосу</h3>
                  <span className="text-xs text-emerald-400 font-medium">{activeMealType}</span>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode switch: Database vs Custom */}
              <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl mb-4 text-xs">
                <button
                  onClick={() => setCustomFoodMode(false)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    !customFoodMode ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Тағамдар базасы
                </button>
                <button
                  onClick={() => setCustomFoodMode(true)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    customFoodMode ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Өз тағамыңды жазу
                </button>
              </div>

              {/* Serving Amount selector */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 mb-3 text-xs">
                <span className="text-slate-300">Тағам мөлшері:</span>
                <div className="flex items-center gap-1.5">
                  {[50, 100, 150, 200].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setAmountGrams(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-tabular transition-colors ${
                        amountGrams === amt ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {amt}г
                    </button>
                  ))}
                </div>
              </div>

              {!customFoodMode ? (
                <>
                  {/* Search bar */}
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Тағамды іздеу (Қымыз, сүзбе, тауық төсі...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Food Database list */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar my-1">
                    {filteredFoods.map(food => {
                      const factor = amountGrams / 100;
                      const calcCal = Math.round(food.calories * factor);
                      return (
                        <div
                          key={food.id}
                          onClick={() => handleSelectFood(food)}
                          className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between text-xs transition-all active:scale-[0.99]"
                        >
                          <div>
                            <h4 className="font-semibold text-white">{food.nameKz}</h4>
                            <span className="text-[10px] text-slate-400">
                              {food.categoryKz} · А: {Math.round(food.protein * factor)}г | М: {Math.round(food.fat * factor)}г | К: {Math.round(food.carbs * factor)}г
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-emerald-400 font-tabular text-sm">
                              +{calcCal}
                            </span>
                            <span className="text-[10px] text-slate-500 block">ккал</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Custom Food Form */
                <div className="space-y-3 flex-1 overflow-y-auto pr-1 no-scrollbar text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Тағам атауы:</label>
                    <input
                      type="text"
                      placeholder="Мысалы: Үйде жасалған ботқа"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Калория (ккал):</label>
                      <input
                        type="number"
                        value={customCalories}
                        onChange={(e) => setCustomCalories(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-tabular"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Ақуыз (г):</label>
                      <input
                        type="number"
                        value={customProtein}
                        onChange={(e) => setCustomProtein(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-tabular"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Май (г):</label>
                      <input
                        type="number"
                        value={customFat}
                        onChange={(e) => setCustomFat(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-tabular"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Көмірсу (г):</label>
                      <input
                        type="number"
                        value={customCarbs}
                        onChange={(e) => setCustomCarbs(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-tabular"
                      />
                    </div>
                  </div>

                  <button
                    disabled={!customName.trim()}
                    onClick={handleAddCustomMeal}
                    className="w-full mt-4 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-sm shadow-md transition-all"
                  >
                    Қосу
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
