import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import StripeOnboarding from './StripeOnboarding';
import {
  CheckCircle,
  Circle,
  Upload,
  FileText,
  Shield,
  CreditCard,
  User,
  Wrench,
} from 'lucide-react';

interface TradeProOnboardingProps {
  providerId: string;
  email: string;
  businessName?: string;
  stripeOnboarded: boolean;
  onComplete: () => void;
}

interface OnboardingData {
  trade_licence_type: string | null;
  trade_licence_number: string | null;
  wsib_clearance_number: string | null;
  wsib_clearance_expiry: string | null;
  insurance_certificate_url: string | null;
  insurance_expiry: string | null;
  background_check_status: string | null;
  onboarding_step: string | null;
  business_name: string | null;
  service_type: string | null;
  service_area: string | null;
}

const LICENCE_TYPES = [
  'Plumber',
  'Electrician',
  'HVAC Tech',
  'General Contractor',
  'Appliance Repair',
  'Locksmith',
  'Pest Control',
  'Other',
];

const STEPS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'licence', label: 'Trade Licence', icon: Wrench },
  { key: 'wsib', label: 'WSIB Clearance', icon: Shield },
  { key: 'insurance', label: 'Insurance', icon: FileText },
  { key: 'background', label: 'Background Check', icon: Shield },
  { key: 'stripe', label: 'Connect Stripe', icon: CreditCard },
];

export default function TradeProOnboarding({
  providerId,
  email,
  businessName,
  stripeOnboarded,
  onComplete,
}: TradeProOnboardingProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<OnboardingData | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form fields
  const [licenceType, setLicenceType] = useState('');
  const [licenceNumber, setLicenceNumber] = useState('');
  const [wsibNumber, setWsibNumber] = useState('');
  const [wsibExpiry, setWsibExpiry] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: provider } = await supabase
      .from('service_providers')
      .select('trade_licence_type, trade_licence_number, wsib_clearance_number, wsib_clearance_expiry, insurance_certificate_url, insurance_expiry, background_check_status, onboarding_step, business_name, service_type, service_area')
      .eq('id', providerId)
      .single();

    if (provider) {
      setData(provider);
      setLicenceType(provider.trade_licence_type || '');
      setLicenceNumber(provider.trade_licence_number || '');
      setWsibNumber(provider.wsib_clearance_number || '');
      setWsibExpiry(provider.wsib_clearance_expiry || '');
      setInsuranceExpiry(provider.insurance_expiry || '');
    }
  };

  const isStepComplete = (stepKey: string): boolean => {
    if (!data) return false;
    switch (stepKey) {
      case 'profile':
        return !!(data.business_name && data.service_type && data.service_area);
      case 'licence':
        return !!(data.trade_licence_type && data.trade_licence_number);
      case 'wsib':
        return !!(data.wsib_clearance_number && data.wsib_clearance_expiry);
      case 'insurance':
        return !!(data.insurance_certificate_url && data.insurance_expiry);
      case 'background':
        return data.background_check_status === 'submitted' || data.background_check_status === 'passed';
      case 'stripe':
        return stripeOnboarded;
      default:
        return false;
    }
  };

  const completedCount = STEPS.filter(s => isStepComplete(s.key)).length;
  const progressPercent = (completedCount / STEPS.length) * 100;

  useEffect(() => {
    if (completedCount === STEPS.length && data) {
      markOnboardingComplete();
    }
  }, [completedCount]);

  const markOnboardingComplete = async () => {
    await supabase
      .from('service_providers')
      .update({ onboarding_complete: true, onboarding_step: 'complete' })
      .eq('id', providerId);
    onComplete();
  };

  const saveLicence = async () => {
    if (!licenceType || !licenceNumber) return;
    setSaving(true);
    await supabase
      .from('service_providers')
      .update({
        trade_licence_type: licenceType,
        trade_licence_number: licenceNumber,
        trade_licence_verified: false,
        onboarding_step: 'wsib',
      })
      .eq('id', providerId);
    await loadData();
    setSaving(false);
    setActiveStep(2);
  };

  const saveWsib = async () => {
    if (!wsibNumber || !wsibExpiry) return;
    setSaving(true);
    await supabase
      .from('service_providers')
      .update({
        wsib_clearance_number: wsibNumber,
        wsib_clearance_expiry: wsibExpiry,
        wsib_clearance_verified: false,
        onboarding_step: 'insurance',
      })
      .eq('id', providerId);
    await loadData();
    setSaving(false);
    setActiveStep(3);
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${providerId}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleInsuranceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !insuranceExpiry) return;
    setUploading(true);
    const url = await uploadFile(file, 'trade-pro-documents');
    if (url) {
      await supabase
        .from('service_providers')
        .update({
          insurance_certificate_url: url,
          insurance_expiry: insuranceExpiry,
          onboarding_step: 'background',
        })
        .eq('id', providerId);
      await loadData();
      setActiveStep(4);
    }
    setUploading(false);
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file, 'trade-pro-documents');
    if (url) {
      await supabase
        .from('service_providers')
        .update({
          background_check_status: 'submitted',
          background_check_date: new Date().toISOString().split('T')[0],
          onboarding_step: 'stripe',
        })
        .eq('id', providerId);
      await loadData();
      setActiveStep(5);
    }
    setUploading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Your Onboarding</h2>
      <p className="text-sm text-gray-600 mb-4">{completedCount} of {STEPS.length} steps complete</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%`, backgroundColor: '#0099A8' }}
        />
      </div>

      {/* Step Checklist */}
      <div className="flex flex-wrap gap-3 mb-6">
        {STEPS.map((step, idx) => {
          const done = isStepComplete(step.key);
          const Icon = step.icon;
          return (
            <button
              key={step.key}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStep === idx
                  ? 'bg-[#0099A8] text-white'
                  : done
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              {done ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              <Icon className="w-4 h-4" />
              {step.label}
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="border border-gray-200 rounded-lg p-6">
        {/* Step 1: Profile */}
        {activeStep === 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
            {isStepComplete('profile') ? (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span>Profile completed during signup. Business name, service type, and service area are set.</span>
              </div>
            ) : (
              <p className="text-gray-600">Please complete your business name, service type, and service area in your profile settings.</p>
            )}
            <button
              onClick={() => setActiveStep(1)}
              className="mt-4 px-4 py-2 rounded-lg font-semibold text-white transition-colors"
              style={{ backgroundColor: '#0099A8' }}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Trade Licence */}
        {activeStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trade Licence</h3>
            {isStepComplete('licence') ? (
              <div className="flex items-center gap-2 text-green-700 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span>Licence submitted: {data?.trade_licence_type} — #{data?.trade_licence_number}</span>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Licence Type</label>
                    <select
                      value={licenceType}
                      onChange={e => setLicenceType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099A8]"
                    >
                      <option value="">Select licence type...</option>
                      {LICENCE_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Licence Number</label>
                    <input
                      type="text"
                      value={licenceNumber}
                      onChange={e => setLicenceNumber(e.target.value)}
                      placeholder="Enter your licence number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099A8]"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">Manual verification within 48 hours by HROP team.</p>
              </>
            )}
            <button
              onClick={isStepComplete('licence') ? () => setActiveStep(2) : saveLicence}
              disabled={saving || (!isStepComplete('licence') && (!licenceType || !licenceNumber))}
              className="px-4 py-2 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#0099A8' }}
            >
              {saving ? 'Saving...' : isStepComplete('licence') ? 'Next' : 'Save & Continue'}
            </button>
          </div>
        )}

        {/* Step 3: WSIB Clearance */}
        {activeStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">WSIB Clearance</h3>
            {isStepComplete('wsib') ? (
              <div className="flex items-center gap-2 text-green-700 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span>WSIB clearance submitted: #{data?.wsib_clearance_number} (expires {data?.wsib_clearance_expiry})</span>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clearance Number</label>
                    <input
                      type="text"
                      value={wsibNumber}
                      onChange={e => setWsibNumber(e.target.value)}
                      placeholder="Enter your WSIB clearance number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099A8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={wsibExpiry}
                      onChange={e => setWsibExpiry(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099A8]"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Get your free clearance certificate at{' '}
                  <a href="https://wsib.ca/clearance" target="_blank" rel="noopener noreferrer" className="text-[#0099A8] underline">
                    wsib.ca/clearance
                  </a>
                </p>
              </>
            )}
            <button
              onClick={isStepComplete('wsib') ? () => setActiveStep(3) : saveWsib}
              disabled={saving || (!isStepComplete('wsib') && (!wsibNumber || !wsibExpiry))}
              className="px-4 py-2 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#0099A8' }}
            >
              {saving ? 'Saving...' : isStepComplete('wsib') ? 'Next' : 'Save & Continue'}
            </button>
          </div>
        )}

        {/* Step 4: Insurance */}
        {activeStep === 3 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Insurance</h3>
            {isStepComplete('insurance') ? (
              <div className="flex items-center gap-2 text-green-700 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span>Insurance certificate uploaded (expires {data?.insurance_expiry})</span>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  $2M Commercial General Liability required. HROP must be listed as additional insured.
                </p>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry Date</label>
                    <input
                      type="date"
                      value={insuranceExpiry}
                      onChange={e => setInsuranceExpiry(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099A8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificate of Insurance (PDF)</label>
                    <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0099A8] transition-colors">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">{uploading ? 'Uploading...' : 'Click to upload certificate'}</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleInsuranceUpload}
                        disabled={uploading || !insuranceExpiry}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </>
            )}
            {isStepComplete('insurance') && (
              <button
                onClick={() => setActiveStep(4)}
                className="px-4 py-2 rounded-lg font-semibold text-white transition-colors"
                style={{ backgroundColor: '#0099A8' }}
              >
                Next
              </button>
            )}
          </div>
        )}

        {/* Step 5: Background Check */}
        {activeStep === 4 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Background Check</h3>
            {isStepComplete('background') ? (
              <div className="flex items-center gap-2 text-green-700 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span>Background check results submitted ({data?.background_check_status})</span>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  A background check through Certn (~$35) is required before your first job.
                </p>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1 mb-4">
                  <li>Go to <a href="https://certn.co" target="_blank" rel="noopener noreferrer" className="text-[#0099A8] underline">certn.co</a></li>
                  <li>Complete the Enhanced Criminal Record Check + Identity Verification</li>
                  <li>Upload your results PDF below</li>
                </ol>
                <div>
                  <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0099A8] transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{uploading ? 'Uploading...' : 'Upload background check PDF'}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleBackgroundUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </>
            )}
            {isStepComplete('background') && (
              <button
                onClick={() => setActiveStep(5)}
                className="mt-4 px-4 py-2 rounded-lg font-semibold text-white transition-colors"
                style={{ backgroundColor: '#0099A8' }}
              >
                Next
              </button>
            )}
          </div>
        )}

        {/* Step 6: Connect Stripe */}
        {activeStep === 5 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Stripe</h3>
            <p className="text-sm text-gray-600 mb-4">Connect your Stripe account to receive payments.</p>
            <StripeOnboarding
              providerId={providerId}
              email={email}
              businessName={businessName}
              isOnboarded={stripeOnboarded}
            />
          </div>
        )}
      </div>
    </div>
  );
}
