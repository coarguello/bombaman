import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Lock, Loader2, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  mode: 'login' | 'register' | 'reset';
  onChangeMode: (mode: 'login' | 'register' | 'reset') => void;
}

export function AuthModal({ onClose, onSuccess, mode, onChangeMode }: AuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg('Email de recuperación enviado. Revisa tu bandeja de entrada.');
      } else if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onSuccess();
      } else if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        const coins = 0;
        const maxLevel = 1;
        const totalScore = 0;
        const inventory = ['body_default', 'glasses_sky', 'mouth_none', 'bomb_classic', 'fire_yellow'];
        const equippedSkin = { body: 'body_default', glasses: 'glasses_sky', mouth: 'mouth_none', bomb: 'bomb_classic', fire: 'fire_yellow' };

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email: userCredential.user.email,
          createdAt: Date.now(),
          coins,
          maxUnlockedLevel: maxLevel,
          totalScore,
          inventory,
          equippedSkin
        });
        
        onSuccess();
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está en uso.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Credenciales incorrectas.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No se encontró cuenta con este correo.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError(err.message || 'Error de autenticación.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === 'login';
  const isReset = mode === 'reset';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-zinc-900 border-2 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-4 border-b-2 border-zinc-800 flex justify-between items-center bg-zinc-950">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            {isReset ? 'Recuperar Cuenta' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-xl transition-colors active:scale-95"
          >
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border-2 border-red-500/50 rounded-xl text-red-400 text-sm font-bold text-center">
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-xl text-emerald-400 text-sm font-bold text-center">
                {successMsg}
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                  Nombre de Jugador
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Tu alias arcade"
                    required
                    minLength={3}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="bombaman@arcade.com"
                  required
                />
              </div>
            </div>

            {!isReset && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                    Contraseña
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => onChangeMode('reset')}
                      className="text-xs text-yellow-400 hover:text-yellow-300 font-bold"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isReset ? 'ENVIAR ENLACE' : isLogin ? 'ENTRAR A JUGAR' : 'REGISTRARSE'}
            </button>
          </form>

          <div className="mt-6 text-center">
            {isLogin ? (
              <p className="text-zinc-400 text-sm">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => onChangeMode('register')}
                  className="text-white font-bold hover:text-yellow-400 transition-colors underline"
                >
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p className="text-zinc-400 text-sm">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => onChangeMode('login')}
                  className="text-white font-bold hover:text-yellow-400 transition-colors underline"
                >
                  Inicia sesión
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
