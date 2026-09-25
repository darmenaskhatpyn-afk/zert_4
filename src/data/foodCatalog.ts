import { FoodItem } from '../types/fitness';

export const FOOD_CATALOG: FoodItem[] = [
  // Ұлттық және дәстүрлі пайдалы тағамдар
  {
    id: 'f_kymyz',
    nameKz: 'Қымыз (Бие сүті)',
    categoryKz: 'Дәстүрлі сусындар',
    calories: 48,
    protein: 2.1,
    fat: 1.8,
    carbs: 5.0,
    servingUnit: '100 мл'
  },
  {
    id: 'f_shubat',
    nameKz: 'Шұбат (Түйе сүті)',
    categoryKz: 'Дәстүрлі сусындар',
    calories: 76,
    protein: 3.9,
    fat: 4.5,
    carbs: 5.2,
    servingUnit: '100 мл'
  },
  {
    id: 'f_kurt',
    nameKz: 'Құрт (Тұзсыз/аз тұзды)',
    categoryKz: 'Сүт өнімдері',
    calories: 260,
    protein: 25.0,
    fat: 10.0,
    carbs: 18.0,
    servingUnit: '100 г'
  },
  {
    id: 'f_beef_boiled',
    nameKz: 'Асылған жылқы немесе сиыр еті',
    categoryKz: 'Ет өнімдері',
    calories: 195,
    protein: 28.0,
    fat: 9.0,
    carbs: 0.0,
    servingUnit: '100 г'
  },

  // Ақуызға бай тағамдар
  {
    id: 'f_chicken_breast',
    nameKz: 'Тауық төсі (Пісірілген / Гриль)',
    categoryKz: 'Ет және құс',
    calories: 165,
    protein: 31.0,
    fat: 3.6,
    carbs: 0.0,
    servingUnit: '100 г'
  },
  {
    id: 'f_egg',
    nameKz: 'Тауық жұмыртқасы (Піскен)',
    categoryKz: 'Жұмыртқа',
    calories: 72,
    protein: 6.3,
    fat: 4.8,
    carbs: 0.4,
    servingUnit: '1 дана'
  },
  {
    id: 'f_cottage_cheese',
    nameKz: 'Сүзбе (Творог 5%)',
    categoryKz: 'Сүт өнімдері',
    calories: 121,
    protein: 16.5,
    fat: 5.0,
    carbs: 3.0,
    servingUnit: '100 г'
  },
  {
    id: 'f_salmon',
    nameKz: 'Лосось / Ақсерке балығы',
    categoryKz: 'Балық',
    calories: 208,
    protein: 20.4,
    fat: 13.0,
    carbs: 0.0,
    servingUnit: '100 г'
  },

  // Күрделі көмірсулар
  {
    id: 'f_buckwheat',
    nameKz: 'Қарақұмық ботқасы (Гречка)',
    categoryKz: 'Жармалар',
    calories: 110,
    protein: 4.2,
    fat: 1.1,
    carbs: 21.3,
    servingUnit: '100 г (піскен)'
  },
  {
    id: 'f_oatmeal',
    nameKz: 'Сұлы жармасы (Овсянка)',
    categoryKz: 'Жармалар',
    calories: 120,
    protein: 4.5,
    fat: 2.5,
    carbs: 20.0,
    servingUnit: '100 г (піскен)'
  },
  {
    id: 'f_brown_rice',
    nameKz: 'Қоңыр күріш ботқасы',
    categoryKz: 'Жармалар',
    calories: 112,
    protein: 2.6,
    fat: 0.9,
    carbs: 23.5,
    servingUnit: '100 г (піскен)'
  },

  // Көкөністер және салаттар
  {
    id: 'f_green_salad',
    nameKz: 'Қияр, қызанақ және зәйтүн майы салаты',
    categoryKz: 'Көкөністер',
    calories: 55,
    protein: 1.2,
    fat: 4.0,
    carbs: 3.8,
    servingUnit: '100 г'
  },
  {
    id: 'f_avocado',
    nameKz: 'Авокадо',
    categoryKz: 'Жеміс-жидек',
    calories: 160,
    protein: 2.0,
    fat: 15.0,
    carbs: 9.0,
    servingUnit: '100 г'
  },
  {
    id: 'f_apple',
    nameKz: 'Жасыл алма',
    categoryKz: 'Жеміс-жидек',
    calories: 52,
    protein: 0.3,
    fat: 0.2,
    carbs: 13.8,
    servingUnit: '1 дана'
  },
  {
    id: 'f_banana',
    nameKz: 'Банан',
    categoryKz: 'Жеміс-жидек',
    calories: 89,
    protein: 1.1,
    fat: 0.3,
    carbs: 22.8,
    servingUnit: '1 дана'
  },
  {
    id: 'f_nuts',
    nameKz: 'Грек жаңғағы немесе бадам',
    categoryKz: 'Жаңғақтар',
    calories: 195,
    protein: 6.0,
    fat: 18.0,
    carbs: 4.0,
    servingUnit: '30 г'
  }
];
