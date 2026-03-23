// v3 env vars set
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Wrench, ArrowRight, CheckCircle, Home, Star, Zap } from 'lucide-react';

// Animate number counting up
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(target / 60);
      const t = setInterval(() => {
        start += step;
        if (start >= target) { setVal(target); clearInterval(t); }
        else setVal(start);
      }, 24);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// Fade-up on scroll
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const TICKER_ITEMS = [
  '✓ Leaky faucet fixed · Toronto · $145',
  '✓ HVAC filter replaced · Ottawa · $89',
  '✓ Door lock repaired · Mississauga · $165',
  '✓ Drywall patched · Hamilton · $210',
  '✓ Electrical outlet · London · $130',
  '✓ Plumbing cleared · Brampton · $175',
  '✓ Window seal · Kitchener · $95',
  '✓ Furnace inspected · Windsor · $220',
  '✓ Appliance repair · Kingston · $155',
  '✓ Roof leak patched · Barrie · $310',
];

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % 5), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen blueprint-bg" style={{ color: 'white' }}>


      {/* Sticky Nav */}
      <nav className="relative z-20 border-b sticky top-0" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(6,13,26,0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0099A8' }}>
              <Wrench className="w-4 h-4" style={{ color: '#0C1628' }} />
            </div>
            <span className="text-xl font-bold">HROP</span>

          </div>
          <div className="hidden md:flex items-center gap-8">
            {['How It Works', 'Pricing'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.55)' }}>{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm font-medium hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>Sign In</Link>
            <Link to="/auth" className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90" style={{ background: '#0099A8', color: '#0C1628' }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>

            <h1 className="animate-fade-up-d1 font-black mb-6 leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)' }}>
              Maintenance<br />
              <span className="shimmer-text">handled.</span><br />
              While you sleep.
            </h1>
            <p className="animate-fade-up-d2 text-lg mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Your maintenance coordinator called in sick. Again.<br />
              HROP doesn't. Tenants report. AI analyzes. You approve once. Done.
            </p>
            <div className="animate-fade-up-d3 flex flex-col sm:flex-row gap-4">
              <Link to="/auth" className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold transition-all hover:opacity-90 hover:scale-105" style={{ background: '#0099A8', color: '#0C1628' }}>
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-semibold transition-all border hover:border-white/30" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                See How It Works
              </a>
            </div>
          </div>

          {/* Floating dashboard mockup */}
          <div className="animate-fade-in relative">
            <div className="animate-float-card rounded-2xl overflow-hidden border shadow-2xl" style={{ background: '#111F36', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 0 80px rgba(0,212,170,0.08)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                <div className="flex gap-1.5">
                  {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
                </div>
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>HROP · Live Dashboard</span>
                <div className="w-16" />
              </div>
              {[
                {
                  title: 'Leaky faucet — Unit 4B',
                  sub: '4 min ago · 123 King St, Toronto',
                  badge: 'URGENT', bg: 'rgba(239,68,68,0.18)', color: '#f87171', border: 'rgba(239,68,68,0.3)',
                  ai: 'AI: $120–180', cat: 'Plumbing',
                  actions: true,
                },
                {
                  title: 'HVAC filter — Unit 2A',
                  sub: "Pro HVAC Services · ETA 25 min",
                  badge: 'IN PROGRESS', bg: 'rgba(59,130,246,0.18)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)',
                  actions: false,
                },
                {
                  title: 'Door lock — Unit 7C',
                  sub: 'Completed · $165',
                  badge: 'DONE', bg: 'rgba(16,185,129,0.18)', color: '#34d399', border: 'rgba(16,185,129,0.3)',
                  stars: true, actions: false,
                },
              ].map((item, i) => (
                <div key={i} className="p-4 border-b last:border-0 transition-colors hover:bg-white/[0.02]" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm text-white">{item.title}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>{item.sub}</span>
                        {item.stars && [...Array(5)].map((_,j) => <Star key={j} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />)}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-bold rounded whitespace-nowrap" style={{ background: item.bg, color: item.color, border: `1px solid ${item.border}` }}>{item.badge}</span>
                  </div>
                  {item.ai && (
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-0.5 text-xs rounded font-semibold" style={{ background: 'rgba(0,153,168,0.15)', color: '#0099A8' }}>{item.ai}</span>
                      <span className="px-2 py-0.5 text-xs rounded" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' }}>{item.cat}</span>
                    </div>
                  )}
                  {item.actions && (
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90" style={{ background: '#0099A8', color: '#0C1628' }}>✓ Approve</button>
                      <button className="flex-1 py-2 rounded-lg text-xs font-semibold border transition-all" style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)' }}>Adjust</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Glow under card */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 blur-3xl opacity-20 rounded-full" style={{ background: '#0099A8' }} />
          </div>
        </div>
      </section>

      {/* Live ticker */}
      <div className="relative z-10 overflow-hidden border-y py-3" style={{ borderColor: 'rgba(0,153,168,0.12)', background: 'rgba(0,153,168,0.04)' }}>
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="mx-8 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: '#0099A8' }}>●</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <FadeUp>
        <section className="relative z-10 border-b py-16" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 5, suffix: ' min', label: 'Avg response time', pre: '< ' },
              { value: 94, suffix: '%', label: 'Resolved without a call', pre: '' },
              { value: 0, suffix: '', label: 'Cost to tenants', pre: 'Free' },
              { value: 12, suffix: '%', label: 'Fee on completed jobs only', pre: '' },
            ].map(({ value, suffix, label, pre }) => (
              <div key={label}>
                <div className="text-4xl font-black mb-2" style={{ color: '#0099A8' }}>
                  {pre === 'Free' ? 'Free' : pre === '< ' ? <>{'< '}<CountUp target={value} suffix={suffix} /></> : <CountUp target={value} suffix={suffix} />}
                </div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>
      </FadeUp>

      {/* How It Works - animated step highlight */}
      <section id="how-it-works" className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#0099A8', letterSpacing: '0.12em' }}>THE PROCESS</div>
            <h2 className="font-black leading-none" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
              From report to resolved.<br /><span className="shimmer-text">Automatically.</span>
            </h2>
            <p className="mt-4 text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>Five steps. Zero phone calls.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { n: '01', Icon: Home, title: 'Tenant reports', desc: 'Photo + description in 60 seconds.' },
              { n: '02', Icon: Zap, title: 'AI analyzes', desc: 'Categorized and estimated instantly.' },
              { n: '03', Icon: CheckCircle, title: 'You approve', desc: 'One tap. No calls. No chasing.' },
              { n: '04', Icon: Wrench, title: 'Pro accepts', desc: 'Local vetted pro takes the job.' },
              { n: '05', Icon: Star, title: 'Done & rated', desc: 'Paid, reviewed, logged.' },
            ].map(({ n, Icon, title, desc }, i) => (
              <FadeUp key={n} delay={i * 80}>
                <div
                  className="rounded-2xl p-6 border h-full transition-all duration-500 cursor-default"
                  style={{
                    background: activeStep === i ? 'rgba(0,153,168,0.1)' : '#111F36',
                    borderColor: activeStep === i ? 'rgba(0,153,168,0.5)' : 'rgba(255,255,255,0.07)',
                    transform: activeStep === i ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: activeStep === i ? '0 8px 40px rgba(0,212,170,0.12)' : 'none',
                  }}
                >
                  <div className="text-xs font-bold mb-4" style={{ color: activeStep === i ? '#0099A8' : 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>{n}</div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all" style={{ background: activeStep === i ? 'rgba(0,153,168,0.25)' : 'rgba(0,153,168,0.12)' }}>
                    <Icon className="w-5 h-5" style={{ color: '#0099A8' }} />
                  </div>
                  <div className="font-bold text-white mb-1">{title}</div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#0099A8', letterSpacing: '0.12em' }}>WHO IT'S FOR</div>
            <h2 className="font-black leading-none" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
              Built for everyone<br />in the loop.
            </h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: Home, label: 'TENANTS', title: 'Report it and forget it.', desc: 'Submit in 60 seconds. Upload a photo. Track progress in real time. Never chase anyone again.' },
              { Icon: Home, label: 'LANDLORDS', title: 'Approve once. We handle the rest.', desc: 'AI cost estimates. Vetted pros. Automatic invoicing. Stop managing maintenance. Start owning property.' },
              { Icon: Wrench, label: 'SERVICE PROS', title: 'Steady work. Fast pay.', desc: 'Jobs come to you. Accept what fits your schedule. Get paid within 48 hours. Build your reputation.' },
            ].map(({ Icon, label, title, desc }, i) => (
              <FadeUp key={label} delay={i * 100}>
                <div className="rounded-2xl p-8 border h-full transition-all hover:border-white/20 hover:-translate-y-1 duration-300" style={{ background: '#111F36', borderColor: 'rgba(255,255,255,0.07)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(0,153,168,0.15)' }}>
                    <Icon className="w-5 h-5" style={{ color: '#0099A8' }} />
                  </div>
                  <div className="text-xs font-bold tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>{label}</div>
                  <h3 className="text-xl font-black text-white mb-3 leading-tight">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#0099A8', letterSpacing: '0.12em' }}>WHAT THEY SAY</div>
            <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
              Landlords love not thinking<br />about maintenance.
            </h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: 'I approved a plumbing request from my phone at 6 AM. By noon it was fixed. I never made a single call.', name: 'Sarah M.', loc: 'Oshawa · Managing 12 units', img: 'SM' },
              { quote: 'Tenant messaged me at 11 PM about a furnace. I said use HROP. Handled by morning. I slept fine.', name: 'David K.', loc: 'Whitby · 3 properties', img: 'DK' },
              { quote: 'The AI estimate was within $30 of the invoice. That kind of accuracy builds real trust.', name: 'Jennifer L.', loc: 'Ajax · Property Management Co.' },
            ].map(({ quote, name, loc, img }, i) => (
              <FadeUp key={name} delay={i * 100}>
                <div className="rounded-2xl p-8 border h-full transition-all hover:-translate-y-1 duration-300" style={{ background: '#111F36', borderColor: 'rgba(255,255,255,0.07)' }}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_,j) => <Star key={j} className="w-4 h-4 fill-current" style={{ color: '#0099A8' }} />)}
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.78)' }}>"{quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: 'rgba(0,153,168,0.2)', color: '#0099A8', border: '1px solid rgba(0,212,170,0.3)' }}>{img}</div>
                    <div>
                      <div className="font-bold text-sm text-white">{name}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{loc}</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#0099A8', letterSpacing: '0.12em' }}>PRICING</div>
            <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>Simple pricing. No surprises.</h2>
            <p className="mt-4 text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>Start free. Pay only when it works.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto" style={{ paddingTop: '20px' }}>
            {[
              { tier: 'BASIC', price: '$5', unit: '/door/month', desc: 'Small portfolios', features: ['Maintenance triage', 'Vendor routing', 'Tenant communication', 'Request tracking'], highlight: false },
              { tier: 'PRO', price: '$9', unit: '/door/month', desc: 'Most popular', features: ['Everything in Basic', 'AI cost estimates', 'Invoice processing', 'Vendor scores', 'Priority matching'], highlight: true },
              { tier: 'ENTERPRISE', price: '$15+', unit: '/door/month', desc: 'Large portfolios', features: ['Everything in Pro', 'Custom integrations', 'Account manager', 'SLA guarantees', 'Volume pricing'], highlight: false },
            ].map(({ tier, price, unit, desc, features, highlight }, i) => (
              <FadeUp key={tier} delay={i * 100}>
                <div className="rounded-2xl p-8 border relative h-full transition-all hover:-translate-y-1 duration-300" style={{ background: highlight ? 'rgba(0,153,168,0.06)' : '#111F36', borderColor: highlight ? 'rgba(0,153,168,0.4)' : 'rgba(255,255,255,0.07)', boxShadow: highlight ? '0 0 60px rgba(0,212,170,0.08)' : 'none' }}>
                  {highlight && <div className="absolute left-1/2 -translate-x-1/2 -top-3.5 px-4 py-1 rounded-full text-xs font-black" style={{ background: '#0099A8', color: '#0C1628', letterSpacing: '0.06em' }}>MOST POPULAR</div>}
                  <div className="text-xs font-bold tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>{tier}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-black" style={{ fontSize: '3rem', color: highlight ? '#0099A8' : 'white', lineHeight: 1 }}>{price}</span>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{unit}</span>
                  </div>
                  <div className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</div>
                  <ul className="space-y-2.5 mb-8">
                    {features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#0099A8' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth?signup=1" className="block w-full py-3.5 rounded-xl text-sm font-bold text-center transition-all hover:opacity-90" style={{ background: highlight ? '#0099A8' : 'rgba(255,255,255,0.08)', color: highlight ? '#0C1628' : 'rgba(255,255,255,0.75)' }}>
                    Start Free Trial
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
          <p className="text-center mt-8 text-sm" style={{ color: 'rgba(255,255,255,0.32)' }}>
            Plus 12% commission on completed jobs. 30-day free trial, no credit card required.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <FadeUp>
        <section className="relative z-10 py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-black mb-4 leading-tight" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
              Ready to stop<br /><span className="shimmer-text">managing maintenance?</span>
            </h2>
            <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Join Durham Region property managers who actually sleep at night.
            </p>
            <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:opacity-90 hover:scale-105" style={{ background: '#0099A8', color: '#0C1628' }}>
              Start Your 30-Day Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No credit card · No commitment · Cancel anytime</p>
          </div>
        </section>
      </FadeUp>

      {/* Footer */}
      <footer className="relative z-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0099A8' }}>
                  <Wrench className="w-4 h-4" style={{ color: '#0C1628' }} />
                </div>
                <span className="font-bold text-lg text-white">HROP</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Property maintenance, simplified. Connecting tenants, landlords, and service providers across Durham Region.
              </p>
            </div>
            {/* Product */}
            <div>
              <div className="text-xs font-bold tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>PRODUCT</div>
              <ul className="space-y-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            {/* Company */}
            <div>
              <div className="text-xs font-bold tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>COMPANY</div>
              <ul className="space-y-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <div className="text-xs font-bold tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>CONTACT</div>
              <ul className="space-y-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <li><a href="mailto:hello@hrop.ca" className="hover:text-white transition-colors">hello@hrop.ca</a></li>
                <li><span>Durham Region, ON</span></li>
                <li className="flex items-center gap-3 pt-1">
                  <a href="#" className="hover:text-white transition-colors" aria-label="Twitter/X">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.28)' }}>© 2026 HROP Inc. All rights reserved.</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.28)' }}>Built in Durham Region 🇨🇦</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
