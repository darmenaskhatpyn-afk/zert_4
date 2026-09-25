import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCode, 
  X, 
  ExternalLink, 
  Users, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  Play,
  ArrowRight
} from 'lucide-react';

interface UmlUseCaseViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCoachChat: () => void;
  onOpenSmartwatchSync: () => void;
  onOpenAdminConsole: () => void;
  onOpenWorkoutsCatalog: () => void;
  onOpenWeeklySummary: () => void;
}

export const UmlUseCaseViewerModal: React.FC<UmlUseCaseViewerModalProps> = ({
  isOpen,
  onClose,
  onOpenCoachChat,
  onOpenSmartwatchSync,
  onOpenAdminConsole,
  onOpenWorkoutsCatalog,
  onOpenWeeklySummary
}) => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'actors' | 'qa'>('diagram');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="bg-slate-950 border-t sm:border border-emerald-500/40 rounded-t-[36px] sm:rounded-3xl w-full max-w-2xl p-5 max-h-[92vh] overflow-y-auto no-scrollbar relative"
        >
          {/* Mobile Handle */}
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  №4 Зертханалық жұмыс есебі
                </span>
                <span className="text-xs text-slate-400">Вариант №7</span>
              </div>
              <h3 className="text-lg font-bold font-display text-white mt-1">
                Мобильді фитнес қосымшасы (UML Use Case)
              </h3>
              <p className="text-xs text-slate-400">
                Студент: <strong className="text-white">Дәрмен Асхат</strong> · Бағдарламалық инженерия
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setActiveTab('diagram')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'diagram'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Use Case Диаграммасы</span>
            </button>

            <button
              onClick={() => setActiveTab('actors')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'actors'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>4 Актор сипаттамасы</span>
            </button>

            <button
              onClick={() => setActiveTab('qa')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'qa'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Бақылау сұрақтары</span>
            </button>
          </div>

          {/* Tab 1: Interactive UML Diagram representation */}
          {activeTab === 'diagram' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="text-center pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                    «Мобильді фитнес қосымшасы» жүйелік шекарасы
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Элементті басып, қосымшадағы нақты функционалды іске қосыңыз
                  </p>
                </div>

                {/* 1. Coach to special program & chat */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-center">
                  <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/40 text-center">
                    <span className="text-[10px] font-bold text-amber-400 block uppercase">Бастапқы Актор</span>
                    <strong className="text-xs text-white">Фитнес-Жаттықтырушы</strong>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <button
                      onClick={() => { onClose(); onOpenCoachChat(); }}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 text-left flex items-center justify-between text-xs group transition-all"
                    >
                      <span className="text-emerald-300 font-medium">💬 Жаттықтырушымен онлайн чат</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      onClick={() => { onClose(); onOpenCoachChat(); }}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-400 text-left flex items-center justify-between text-xs group transition-all"
                    >
                      <span className="text-slate-200">📋 Арнайы жаттығу бағдарламасын енгізу</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                {/* 2. Primary User Flows */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-center pt-2 border-t border-slate-800">
                  <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 text-center">
                    <span className="text-[10px] font-bold text-emerald-400 block uppercase">Бастапқы Актор</span>
                    <strong className="text-xs text-white">Студент / Спортшы (Пайдаланушы)</strong>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <button
                      onClick={() => { onClose(); onOpenWorkoutsCatalog(); }}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-400 text-left flex items-center justify-between text-xs group transition-all"
                    >
                      <span className="text-slate-200">🔍 Жаттығулар каталогын қарау және сүзілеу</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </button>

                    {/* Include relation */}
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-200">
                        <span>🔐 Жүйеге тіркелу және авторизация</span>
                        <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                          &lt;&lt;include&gt;&gt;
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 pl-4 border-l-2 border-blue-500/40">
                        ➔ Профильді баптау (бойы, салмағы, жасы, калория мақсаты)
                      </p>
                    </div>

                    {/* Extend relation with Smartwatch */}
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-200">
                        <span>📊 Күнделікті калория мен белсенділікті тіркеу</span>
                        <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                          &lt;&lt;extend&gt;&gt;
                        </span>
                      </div>
                      <div className="flex items-center justify-between pl-4 border-l-2 border-cyan-500/40 text-[11px] text-cyan-300">
                        <span>➔ Деректерді смарт-сағатпен синхрондау</span>
                        <button
                          onClick={() => { onClose(); onOpenSmartwatchSync(); }}
                          className="px-2 py-0.5 bg-cyan-500 text-slate-950 font-bold rounded text-[10px] active:scale-95"
                        >
                          Сағатты ашу ⌚
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. External System: Smartwatch */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-center pt-2 border-t border-slate-800">
                  <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 text-center">
                    <span className="text-[10px] font-bold text-cyan-400 block uppercase">Сыртқы жүйе</span>
                    <strong className="text-xs text-white">Смарт-сағат / API (Apple Health / Fit)</strong>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      onClick={() => { onClose(); onOpenSmartwatchSync(); }}
                      className="w-full p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 hover:border-cyan-400 text-left flex items-center justify-between text-xs group transition-all"
                    >
                      <span className="text-cyan-300 font-medium">⌚ Деректерді смарт-сағатпен авто-синхрондау</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                {/* 4. Admin Actor */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-center pt-2 border-t border-slate-800">
                  <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/40 text-center">
                    <span className="text-[10px] font-bold text-purple-400 block uppercase">Әкімшілік Актор</span>
                    <strong className="text-xs text-white">Жүйелік Әкімші</strong>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <button
                      onClick={() => { onClose(); onOpenAdminConsole(); }}
                      className="w-full p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/40 hover:border-purple-400 text-left flex items-center justify-between text-xs group transition-all"
                    >
                      <span className="text-purple-300 font-medium">🛡️ Жайлылық және контент модерациясы</span>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      onClick={() => { onClose(); onOpenWeeklySummary(); }}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-400 text-left flex items-center justify-between text-xs group transition-all"
                    >
                      <span className="text-slate-200">📈 Апталық статистика мен есептер шығару</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: 4 Actors details */}
          {activeTab === 'actors' && (
            <div className="space-y-3">
              {[
                {
                  name: 'Пайдаланушы (Спортшы / Клиент)',
                  type: 'Бастапқы Актор (Primary Actor)',
                  role: 'Тіркеледі, жаттығу каталогын қарайды, жеке жоспар құрады, калория бақылайды, жаттықтырушыға сұрақ қояды.',
                  color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
                },
                {
                  name: 'Фитнес-Жаттықтырушы',
                  type: 'Бастапқы Актор (Primary Actor)',
                  role: 'Пайдаланушыларға арнайы жаттығу бағдарламаларын дайындайды және онлайн чат арқылы кеңес береді.',
                  color: 'border-amber-500/40 bg-amber-950/20 text-amber-400'
                },
                {
                  name: 'Жүйелік Әкімші',
                  type: 'Әкімшілік Актор (Secondary Actor)',
                  role: 'Контентті және жаттықтырушылар аккаунтын модерациялайды, жүйе статистикасы мен апталық есептерді қарастырады.',
                  color: 'border-purple-500/40 bg-purple-950/20 text-purple-400'
                },
                {
                  name: 'Смарт-сағат / API (Apple Health / Fit)',
                  type: 'Сыртқы жүйе (External System)',
                  role: 'Қолданушының қадамдарын, жүрек соғысын және жағылған калорияларын автоматты түрде қосымшаға жібереді.',
                  color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400'
                }
              ].map((a, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{a.name}</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${a.color}`}>
                      {a.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {a.role}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Q&A */}
          {activeTab === 'qa' && (
            <div className="space-y-2.5 text-xs text-slate-300">
              {[
                {
                  q: '1. Use Case диаграммасы не үшін қажет?',
                  a: 'Use Case диаграммасы бағдарламалық жүйенің ішкі кодын емес, оның сыртқы пайдаланушылармен (акторлармен) өзара байланысын, қызметтік функционалын және жүйе шекарасын визуализациялау үшін қажет.'
                },
                {
                  q: '2. Актер дегеніміз не?',
                  a: 'Актер (Actor) — жүйемен өзара әрекеттесетін сыртқы субъект, рөл немесе сыртқы ақпараттық жүйе (мысалы, Клиент, Жаттықтырушы, Әкімші, Смарт-сағат API).'
                },
                {
                  q: '3. Include және Extend байланыстарының айырмашылығы қандай?',
                  a: '«Include» (қосу) — басты Use Case орындалғанда міндетті түрде қоса аталатын ішкі функция (Тіркелу -> Профильді баптау). Ал «Extend» (кеңейту) — тек белгілі бір шарт орындалғанда ғана міндетті емес түрде қосылатын қосымша функция (Калория тіркеу -> Смарт-сағатпен синхрондау).'
                },
                {
                  q: '4. UML дегеніміз не?',
                  a: 'UML (Unified Modeling Language) — бағдарламалық жасақтама архитектурасы мен процестерін визуалды модельдеуге арналған халықаралық стандартталған графикалық тіл.'
                }
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-white text-xs">{item.q}</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
