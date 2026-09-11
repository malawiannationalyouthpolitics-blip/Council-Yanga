import { useState } from 'react';
import { ArrowLeft, Lock, Mail, Shield, Eye, EyeOff, KeyRound } from 'lucide-react';
import { CheckIcon, ThreeDotsLoading } from '@/components/shared';
import { Logo } from '@/components/shared';

interface Props {
  onLogin: (email: string, password: string) => string | null;
  onSignup: () => void;
  onBack: () => void;
  onResetPassword: (email: string, newPassword: string) => string | null;
}

type ForgotStep = 'email' | 'reset' | 'done';

function ForgotPasswordModal({ onReset, onClose }: {
  onReset: (email: string, newPassword: string) => string | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState<ForgotStep>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) { setError('Enter a valid email address.'); return; }
    // In a real app this would send a reset email. Here we go straight to reset.
    setStep('reset');
  }

  function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => {
      const err = onReset(email.trim().toLowerCase(), newPassword);
      if (err) { setError(err); setLoading(false); }
      else setStep('done');
    }, 400);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        {step === 'email' && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                <KeyRound size={18} className="text-[#145a32]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>Reset Password</h3>
                <p className="text-xs text-gray-400">Enter your account email to continue</p>
              </div>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#145a32] transition" />
              </div>
              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 text-sm bg-[#145a32] text-white font-semibold rounded-xl hover:bg-[#0f4424]">Continue</button>
              </div>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                <Lock size={18} className="text-[#145a32]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>Set New Password</h3>
                <p className="text-xs text-gray-400">{email}</p>
              </div>
            </div>
            <form onSubmit={handleReset} className="space-y-3">
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showNew ? 'text' : 'password'} required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min. 6 chars)"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#145a32] transition" />
                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showConfirm ? 'text' : 'password'} required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm new password"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#145a32] transition" />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setStep('email')} className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Back</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 text-sm bg-[#145a32] text-white font-semibold rounded-xl hover:bg-[#0f4424] disabled:opacity-60">
                  {loading ? 'Saving…' : 'Save Password'}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'done' && (
          <div className="text-center py-4">
            <CheckIcon size={40} className="mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-base mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Password Updated</h3>
            <p className="text-sm text-gray-500 mb-5">You can now log in with your new password.</p>
            <button onClick={onClose} className="w-full py-2.5 text-sm bg-[#145a32] text-white font-semibold rounded-xl hover:bg-[#0f4424]">Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage({ onLogin, onSignup, onBack, onResetPassword }: Props) {
  const [role, setRole] = useState<'admin' | 'monitor' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!role) { setError('Please select your role.'); return; }
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setTimeout(() => {
      const err = onLogin(email.trim().toLowerCase(), password);
      if (err) { setError(err); setLoading(false); }
    }, 300);
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex flex-col">
      <header className="bg-[#145a32] px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to Public Portal</span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Logo className="h-28 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Staff Login</h1>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 shadow-md p-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Select your role</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button type="button" onClick={() => setRole('admin')} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === 'admin' ? 'border-[#145a32] bg-green-50 text-[#145a32]' : 'border-gray-200 text-gray-500 hover:border-green-300'}`}>
                <Shield size={24} /><span className="text-sm font-semibold">Admin</span><span className="text-xs text-center leading-tight opacity-70">Council Officer</span>
              </button>
              <button type="button" onClick={() => setRole('monitor')} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === 'monitor' ? 'border-[#145a32] bg-green-50 text-[#145a32]' : 'border-gray-200 text-gray-500 hover:border-green-300'}`}>
                <Eye size={24} /><span className="text-sm font-semibold">Monitor</span><span className="text-xs text-center leading-tight opacity-70">Field Verifier</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#145a32] transition" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-[#145a32] font-semibold hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#145a32] transition" />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

              <button type="submit" disabled={loading} className="w-full bg-[#145a32] hover:bg-[#0f4424] disabled:opacity-75 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span>Signing in</span>
                    <ThreeDotsLoading dotColor="bg-white" size="w-2 h-2" />
                  </span>
                ) : (
                  'Login to Dashboard'
                )}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Don&#39;t have an account?{' '}
                <button onClick={onSignup} className="text-[#145a32] font-semibold hover:underline">Sign up</button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {showForgot && (
        <ForgotPasswordModal
          onReset={onResetPassword}
          onClose={() => setShowForgot(false)}
        />
      )}
    </div>
  );
}
