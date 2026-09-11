import { useState, useRef } from 'react';
import { ArrowLeft, Shield, Eye, EyeOff, User, Mail, Lock, Camera } from 'lucide-react';
import { CheckIcon, ThreeDotsLoading } from '@/components/shared';
import { Logo } from '@/components/shared';
import type { User as UserType } from '@/data';

interface Props {
  onSignup: (user: UserType) => string | null;
  onBack: () => void;
}

export default function SignupPage({ onSignup, onBack }: Props) {
  const [role, setRole] = useState<'admin' | 'monitor' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { label: 'Weak', color: '#dc2626' };
    if (score === 2) return { label: 'Fair', color: '#d97706' };
    if (score === 3) return { label: 'Good', color: '#2563eb' };
    return { label: 'Strong', color: '#16a34a' };
  })();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!role) { setError('Please select your role.'); return; }
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setTimeout(() => {
      const newUser: UserType = {
        id: `U-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        joinDate: new Date().toISOString().slice(0, 10),
        photoUrl: photoUrl || undefined,
      };
      const err = onSignup(newUser);
      if (err) { setError(err); setLoading(false); }
    }, 400);
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex flex-col">
      {/* Header */}
      <header className="bg-[#145a32] px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to Login</span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <Logo className="h-24 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Create Account
            </h1>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 shadow-md p-6">
            {/* Role selection */}
            <p className="text-sm font-semibold text-gray-700 mb-3">I am signing up as</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === 'admin'
                    ? 'border-[#145a32] bg-green-50 text-[#145a32]'
                    : 'border-gray-200 text-gray-500 hover:border-green-300'
                }`}
              >
                <Shield size={24} />
                <span className="text-sm font-semibold">Admin</span>
                <span className="text-xs text-center leading-tight opacity-70">Council Officer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('monitor')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  role === 'monitor'
                    ? 'border-[#145a32] bg-green-50 text-[#145a32]'
                    : 'border-gray-200 text-gray-500 hover:border-green-300'
                }`}
              >
                <Eye size={24} />
                <span className="text-sm font-semibold">Monitor</span>
                <span className="text-xs text-center leading-tight opacity-70">Field Verifier</span>
              </button>
            </div>

            {role === 'monitor' && (
              <div className="mb-4 px-4 py-3 rounded-xl" style={{ background: '#016630', border: '1px solid #016630' }}>
                <p className="text-xs text-white font-medium leading-relaxed">
                  After signing up, your ward assignment will be configured by the Admin. You will receive an email notification with your assignment details.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Photo - monitors only */}
              {role === 'monitor' && (
                <div className="flex flex-col items-center gap-2">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  <button type="button" onClick={() => fileRef.current?.click()} className="relative group">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover object-center border-4 border-[#145a32]/20" style={{ aspectRatio: '1/1' }} />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:border-[#145a32] transition-colors">
                        <Camera size={22} className="text-gray-400 group-hover:text-[#145a32] transition-colors" />
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 bg-[#145a32] text-white rounded-full p-1"><Camera size={10} /></span>
                  </button>
                  <p className="text-xs text-gray-400">Upload profile photo <span className="text-gray-300">(optional)</span></p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Grace Banda"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#145a32] transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@councilyanga.mw"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#145a32] transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#145a32] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${({ Weak: 25, Fair: 50, Good: 75, Strong: 100 }[passwordStrength.label] ?? 0)}%`,
                          background: passwordStrength.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#145a32] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {confirm && password === confirm && (
                    <span className="absolute right-9 top-1/2 -translate-y-1/2"><CheckIcon size={15} /></span>
                  )}
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#145a32] hover:bg-[#0f4424] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span>Creating Account</span>
                    <ThreeDotsLoading dotColor="bg-white" size="w-2 h-2" />
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="text-xs text-center text-gray-500 mt-4">
              Already have an account?{' '}
              <button onClick={onBack} className="text-[#145a32] font-semibold hover:underline">
                Log in
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
