/// <reference types="vite/client" />
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Bug, Send, CheckCircle, Loader2, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import { User } from 'firebase/auth';

interface GameStateInfo {
  level: number;
  score: number;
  coins: number;
  playerPos: { x: number; y: number };
  equippedSkin: string;
}

interface BugReportModalProps {
  onClose: () => void;
  user: User | null;
  playerName: string | null;
  gameState: GameStateInfo;
}

type ReportCategory = 'gameplay' | 'visual' | 'audio' | 'suggestion' | 'other';

const CATEGORIES: { id: ReportCategory; label: string }[] = [
  { id: 'gameplay', label: 'Jugabilidad' },
  { id: 'visual', label: 'Gráficos' },
  { id: 'audio', label: 'Audio' },
  { id: 'suggestion', label: 'Sugerencia' },
  { id: 'other', label: 'Otro' }
];

export function BugReportModal({ onClose, user, playerName, gameState }: BugReportModalProps) {
  const [category, setCategory] = useState<ReportCategory>('gameplay');
  const [description, setDescription] = useState('');
  const [showTechData, setShowTechData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    
    // Preparar el Embed de Discord
    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("No Discord Webhook URL configured");
      alert("Error de configuración del reporte. Contacte al administrador.");
      setIsSubmitting(false);
      return;
    }

    const categoryLabel = CATEGORIES.find(c => c.id === category)?.label || category;
    
    const payload = {
      username: "Bombaman Bug Reporter",
      avatar_url: "https://i.imgur.com/V7R2T9A.png", // Un logo genérico de bomba
      embeds: [
        {
          title: `🐛 Nuevo Reporte: ${categoryLabel}`,
          color: 15158332, // Rojo/Naranja
          fields: [
            {
              name: "Descripción del Problema",
              value: description,
              inline: false
            },
            {
              name: "👤 Jugador",
              value: user ? `${playerName || 'Anónimo'} (${user.email})` : "Jugador Anónimo",
              inline: false
            },
            {
              name: "🎮 Nivel",
              value: gameState.level.toString(),
              inline: true
            },
            {
              name: "💰 Monedas",
              value: gameState.coins.toString(),
              inline: true
            },
            {
              name: "🏆 Score",
              value: gameState.score.toString(),
              inline: true
            },
            {
              name: "📍 Posición Jugador",
              value: `X: ${gameState.playerPos.x}, Y: ${gameState.playerPos.y}`,
              inline: true
            },
            {
              name: "👕 Skin",
              value: gameState.equippedSkin,
              inline: true
            },
            {
              name: "💻 Dispositivo",
              value: navigator.userAgent,
              inline: false
            }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`);
      }
      
      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (error) {
      console.error("Error submitting to Discord:", error);
      alert("Hubo un error al enviar el reporte. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-zinc-900 border border-zinc-700/50 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-3 text-emerald-400">
            <Bug className="w-6 h-6" />
            <h2 className="text-xl font-black uppercase tracking-widest">Reportar Bug</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {submitSuccess ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 gap-4 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">¡Enviado a Discord!</h3>
                  <p className="text-zinc-400 mt-2">Gracias por ayudarnos a mejorar el juego.</p>
                </div>
              </motion.div>
            ) : (
              <>
                {!user && (
                  <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-xl mb-2 text-sm text-orange-400">
                    Estás jugando de forma anónima. Tu reporte se enviará, pero no podremos responderte.
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    ¿De qué trata?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          category === cat.id 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    Descripción (Sé lo más claro posible)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Cuando intento agarrar una bomba extra en la jungla..."
                    className="w-full h-32 bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none transition-all"
                    required
                  />
                </div>

                <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/30">
                  <button
                    type="button"
                    onClick={() => setShowTechData(!showTechData)}
                    className="w-full flex items-center justify-between p-3 text-sm text-zinc-400 hover:bg-zinc-800/30 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Info className="w-4 h-4" /> Ver datos técnicos automáticos
                    </span>
                    {showTechData ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {showTechData && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 text-[10px] font-mono text-zinc-500 bg-zinc-950/30">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(gameState, null, 2)}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !description.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Enviar Reporte
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
