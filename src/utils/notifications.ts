import { DailyLog, UserProfile } from '../types/fitness';
import { workoutAudio } from './audio';

export interface NotificationStatus {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
}

export const STORAGE_KEYS_NOTIFICATIONS = {
  SETTINGS: 'shynyq_notif_settings_v1',
  LAST_DISMISSED_DATE: 'shynyq_six_pm_last_dismissed_v1'
};

export function getNotificationStatus(): NotificationStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { isSupported: false, permission: 'unsupported' };
  }
  return {
    isSupported: true,
    permission: Notification.permission
  };
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return 'denied';
  }
}

export function sendBrowserPushNotification(title: string, options?: NotificationOptions): boolean {
  try {
    workoutAudio.playNotificationBell();
  } catch {}

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'shynyq_daily_activity_goal',
        ...options
      });
      return true;
    } catch {
      // Browsers or iframes might throw security errors, in which case in-app UI handles it
      return false;
    }
  }
  return false;
}

export interface ActivityGoalCheckResult {
  shouldAlert: boolean;
  reason: 'no_workouts' | 'calories_short' | 'steps_short' | 'all_completed';
  missingTextKz: string;
  totalCaloriesBurned: number;
  calorieTarget: number;
  workoutsCompleted: number;
  stepsCount: number;
  stepTarget: number;
  isPastSixPm: boolean;
}

export function evaluateDailyActivityGoal(
  dailyLog: DailyLog,
  userProfile: UserProfile,
  isForceTest = false
): ActivityGoalCheckResult {
  const now = new Date();
  const currentHour = now.getHours();
  const isPastSixPm = currentHour >= 18;

  const totalCaloriesBurned = dailyLog.completedWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const calorieTarget = userProfile.dailyCalorieGoal || 400;
  const workoutsCompleted = dailyLog.completedWorkouts.length;
  const stepsCount = dailyLog.steps;
  const stepTarget = userProfile.dailyStepGoal || 10000;

  // Has user completed activity goal?
  // Goal is met if at least 1 workout done AND either calorie target or steps are near/met
  const hasMetWorkout = workoutsCompleted >= 1;
  const hasMetCalories = totalCaloriesBurned >= 300;
  const hasMetSteps = stepsCount >= stepTarget;

  const isGoalMet = (hasMetWorkout && hasMetCalories) || (hasMetWorkout && hasMetSteps) || (hasMetCalories && hasMetSteps);

  if (isGoalMet && !isForceTest) {
    return {
      shouldAlert: false,
      reason: 'all_completed',
      missingTextKz: 'Керемет! Бүгінгі барлық мақсаттар орындалды.',
      totalCaloriesBurned,
      calorieTarget,
      workoutsCompleted,
      stepsCount,
      stepTarget,
      isPastSixPm
    };
  }

  // Determine primary missing factor
  let reason: 'no_workouts' | 'calories_short' | 'steps_short' = 'no_workouts';
  let missingTextKz = '';

  if (workoutsCompleted === 0) {
    reason = 'no_workouts';
    missingTextKz = 'Бүгін әлі бірде-бір жаттығу орындалмады! Күнді бос жібермеу үшін 10-15 минуттық серпінді жаттығу жасау ұсынылады.';
  } else if (!hasMetCalories) {
    reason = 'calories_short';
    missingTextKz = `Бүгін ${totalCaloriesBurned} ккал жағылды (мақсат: 400 ккал). Мақсатқа жету үшін тағы бір қысқа кешен орындаңыз!`;
  } else {
    reason = 'steps_short';
    missingTextKz = `Бүгін ${stepsCount} қадам жасалды (мақсат: ${stepTarget}). Кешкі серуенге шығуды ұсынамыз.`;
  }

  // Should trigger alert if it's 6 PM or later (or if testing)
  const shouldAlert = isForceTest || isPastSixPm;

  return {
    shouldAlert,
    reason,
    missingTextKz,
    totalCaloriesBurned,
    calorieTarget,
    workoutsCompleted,
    stepsCount,
    stepTarget,
    isPastSixPm
  };
}
