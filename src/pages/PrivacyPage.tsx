import { Link } from 'react-router-dom';


export default function PrivacyPage() {
  return (
    <div style={{ background: '#0C1628', color: 'white', minHeight: '100vh' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(12,22,40,0.9)', backdropFilter: 'blur(12px)' }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0099A8' }}>
            <Wrench className="w-4 h-4" style={{ color: '#0C1628' }} />
          </div>
          <span className="text-xl font-bold text-white">HROP</span>
        </Link>
      </nav>
      <div className="container mx-auto px-6 py-20 max-w-3xl">
        <h1 className="text-5xl font-black mb-4 text-white">Privacy Policy</h1>
        <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.35)' }}>Last updated: March 2026</p>
        {[
          { title: '1. Information We Collect', body: 'We collect information you provide directly: name, email address, phone number, and role (tenant, landlord, or service provider). We also collect information about maintenance requests, including photos, descriptions, and location data for the property in question. We automatically collect usage data such as pages visited, device type, and browser information.' },
          { title: '2. How We Use Your Information', body: 'We use your information to operate the HROP platform — routing maintenance requests, facilitating communication between parties, processing payments, and generating AI cost estimates. We do not sell your personal information to third parties. We may use anonymized, aggregated data to improve the platform.' },
          { title: '3. Data Sharing', body: 'We share information only as necessary to operate the service: with service providers completing a job (they receive property address and issue description), with landlords (they receive tenant-submitted request details), and with payment processors for billing. All parties are contractually bound to protect your data.' },
          { title: '4. Data Retention', body: 'We retain account data for as long as your account is active. Maintenance records are retained for 7 years to support potential LTB (Landlord and Tenant Board) proceedings. You may request deletion of your account and personal data at any time by contacting us.' },
          { title: '5. Security', body: 'We use industry-standard encryption (TLS) for data in transit and encrypt sensitive data at rest. Access to personal data is restricted to employees who need it to operate the service. We conduct regular security reviews.' },
          { title: '6. Your Rights', body: 'You have the right to access, correct, or delete your personal information. You may also request a copy of your data in a portable format. To exercise these rights, contact us at privacy@hrop.ca. We will respond within 30 days.' },
          { title: '7. Contact', body: 'For privacy-related questions or requests, contact us at privacy@hrop.ca or write to HROP Inc., Durham Region, Ontario, Canada.' },
        ].map(({ title, body }) => (
          <div key={title} className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
            <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
