import { Workout } from '../types/fitness';
import { EXERCISE_CATALOG } from './exercises';

const getEx = (id: string) => {
  const item = EXERCISE_CATALOG.find(e => e.id === id);
  if (!item) throw new Error(`Exercise ${id} not found`);
  return {
    id: item.id,
    nameKz: item.nameKz,
    nameEn: item.nameEn,
    targetMuscleKz: item.targetMuscleKz,
    type: item.type,
    durationOrReps: item.durationOrReps,
    restSeconds: item.restSeconds,
    instructionsKz: item.instructionsKz,
    tipsKz: item.tipsKz,
    animType: item.animType
  };
};

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'w_morning_boost',
    titleKz: 'Таңғы қуат пен сергектік',
    subtitleKz: 'Денені ояту және зат алмасуды жеделдету',
    category: 'home',
    durationMinutes: 10,
    caloriesBurned: 95,
    difficulty: 'Бастаушы',
    targetMusclesKz: ['Бүкіл дене', 'Жүрек', 'Буындар'],
    descriptionKz: 'Күнді белсенді бастауға арналған 10 минуттық жеңіл әрі тиімді таңғы кешен. Қосымша құрал-жабдықтарды қажет етпейді.',
    accentColor: '#10B981', // emerald-500
    gradient: 'from-emerald-900/60 via-slate-900 to-slate-950',
    exercises: [
      { ...getEx('ex_jumping_jacks'), durationOrReps: 35, restSeconds: 15 },
      { ...getEx('ex_squat'), durationOrReps: 12, restSeconds: 20 },
      { ...getEx('ex_glute_bridge'), durationOrReps: 15, restSeconds: 20 },
      { ...getEx('ex_plank'), durationOrReps: 30, restSeconds: 15 },
      { ...getEx('ex_cobra_stretch'), durationOrReps: 30, restSeconds: 10 }
    ]
  },
  {
    id: 'w_full_body_power',
    titleKz: 'Толық дене күші мен тонусы',
    subtitleKz: 'Негізгі бұлшықет топтарын қатайту',
    category: 'strength',
    durationMinutes: 22,
    caloriesBurned: 185,
    difficulty: 'Орташа',
    targetMusclesKz: ['Кеуде', 'Аяқ', 'Қол', 'Пресс'],
    descriptionKz: 'Үй жағдайында жеке салмақпен орындалатын қуатты кешен. Бұлшықеттерді шынықтырып, мығым әрі сымбатты дене пішінін қалыптастырады.',
    accentColor: '#3B82F6', // blue-500
    gradient: 'from-blue-900/60 via-slate-900 to-slate-950',
    exercises: [
      { ...getEx('ex_jumping_jacks'), durationOrReps: 40, restSeconds: 20 },
      { ...getEx('ex_pushup'), durationOrReps: 12, restSeconds: 30 },
      { ...getEx('ex_squat'), durationOrReps: 18, restSeconds: 25 },
      { ...getEx('ex_dips'), durationOrReps: 12, restSeconds: 25 },
      { ...getEx('ex_lunges'), durationOrReps: 16, restSeconds: 25 },
      { ...getEx('ex_plank'), durationOrReps: 45, restSeconds: 20 },
      { ...getEx('ex_cobra_stretch'), durationOrReps: 35, restSeconds: 10 }
    ]
  },
  {
    id: 'w_hiit_fat_burn',
    titleKz: 'Жоғары қарқынды HIIT май жағу',
    subtitleKz: 'Максималды калория шығыны',
    category: 'cardio',
    durationMinutes: 18,
    caloriesBurned: 240,
    difficulty: 'Жетілдірілген',
    targetMusclesKz: ['Жүрек', 'Бүкіл дене', 'Төзімділік'],
    descriptionKz: 'Интервалды қарқынды жаттығу. Жүрек соғысын жеделдетіп, жаттығудан кейін де майдың қарқынды жағылуын қамтамасыз етеді.',
    accentColor: '#F97316', // orange-500
    gradient: 'from-orange-900/60 via-slate-900 to-slate-950',
    exercises: [
      { ...getEx('ex_jumping_jacks'), durationOrReps: 45, restSeconds: 15 },
      { ...getEx('ex_burpees'), durationOrReps: 10, restSeconds: 25 },
      { ...getEx('ex_mountain_climbers'), durationOrReps: 35, restSeconds: 20 },
      { ...getEx('ex_high_knees'), durationOrReps: 30, restSeconds: 20 },
      { ...getEx('ex_squat'), durationOrReps: 15, restSeconds: 20 },
      { ...getEx('ex_burpees'), durationOrReps: 8, restSeconds: 30 },
      { ...getEx('ex_plank'), durationOrReps: 40, restSeconds: 15 }
    ]
  },
  {
    id: 'w_steel_abs',
    titleKz: 'Тас баған баспасөз (Пресс)',
    subtitleKz: 'Тегіс іш және мықты бел корсеті',
    category: 'abs',
    durationMinutes: 14,
    caloriesBurned: 120,
    difficulty: 'Орташа',
    targetMusclesKz: ['Тік пресс', 'Қиғаш бұлшықеттер', 'Төменгі іш'],
    descriptionKz: 'Құрсақ қуысының барлық бөліктерін қамтитын мақсатты кешен. Белдің дұрыс тіктелуіне және іш майын азайтуға көмектеседі.',
    accentColor: '#8B5CF6', // violet-500
    gradient: 'from-violet-900/60 via-slate-900 to-slate-950',
    exercises: [
      { ...getEx('ex_crunch'), durationOrReps: 22, restSeconds: 20 },
      { ...getEx('ex_plank'), durationOrReps: 45, restSeconds: 25 },
      { ...getEx('ex_mountain_climbers'), durationOrReps: 30, restSeconds: 20 },
      { ...getEx('ex_glute_bridge'), durationOrReps: 16, restSeconds: 20 },
      { ...getEx('ex_crunch'), durationOrReps: 18, restSeconds: 20 },
      { ...getEx('ex_cobra_stretch'), durationOrReps: 35, restSeconds: 10 }
    ]
  },
  {
    id: 'w_legs_glutes',
    titleKz: 'Сымбатты аяқ және бөксе',
    subtitleKz: 'Төменгі бөлікті күшейту және көлем беру',
    category: 'home',
    durationMinutes: 16,
    caloriesBurned: 150,
    difficulty: 'Орташа',
    targetMusclesKz: ['Үлкен бөксе', 'Квадрицепс', 'Санның артқы жағы'],
    descriptionKz: 'Төменгі денеге арналған ең пайдалы функционалды жаттығулар. Буындарды нығайтып, бұлшықет тонусын арттырады.',
    accentColor: '#EC4899', // pink-500
    gradient: 'from-pink-900/60 via-slate-900 to-slate-950',
    exercises: [
      { ...getEx('ex_squat'), durationOrReps: 20, restSeconds: 25 },
      { ...getEx('ex_lunges'), durationOrReps: 18, restSeconds: 25 },
      { ...getEx('ex_glute_bridge'), durationOrReps: 20, restSeconds: 20 },
      { ...getEx('ex_high_knees'), durationOrReps: 30, restSeconds: 20 },
      { ...getEx('ex_squat'), durationOrReps: 15, restSeconds: 20 }
    ]
  },
  {
    id: 'w_relax_stretch',
    titleKz: 'Кешкі релакс және созылу',
    subtitleKz: 'Бұлшықетті босаңсыту және ұйқы сапасы',
    category: 'stretch',
    durationMinutes: 12,
    caloriesBurned: 55,
    difficulty: 'Бастаушы',
    targetMusclesKz: ['Омыртқа', 'Иық белдеуі', 'Жамбас буындары'],
    descriptionKz: 'Күнделікті күйзеліс пен шаршауды басатын тыныш жаттығу. Бұлшықеттердегі спазмды шешіп, буын икемділігін қалпына келтіреді.',
    accentColor: '#14B8A6', // teal-500
    gradient: 'from-teal-900/60 via-slate-900 to-slate-950',
    exercises: [
      { ...getEx('ex_glute_bridge'), durationOrReps: 12, restSeconds: 20 },
      { ...getEx('ex_plank'), durationOrReps: 25, restSeconds: 20 },
      { ...getEx('ex_cobra_stretch'), durationOrReps: 45, restSeconds: 15 },
      { ...getEx('ex_cobra_stretch'), durationOrReps: 45, restSeconds: 10 }
    ]
  }
];
