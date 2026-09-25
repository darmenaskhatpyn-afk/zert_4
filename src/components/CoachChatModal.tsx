import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  UserCheck, 
  Award, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Dumbbell, 
  ChevronRight,
  ShieldCheck,
  Play
} from 'lucide-react';
import { Workout } from '../types/fitness';
import { workoutAudio } from '../utils/audio';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  time: string;
  recommendedWorkout?: Workout;
}

interface CoachChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  workouts: Workout[];
  onStartWorkout: (workout: Workout) => void;
}

export const CoachChatModal: React.FC<CoachChatModalProps> = ({
  isOpen,
  onClose,
  workouts,
  onStartWorkout
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'coach',
      text: 'Сәлеметсіз бе, Дәрмен! Мен сіздің жеке фитнес-жаттықтырушыңыз — Айдос Нұрланұлымын (Спорт шебері, 8 жылдық тәжірибе). Бүгінгі жаттығу немесе тамақтану жоспарыңыз бойынша қандай сұрақтарыңыз бар?',
      time: '10:15'
    },
    {
      id: 'm2',
      sender: 'coach',
      text: 'Сіздің мақсатыңызға қарап, жарақат алмау үшін арнайы кешен дайындадым. Кез келген уақытта жаттығу техникасын сұрай аласыз!',
      time: '10:16',
      recommendedWorkout: workouts[1] || workouts[0]
    }
  ]);

  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    'Калория дефицитін қалай дұрыс ұстаймын?',
    'Жаттығу алдында не жеген дұрыс?',
    'Бүгінге арнайы жаттығу ұсыныңызшы',
    'Жүрек соғысы кардио кезінде қанша болу керек?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    workoutAudio.playWaterTap();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      time: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    // Simulated coach response
    setTimeout(() => {
      workoutAudio.playNotificationBell();
      let reply = 'Өте дұрыс сұрақ! Жаттығуды дұрыс тыныс алумен орындаңыз және күніне кемінде 2-2.5 литр су ішуді ұмытпаңыз.';
      let recWorkout: Workout | undefined = undefined;

      if (text.includes('тамақ') || text.includes('жеген')) {
        reply = 'Жаттығудан 1.5–2 сағат бұрын баяу көмірсулар (сұлы ботқасы, банан) жеген дұрыс. Толық асқазанмен қарқынды қимылдамаған жөн!';
      } else if (text.includes('калория')) {
        reply = 'Тәуліктік шығыныңыздан 300-400 ккал азайту жеткілікті. Күрт ашығу метаболизмді баяулатады.';
      } else if (text.includes('жаттығу') || text.includes('ұсыныңыз')) {
        reply = 'Мақсатыңыз үшін мен сізге мына арнайы бағдарламаны енгіздім. Бүгін осыны орындап көріңіз:';
        recWorkout = workouts[0];
      } else if (text.includes('жүрек') || text.includes('соғысы')) {
        reply = 'Кардио май жағу аймағы максималды жүрек соғысының 65-75% шамасында болуы тиіс (сіздің жасыңызға шамамен 125-145 соққы/мин).';
      }

      const coachMsg: Message = {
        id: `c_${Date.now()}`,
        sender: 'coach',
        text: reply,
        time: timeStr,
        recommendedWorkout: recWorkout
      };

      setMessages(prev => [...prev, coachMsg]);
    }, 1000);
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
          className="bg-slate-950 border-t sm:border border-slate-800 rounded-t-[36px] sm:rounded-3xl w-full max-w-lg h-[88vh] flex flex-col overflow-hidden relative"
        >
          {/* Mobile Handle */}
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto my-3 sm:hidden shrink-0" />

          {/* Coach Header Bar */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md">
                  АН
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 absolute -bottom-0.5 -right-0.5" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">Айдос Нұрланұлы</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-medium">Онлайн кеңес</span>
                  <span>·</span>
                  <span>Фитнес-Жаттықтырушы акторы</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Coach Recommended Workout Card Attachment */}
                  {m.recommendedWorkout && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <Dumbbell className="w-3 h-3" />
                          <span>Жаттықтырушының арнайы бағдарламасы</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-tabular">
                          {m.recommendedWorkout.durationMinutes} мин
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white mb-2">
                        {m.recommendedWorkout.titleKz}
                      </h4>

                      <button
                        onClick={() => {
                          onClose();
                          onStartWorkout(m.recommendedWorkout!);
                        }}
                        className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-slate-950" />
                        <span>Жаттығуды қазір бастау</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1 font-tabular">
                  {m.time}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 border-t border-slate-900 bg-slate-950/70 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap active:scale-95 transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Жаттықтырушыға сұрақ жазыңыз..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputVal.trim()}
              className="w-10 h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 flex items-center justify-center active:scale-95 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
