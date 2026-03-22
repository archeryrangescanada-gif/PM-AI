import { Link } from 'react-router-dom';
import { Wrench, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ background: '#0C1628', color: 'white', minHeight: '100vh' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(12,22,40,0.9)', backdropFilter: 'blur(12px)' }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0099A8' }}>
            <Wrench className="w-4 h-4" style={{ color: '#0C1628' }} />
          </div>
          <span className="text-xl font-bold text-white">HROP</span>
        </Link>
        <Link to="/auth" className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: '#0099A8', color: '#0C1628' }}>Get Started</Link>
      </nav>

      <div className="container mx-auto px-6 py-20 max-w-3xl">
        <h1 className="text-5xl font-black mb-6 text-white">About HROP</h1>
        <p className="text-xl mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          HROP — which means "Help" in Ukrainian — was built because property maintenance is broken. Landlords chase contractors. Tenants wait weeks. Service providers scramble for steady work. Everyone loses.
        </p>
        <p className="text-lg mb-16 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          We built a three-sided marketplace that connects all three. Tenants report, landlords approve, and vetted professionals fix it fast. AI handles the estimates. Payments are automatic. Paper trails are built in.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { Icon: Target, title: 'Our Mission', desc: 'Make property maintenance so simple it happens in the background — while landlords sleep, tenants live comfortably, and professionals grow their business.' },
            { Icon: Users, title: 'Who We Serve', desc: 'Property managers and landlords with 3–500 units across Ontario. Starting in Durham Region, expanding province-wide.' },
            { Icon: Zap, title: 'How We Started', desc: 'Built in Durham Region by founders who got tired of watching property managers drown in maintenance coordination that should be automated.' },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-6 border" style={{ background: '#111F36', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(0,153,168,0.15)' }}>
                <Icon className="w-5 h-5" style={{ color: '#0099A8' }} />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-10 text-center border" style={{ background: '#111F36', borderColor: 'rgba(0,153,168,0.2)' }}>
          <h2 className="text-3xl font-black text-white mb-4">Ready to fix maintenance for good?</h2>
          <Link to="/auth?signup=1" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all hover:opacity-90" style={{ background: '#0099A8', color: '#0C1628' }}>
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
