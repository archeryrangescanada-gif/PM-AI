import { Link } from 'react-router-dom';
import { Wrench, ArrowRight, CheckCircle, Home, Building2, Wrench as WrenchIcon, Star, Clock, Zap, DollarSign, Percent } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#060D1A', color: 'white', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-8 blur-3xl" style={{ background: '#00D4AA' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-6 blur-3xl" style={{ background: '#00D4AA' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(6,13,26,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0 }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#00D4AA' }}>
              <Wrench className="w-4 h-4" style={{ color: '#060D1A' }} />
            </div>
            <span className="text-xl font-bold text-white">HROP</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded" style={{ background: 'rgba(0,212,170,0.15)', color: '#00D4AA', border: '1px solid rgba(0,212,170,0.3)', letterSpacing: '0.05em' }}>
              DURHAM REGION
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.6)' }}>How It Works</a>
            <a href="#pricing" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.6)' }}>Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm font-medium transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.7)' }}>Sign In</Link>
            <Link to="/auth" className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90" style={{ background: '#00D4AA', color: '#060D1A' }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-8 border" style={{ background: 'rgba(0,212,170,0.1)', borderColor: 'rgba(0,212,170,0.3)', color: '#00D4AA', letterSpacing: '0.05em' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00D4AA' }} />
              NOW LIVE IN DURHAM REGION
            </div>
            <h1 className="font-black mb-6 leading-none tracking-tight" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}>
              Maintenance<br />
              <span style={{ color: '#00D4AA' }}>handled.</span><br />
              While you sleep.
            </h1>
            <p className="text-lg mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Your maintenance coordinator called in sick. Again.<br />
              HROP doesn't. Tenants report. AI analyzes. You approve once. Done.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth" className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:opacity-90" style={{ background: '#00D4AA', color: '#060D1A' }}>
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-semibold transition-all border" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                See How It Works
              </a>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border shadow-2xl" style={{ background: '#0D1F35', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>HROP · Live Dashboard</span>
                <div className="w-16" />
              </div>
              {[
                { title: 'Leaky faucet — Unit 4B', meta: '4 min ago · 123 Main St, Oshawa', badge: 'URGENT', badgeBg: 'rgba(239,68,68,0.2)', badgeColor: '#f87171', badgeBorder: 'rgba(239,68,68,0.3)', ai: 'AI: $120–180', cat: 'Plumbing', showActions: true },
                { title: 'HVAC filter — Unit 2A', meta: "Mike's HVAC · En route · ETA 25 min", badge: 'IN PROGRESS', badgeBg: 'rgba(59,130,246,0.2)', badgeColor: '#60a5fa', badgeBorder: 'rgba(59,130,246,0.3)', showActions: false },
                { title: 'Door lock — Unit 7C', meta: 'Completed · $165', badge: 'DONE', badgeBg: 'rgba(16,185,129,0.2)', badgeColor: '#34d399', badgeBorder: 'rgba(16,185,129,0.3)', stars: true, showActions: false },
              ].map((item, i) => (
                <div key={i} className="p-4 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm text-white">{item.title}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.meta}</span>
                        {item.stars && [...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-bold rounded whitespace-nowrap" style={{ background: item.badgeBg, color: item.badgeColor, border: `1px solid ${item.badgeBorder}` }}>{item.badge}</span>
                  </div>
                  {item.ai && (
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-0.5 text-xs rounded font-medium" style={{ background: 'rgba(0,212,170,0.15)', color: '#00D4AA' }}>{item.ai}</span>
                      <span className="px-2 py-0.5 text-xs rounded" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>{item.cat}</span>
                    </div>
                  )}
                  {item.showActions && (
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-lg text-xs font-bold" style={{ background: '#00D4AA', color: '#060D1A' }}>✓ Approve</button>
                      <button className="flex-1 py-2 rounded-lg text-xs font-semibold border" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>Adjust</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative z-10 border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,212,170,0.04)' }}>
        <div className="container mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '< 5 min', label: 'Average response time' },
            { value: '94%', label: 'Resolved without a call' },
            { value: 'Free', label: 'For tenants, always' },
            { value: '12%', label: 'Fee on completed jobs only' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-4xl font-black mb-2" style={{ color: '#00D4AA' }}>{value}</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Process */}
      <section id="how-it-works" className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#00D4AA' }}>THE PROCESS</div>
            <h2 className="font-black leading-none" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
              From report to resolved.<br />Automatically.
            </h2>
            <p className="mt-4 text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>Five steps. Zero phone calls.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { n: '01', Icon: Home, title: 'Tenant reports', desc: 'Photo + description in 60 seconds.' },
              { n: '02', Icon: Zap, title: 'AI analyzes', desc: 'Categorized and estimated instantly.' },
              { n: '03', Icon: CheckCircle, title: 'You approve', desc: 'One tap. No calls. No chasing.' },
              { n: '04', Icon: WrenchIcon, title: 'Pro accepts', desc: 'Local vetted pro takes the job.' },
              { n: '05', Icon: Star, title: 'Done & rated', desc: 'Paid, reviewed, logged.' },
            ].map(({ n, Icon, title, desc }) => (
              <div key={n} className="rounded-2xl p-6 border" style={{ background: '#0D1F35', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="text-xs font-bold mb-4" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>{n}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(0,212,170,0.15)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#00D4AA' }} />
                </div>
                <div className="font-bold text-white mb-1">{title}</div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#00D4AA' }}>WHO IT'S FOR</div>
            <h2 className="font-black leading-none" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
              Built for everyone<br />in the loop.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: Home, label: 'TENANTS', title: 'Report it and forget it.', desc: 'Submit in 60 seconds. Upload a photo. Track progress in real time. Never chase anyone again.' },
              { Icon: Building2, label: 'LANDLORDS', title: 'Approve once. We handle the rest.', desc: 'AI cost estimates. Vetted pros. Automatic invoicing. Stop managing maintenance. Start owning property.' },
              { Icon: WrenchIcon, label: 'SERVICE PROS', title: 'Steady work. Fast pay.', desc: 'Jobs come to you. Accept what fits your schedule. Get paid within 48 hours. Build your reputation.' },
            ].map(({ Icon, label, title, desc }) => (
              <div key={label} className="rounded-2xl p-8 border" style={{ background: '#0D1F35', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(0,212,170,0.15)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#00D4AA' }} />
                </div>
                <div className="text-xs font-bold tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                <h3 className="text-xl font-black text-white mb-3 leading-tight">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#00D4AA' }}>WHAT THEY SAY</div>
            <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
              Landlords love not thinking<br />about maintenance.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: 'I approved a plumbing request from my phone at 6 AM. By noon it was fixed. I never even made a call.', name: 'Sarah M.', loc: 'Oshawa · Managing 12 units' },
              { quote: 'Tenant messaged me at 11 PM about a furnace. I told them to use HROP. Handled by morning. I slept fine.', name: 'David K.', loc: 'Whitby · 3 properties' },
              { quote: 'The AI estimate was within $30 of the actual invoice. That kind of accuracy builds real trust.', name: 'Jennifer L.', loc: 'Ajax · Property Management Co.' },
            ].map(({ quote, name, loc }) => (
              <div key={name} className="rounded-2xl p-8 border" style={{ background: '#0D1F35', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#00D4AA' }} />)}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.8)' }}>"{quote}"</p>
                <div>
                  <div className="font-bold text-sm text-white">{name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#00D4AA' }}>PRICING</div>
            <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>Simple pricing. No surprises.</h2>
            <p className="mt-4 text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>Start free. Pay only when it works.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                tier: 'BASIC', price: '$5', unit: '/door/month', desc: 'Small portfolios',
                features: ['Maintenance triage', 'Vendor routing', 'Tenant communication', 'Request tracking'],
                cta: 'Start Free Trial', ctaStyle: { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' },
                highlight: false,
              },
              {
                tier: 'PRO', price: '$9', unit: '/door/month', desc: 'Most popular',
                features: ['Everything in Basic', 'AI cost estimates', 'Invoice processing', 'Vendor scores', 'Priority matching'],
                cta: 'Start Free Trial', ctaStyle: { background: '#00D4AA', color: '#060D1A' },
                highlight: true,
              },
              {
                tier: 'ENTERPRISE', price: '$15+', unit: '/door/month', desc: 'Large portfolios',
                features: ['Everything in Pro', 'Custom integrations', 'Account manager', 'SLA guarantees', 'Volume pricing'],
                cta: 'Contact Us', ctaStyle: { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' },
                highlight: false,
              },
            ].map(({ tier, price, unit, desc, features, cta, ctaStyle, highlight }) => (
              <div key={tier} className="rounded-2xl p-8 border relative" style={{ background: highlight ? 'rgba(0,212,170,0.06)' : '#0D1F35', borderColor: highlight ? 'rgba(0,212,170,0.35)' : 'rgba(255,255,255,0.08)' }}>
                {highlight && (
                  <div className="absolute left-1/2 -translate-x-1/2 -top-3.5 px-4 py-1 rounded-full text-xs font-black" style={{ background: '#00D4AA', color: '#060D1A', letterSpacing: '0.05em' }}>
                    MOST POPULAR
                  </div>
                )}
                <div className="text-xs font-bold tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>{tier}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-black" style={{ fontSize: '3rem', color: highlight ? '#00D4AA' : 'white', lineHeight: 1 }}>{price}</span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{unit}</span>
                </div>
                <div className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</div>
                <ul className="space-y-2.5 mb-8">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#00D4AA' }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/auth" className="block w-full py-3.5 rounded-xl text-sm font-bold text-center transition-all hover:opacity-90" style={ctaStyle}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Plus 12% commission on completed jobs. 30-day free trial, no credit card required.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-black mb-4 leading-tight" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Ready to stop<br />managing maintenance?
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Join Durham Region property managers who actually sleep at night.
          </p>
          <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:opacity-90" style={{ background: '#00D4AA', color: '#060D1A' }}>
            Start Your 30-Day Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            No credit card · No commitment · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#00D4AA' }}>
              <Wrench className="w-3.5 h-3.5" style={{ color: '#060D1A' }} />
            </div>
            <span className="font-bold text-white">HROP</span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>— Fix It Fast</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>© 2026 HROP Inc.</p>
        </div>
      </footer>
    </div>
  );
}
