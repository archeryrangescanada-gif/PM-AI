import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'hrop2026') {
      localStorage.setItem('hrop_admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect PIN');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#0C1628' }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{ backgroundColor: '#111F36', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(0,153,168,0.15)' }}
          >
            <Lock className="w-7 h-7" style={{ color: '#0099A8' }} />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-gray-400 text-sm mt-1">Enter PIN to continue</p>
        </div>

        <input
          type="password"
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(''); }}
          placeholder="Enter PIN"
          className="w-full px-4 py-3 rounded-lg text-white text-center text-lg tracking-widest mb-4 outline-none focus:ring-2"
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            focusRingColor: '#0099A8',
          }}
          autoFocus
        />

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold text-white transition-colors cursor-pointer"
          style={{ backgroundColor: '#0099A8' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007A88')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0099A8')}
        >
          Enter Dashboard
        </button>
      </form>
    </div>
  );
}
