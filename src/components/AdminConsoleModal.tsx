import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Check, 
  X, 
  Users, 
  FileText, 
  BarChart3, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';
import { workoutAudio } from '../utils/audio';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'moderation' | 'reports'>('moderation');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const [pendingItems, setPendingItems] = useState([
    {
      id: 'm1',
      title: '«Таңғы Crossfit 15 минут» жаттығуы',
      author: 'Айдос Нұрланұлы (Жаттықтырушы)',
      type: 'Жаттығу контенті',
      status: 'pending',
      date: '25 Қыркүйек, 09:12'
    },
    {
      id: 'm2',
      title: '«Кетогенді диета: майды азайту мәзірі» кеңесі',
      author: 'Нұргүл С. (Диетолог-маман)',
      type: 'Тамақтану мақаласы',
      status: 'pending',
      date: '24 Қыркүйек, 18:30'
    },
    {
      id: 'm3',
      title: 'Спортшы пікірі модерациясы',
      author: 'Ернар Б. (Қолданушы)',
      type: 'Пікір мен рейтинг',
      status: 'pending',
      date: '24 Қыркүйек, 15:45'
    }
  ]);

  const handleApprove = (id: string) => {
    workoutAudio.playNotificationBell();
    setPendingItems(prev => prev.filter(p => p.id !== id));
  };

  const handleReject = (id: string) => {
    workoutAudio.playWaterTap();
    setPendingItems(prev => prev.filter(p => p.id !== id));
  };

  const handleExportReport = () => {
    setIsExporting(true);
    workoutAudio.playNotificationBell();

    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1500);
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
          className="bg-slate-950 border-t sm:border border-purple-500/40 rounded-t-[36px] sm:rounded-3xl w-full max-w-lg p-5 max-h-[92vh] overflow-y-auto no-scrollbar relative"
        >
          {/* Mobile Handle */}
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-display text-white">
                    Жүйелік Әкімші панелі
                  </h3>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 font-semibold px-2 py-0.5 rounded-full border border-purple-500/30">
                    Secondary Actor
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Контент модерациясы мен жүйелік есептер
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setActiveTab('moderation')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'moderation'
                  ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>Жайлылық & Контент модерациясы</span>
              {pendingItems.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-white font-bold">
                  {pendingItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'reports'
                  ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Апталық статистика мен есептер</span>
            </button>
          </div>

          {/* Moderation Tab */}
          {activeTab === 'moderation' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Қаралуды күтудегі жазбалар:</span>
                <span className="font-tabular font-bold text-white">{pendingItems.length} элемент</span>
              </div>

              {pendingItems.length > 0 ? (
                pendingItems.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-md">
                          {item.type}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Авторы: {item.author} · {item.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Мақұлдау</span>
                      </button>

                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex-1 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Қабылдамау</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-xs font-bold text-white">Барлық контент модерациядан өтті</h4>
                  <p className="text-[11px] text-slate-400">Жүйе таза, жаңа өтінімдер жоқ</p>
                </div>
              )}
            </div>
          )}

          {/* Reports & System Stats Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-3.5">
              {/* System KPIs */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <div className="text-base font-bold font-tabular text-white">1,420</div>
                  <span className="text-[10px] text-slate-400">Белсенді спортшы</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <BarChart3 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <div className="text-base font-bold font-tabular text-white">8,940</div>
                  <span className="text-[10px] text-slate-400">Орындалған жаттығу</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <FileText className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <div className="text-base font-bold font-tabular text-white">99.8%</div>
                  <span className="text-[10px] text-slate-400">Жүйе тұрақтылығы</span>
                </div>
              </div>

              {/* Weekly Analytics Box */}
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">
                    Апталық жүйелік есеп (19–25 Қыркүйек 2026)
                  </h4>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                    Дайын
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Қолданушылар апта ішінде жалпы <strong>1,840,000 ккал</strong> жақты, смарт-сағаттармен <strong>3,420 синхрондау</strong> жасалды және жаттықтырушылар чатында <strong>480 кеңес</strong> берілді.
                </p>

                <button
                  onClick={handleExportReport}
                  disabled={isExporting}
                  className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-purple-500/20 disabled:opacity-50"
                >
                  <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
                  <span>{isExporting ? 'Есеп дайындалуда...' : 'Апталық есепті экспорттау (PDF / CSV)'}</span>
                </button>

                {exportSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center text-xs text-emerald-300 font-semibold animate-fade-in">
                    ✓ Апталық жүйелік есеп жүктелді!
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
