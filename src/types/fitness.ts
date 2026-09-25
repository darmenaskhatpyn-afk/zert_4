export type WorkoutCategory = 
  | 'all' 
  | 'home' 
  | 'strength' 
  | 'cardio' 
  | 'abs' 
  | 'stretch';

export type DifficultyLevel = 'Бастаушы' | 'Орташа' | 'Жетілдірілген';

export interface ExerciseItem {
  id: string;
  nameKz: string;
  nameEn: string;
  targetMuscleKz: string;
  type: 'seconds' | 'reps';
  durationOrReps: number;
  restSeconds: number;
  instructionsKz: string[];
  tipsKz: string;
  animType: 'squat' | 'pushup' | 'plank' | 'jumping_jacks' | 'lunges' | 'burpees' | 'mountain_climbers' | 'crunch' | 'dips' | 'glute_bridge' | 'high_knees' | 'cobra_stretch';
}

export interface Workout {
  id: string;
  titleKz: string;
  subtitleKz: string;
  category: WorkoutCategory;
  durationMinutes: number;
  caloriesBurned: number;
  difficulty: DifficultyLevel;
  targetMusclesKz: string[];
  descriptionKz: string;
  accentColor: string; // Tailwind color class or hex
  gradient: string;
  exercises: ExerciseItem[];
  isCustom?: boolean;
}

export interface FoodItem {
  id: string;
  nameKz: string;
  categoryKz: string;
  calories: number; // per 100g or serving
  protein: number;
  fat: number;
  carbs: number;
  servingUnit: string;
}

export interface LoggedMeal {
  id: string;
  foodId: string;
  nameKz: string;
  mealType: 'Таңғы ас' | 'Түскі ас' | 'Кешкі ас' | 'Тіскебасар';
  amount: number; // grams or units
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  timestamp: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  steps: number;
  waterMl: number;
  completedWorkouts: {
    workoutId: string;
    workoutTitleKz: string;
    durationMinutes: number;
    caloriesBurned: number;
    completedAt: string;
  }[];
  meals: LoggedMeal[];
}

export interface UserProfile {
  name: string;
  gender: 'male' | 'female';
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  dailyStepGoal: number;
  dailyWaterGoalMl: number;
  dailyCalorieGoal: number;
  goal: 'aryqtau' | 'bulshyqet' | 'tonus' | 'tozimdilik';
  soundEnabled: boolean;
}

export interface WeightHistoryPoint {
  date: string;
  weightKg: number;
}

export interface WeeklyDayData {
  date: string; // YYYY-MM-DD
  dayShortKz: string; // e.g. 'Сен', 'Жек', 'Дүй', etc.
  dayFullKz: string; // e.g. 'Дүйсенбі, 21 қыркүйек'
  caloriesBurned: number;
  workoutMinutes: number;
  steps: number;
  waterMl: number;
  workoutsCompleted: number;
  isToday?: boolean;
}

export interface HydrationSlot {
  id: string;
  time: string; // HH:mm e.g. '08:30'
  labelKz: string;
  recommendedMl: number;
  completed: boolean;
  completedAt?: string;
}

export interface HydrationSettings {
  remindersEnabled: boolean;
  intervalHours: number;
  wakeUpTime: string;
  sleepTime: string;
  soundEnabled: boolean;
}
