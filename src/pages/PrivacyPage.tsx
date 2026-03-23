import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';


export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0099A8' }}>
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">HROP</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/terms" className="text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link>
          <Link to="/auth" className="text-gray-500 hover:text-gray-900 transition-colors">Sign In</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <h1 className="text-4xl font-black mb-2 text-gray-900">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: March 2026</p>

        <p className="text-gray-600 leading-relaxed mb-12">
          This Privacy Policy explains how HROP Inc. (operating as <strong>Fix It Fast</strong>) collects, uses, discloses, and protects your personal information in accordance with the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA). HROP is an Ontario-based property maintenance marketplace connecting tenants, landlords, and licensed trade professionals.
        </p>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            HROP Inc. is a Canadian corporation based in Durham Region, Ontario. We operate the Fix It Fast platform, a marketplace that connects tenants, landlords, and licensed trade professionals for residential property maintenance. HROP Inc. is the data controller responsible for the personal information collected through the platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. What Personal Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The information we collect depends on your role on the platform:
          </p>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-1">Tenants</h3>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
              <li>Name, email address, and phone number</li>
              <li>Property address</li>
              <li>Maintenance request details, including descriptions and photos</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-1">Landlords</h3>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
              <li>Name, email address, and phone number</li>
              <li>Property portfolio details</li>
              <li>Payment method information (tokenized and processed by Stripe — we do not store full card numbers)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Trade Professionals</h3>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
              <li>Name, email address, and phone number</li>
              <li>Business name and trade licence information</li>
              <li>WSIB clearance certificate</li>
              <li>Insurance certificate</li>
              <li>Background check results (via Certn)</li>
              <li>Stripe Connect account details and banking information (held by Stripe)</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Why We Collect It</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect personal information for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 mt-2">
            <li>Operating the Fix It Fast platform and facilitating maintenance requests</li>
            <li>Processing payments between landlords and trade professionals</li>
            <li>Verifying trade professional identity, licensing, WSIB status, and insurance</li>
            <li>Dispute resolution and supporting Landlord and Tenant Board (LTB) documentation</li>
            <li>Regulatory compliance, including CRA T4A reporting and WSIB requirements</li>
            <li>Communicating with you about your account, jobs, and platform updates</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
            <li><strong>Job matching and dispatch</strong> — connecting maintenance requests with qualified, available trade professionals in your area</li>
            <li><strong>Payment processing</strong> — facilitating secure payments from landlords to trade professionals via Stripe</li>
            <li><strong>Communications</strong> — sending job updates, status notifications, receipts, and platform announcements</li>
            <li><strong>AI cost estimates</strong> — generating preliminary cost estimates for maintenance work based on request details</li>
            <li><strong>Platform improvement</strong> — using anonymized, aggregated data to improve the service</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            We do not sell your personal information to third parties. We do not use your information for automated decision-making that produces legal or similarly significant effects without human oversight.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Who We Share Information With</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We share personal information only with third-party service providers who need it to support platform operations. Each provider is contractually obligated to protect your data:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
            <li><strong>Stripe</strong> — payment processing, trade professional payouts, and tokenized payment storage (United States)</li>
            <li><strong>Resend / AWS</strong> — transactional email delivery (United States)</li>
            <li><strong>Certn</strong> — background checks for trade professional verification (Canada)</li>
            <li><strong>Supabase</strong> — database hosting and authentication (Canada and United States)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            Some of these providers operate in the United States. By using the platform, you acknowledge that your information may be processed outside of Canada, subject to the laws of those jurisdictions. We ensure that all cross-border transfers are governed by appropriate contractual safeguards.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights Under PIPEDA</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Under PIPEDA, you have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
            <li><strong>Access</strong> — request a copy of the personal information we hold about you</li>
            <li><strong>Correction</strong> — request that we correct any inaccurate or incomplete personal information</li>
            <li><strong>Withdrawal of consent</strong> — withdraw your consent to the collection, use, or disclosure of your personal information, subject to legal or contractual restrictions</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            To exercise any of these rights, contact us at <a href="mailto:privacy@hrop.ca" className="text-teal-600 underline hover:text-teal-800">privacy@hrop.ca</a>. We will respond to your request within 30 days. If you are not satisfied with our response, you may file a complaint with the <strong>Office of the Privacy Commissioner of Canada</strong>.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Data Retention</h2>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1">
            <li><strong>Financial records</strong> — retained for 7 years in accordance with Canada Revenue Agency (CRA) requirements</li>
            <li><strong>Job records</strong> — retained for 3 years to support dispute resolution and LTB proceedings</li>
            <li><strong>Account data</strong> — deleted within 30 days of account closure, unless retention is required by law</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            When personal information is no longer needed for the purposes for which it was collected, or when required retention periods expire, we securely delete or anonymize the data.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Security Measures</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information, including:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 mt-2">
            <li>Encryption in transit (TLS) and at rest</li>
            <li>Row-level security (RLS) policies ensuring users can only access data they are authorized to see</li>
            <li>Role-based access controls limiting internal access to personal information</li>
            <li>Tokenized payment processing through Stripe — we never store full credit card numbers</li>
          </ul>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. When we make significant changes, we will notify you by email or through a notice on the platform. Your continued use of Fix It Fast after any changes constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Section 10 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            For privacy-related questions, access requests, or complaints, contact our Privacy Officer:
          </p>
          <div className="mt-3 text-gray-600 leading-relaxed">
            <p><strong>HROP Inc.</strong></p>
            <p>Durham Region, Ontario, Canada</p>
            <p>Email: <a href="mailto:privacy@hrop.ca" className="text-teal-600 underline hover:text-teal-800">privacy@hrop.ca</a></p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-sm text-gray-400">&copy; 2026 HROP Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/terms" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
              <Link to="/about" className="hover:text-gray-700 transition-colors">About</Link>
              <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
