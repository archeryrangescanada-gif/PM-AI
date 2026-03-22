import { Link } from 'react-router-dom';
import { Wrench, ArrowRight, CheckCircle, Home, Shield, Users, Clock, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#060D1A', color: 'white' }}>
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#00D4AA' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl" style={{ background: '#00D4AA' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-6 h-6" style={{ color: '#00D4AA' }} />
              <span className="text-xl font-bold text-white">HROP</span>
            </div>
            <span className="px-2 py-0.5 text-xs font-semibold rounded" style={{ background: 'rgba(0,212,170,0.15)', color: '#00D4AA', border: '1px solid rgba(0,212,170,0.3)' }}>
              DURHAM REGION
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.6)' }}>How It Works</a>
            <a href="#pricing" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.6)' }}>Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm font-medium transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Sign In
            </Link>
            <Link
              to="/auth"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: '#00D4AA', color: '#060D1A' }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 border" style={{ background: 'rgba(0,212,170,0.1)', borderColor: 'rgba(0,212,170,0.3)', color: '#00D4AA' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00D4AA' }} />
              NOW LIVE IN DURHAM REGION
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-none tracking-tight">
              Maintenance<br />
              <span style={{ color: '#00D4AA' }}>handled.</span><br />
              While you sleep.
            </h1>
            <p className="text-lg mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Your maintenance coordinator called in sick. Again.<br />
              HROP doesn't. Tenants report. AI analyzes. You approve once. Done.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all hover:opacity-90"
                style={{ background: '#00D4AA', color: '#060D1A' }}
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold transition-all border"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Right — Dashboard mockup */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border shadow-2xl" style={{ background: '#0D1F35', borderColor: 'rgba(255,255,255,0.08)' }}>
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>HROP · Live Dashboard</span>
                <div className="w-16" />
              </div>

              {/* Ticket 1 - Urgent */}
              <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-sm text-white">Leaky faucet — Unit 4B</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>4 min ago · 123 Main St, Oshawa</div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold rounded" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>URGENT</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="px-2 py-0.5 text-xs rounded" style={{ background: 'rgba(0,212,170,0.15)', color: '#00D4AA' }}>AI: $120–180</span>
                  <span className="px-2 py-0.5 text-xs rounded" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>Plumbing</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90" style={{ background: '#00D4AA', color: '#060D1A' }}>
                    ✓ Approve
                  </button>
                  <button className="flex-1 py-2 rounded-lg text-xs font-semibold border transition-all" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
                    Adjust
                  </button>
                </div>
              </div>

              {/* Ticket 2 - In Progress */}
              <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm text-white">HVAC filter — Unit 2A</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Mike's HVAC · En route · ETA 25 min</div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold rounded" style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>IN PROGRESS</span>
                </div>
              </div>

              {/* Ticket 3 - Done */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm text-white">Door lock — Unit 7C</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Completed · $165 ·</span>
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold rounded" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>DONE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
          Built for everyone in property maintenance
        </h2>
        <p className="text-center mb-16" style={{ color: 'rgba(255,255,255,0.5)' }}>
          One platform. Three roles. Zero friction.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { Icon: Home, title: 'For Tenants', desc: 'Report issues quickly. Upload photos. Track progress. Get help when you need it.', features: ['Submit requests in seconds', 'Photo documentation required', 'Real-time status updates'] },
            { Icon: Shield, title: 'For Landlords', desc: 'Manage properties efficiently. Approve work instantly. Keep tenants happy.', features: ['Multi-property dashboard', 'AI-powered cost estimates', 'Verified service providers'] },
            { Icon: Users, title: 'For Service Providers', desc: 'Find work nearby. Get paid faster. Build your reputation.', features: ['Accept jobs on your terms', 'Track earnings in real-time', 'Build 5-star ratings'] },
          ].map(({ Icon, title, desc, features }) => (
            <div key={title} className="rounded-2xl p-8 border" style={{ background: '#0D1F35', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(0,212,170,0.15)' }}>
                <Icon className="w-6 h-6" style={{ color: '#00D4AA' }} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
              <p className="mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
              <ul className="space-y-2">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#00D4AA' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">How HROP works</h2>
          <div className="max-w-2xl mx-auto space-y-10">
            {[
              { n: '1', title: 'Tenant reports the issue', body: 'Tenants submit requests with photos (required). AI analyzes the issue and generates a cost estimate automatically.' },
              { n: '2', title: 'You approve in one click', body: 'Review the AI estimate and approve. Backstop payment ensures jobs never stall — even if the tenant can\'t pay.' },
              { n: '3', title: 'Provider fixes it', body: 'Verified professionals accept, complete, and close the job. Everyone gets real-time updates the whole way through.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: 'rgba(0,212,170,0.15)', color: '#00D4AA', border: '1px solid rgba(0,212,170,0.3)' }}>
                  {n}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)' }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">Simple pricing</h2>
          <p className="text-center mb-16" style={{ color: 'rgba(255,255,255,0.5)' }}>Per door, per month. No setup fees. Cancel anytime.</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Basic', price: '$5', unit: '/door/mo', desc: 'For small landlords getting started.', features: ['Up to 10 units', 'Tenant request portal', 'Email notifications', 'Basic reporting'], highlight: false },
              { name: 'Pro', price: '$9', unit: '/door/mo', desc: 'Most popular. Everything you need.', features: ['Unlimited units', 'AI cost estimates', 'Verified providers', 'LTB paper trail', 'Priority support'], highlight: true },
              { name: 'Enterprise', price: '$15+', unit: '/door/mo', desc: 'For large PM companies.', features: ['Custom integrations', 'Dedicated account manager', 'SLA guarantee', 'White-label options'], highlight: false },
            ].map(({ name, price, unit, desc, features, highlight }) => (
              <div key={name} className="rounded-2xl p-8 border relative" style={{ background: highlight ? 'rgba(0,212,170,0.08)' : '#0D1F35', borderColor: highlight ? 'rgba(0,212,170,0.4)' : 'rgba(255,255,255,0.08)' }}>
                {highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#00D4AA', color: '#060D1A' }}>MOST POPULAR</div>}
                <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-white">{price}</span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{unit}</span>
                </div>
                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
                <ul className="space-y-2 mb-8">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#00D4AA' }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  className="block w-full py-3 rounded-xl text-sm font-semibold text-center transition-all hover:opacity-90"
                  style={{ background: highlight ? '#00D4AA' : 'rgba(255,255,255,0.08)', color: highlight ? '#060D1A' : 'rgba(255,255,255,0.8)' }}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Plus 12% commission on completed jobs. 30 days free, no credit card required.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto rounded-2xl p-12 border" style={{ background: '#0D1F35', borderColor: 'rgba(0,212,170,0.2)' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to sleep through maintenance?</h2>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>30 days free. No credit card required.</p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:opacity-90"
              style={{ background: '#00D4AA', color: '#060D1A' }}
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5" style={{ color: '#00D4AA' }} />
            <span className="text-lg font-bold text-white">HROP</span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} HROP. Fix It Fast.
          </p>
        </div>
      </footer>
    </div>
  );
}
