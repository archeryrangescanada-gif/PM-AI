import { Link } from 'react-router-dom';


export default function TermsPage() {
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
        <h1 className="text-5xl font-black mb-4 text-white">Terms of Service</h1>
        <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.35)' }}>Last updated: March 2026</p>
        {[
          { title: '1. Acceptance of Terms', body: 'By creating an account or using the HROP platform, you agree to these Terms of Service. If you do not agree, do not use the platform.' },
          { title: '2. Platform Description', body: 'HROP is a property maintenance coordination platform that connects tenants, landlords, and service providers. We facilitate communication and payments but are not a party to the service agreements between landlords and service providers.' },
          { title: '3. User Responsibilities', body: 'Tenants agree to submit accurate maintenance requests with genuine photos. Landlords agree to respond to requests within a reasonable time and to pay for approved work. Service providers agree to complete accepted jobs to a professional standard. All users agree not to misuse the platform, submit fraudulent requests, or circumvent payments.' },
          { title: '4. Payments and Fees', body: 'Landlords are billed monthly per door based on their subscription tier. A 12% platform fee is charged on each completed job. If a tenant is responsible for damage and fails to pay, the backstop charge is applied to the landlord, who retains the right to recover those costs from the tenant through appropriate legal channels.' },
          { title: '5. AI Cost Estimates', body: 'AI-generated cost estimates are provided for informational purposes only. They are not guarantees of final cost. Actual job costs may vary and HROP is not liable for differences between estimates and invoices.' },
          { title: '6. Limitation of Liability', body: 'HROP is not liable for the quality of work performed by service providers, property damage arising from maintenance issues, disputes between landlords and tenants, or any indirect, incidental, or consequential damages. Our maximum liability is limited to the fees you paid to HROP in the 3 months preceding the claim.' },
          { title: '7. Termination', body: 'You may cancel your account at any time. HROP may suspend or terminate accounts that violate these terms. Subscription fees are non-refundable for the current billing period.' },
          { title: '8. Governing Law', body: 'These terms are governed by the laws of the Province of Ontario and the federal laws of Canada. Any disputes will be resolved in the courts of Ontario.' },
          { title: '9. Contact', body: 'For questions about these terms, contact legal@hrop.ca.' },
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
