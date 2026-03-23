import resend from 'resend';

const client = new resend.Resend(import.meta.env.VITE_RESEND_API_KEY);

const FROM = 'HROP <noreply@hrop.ca>';

function roleLabel(role: string) {
  if (role === 'landlord') return 'Landlord';
  if (role === 'service_provider') return 'Service Provider';
  return 'Tenant';
}

function roleInstructions(role: string) {
  if (role === 'landlord') return `
    <ol style="margin:0;padding-left:20px;color:#374151;line-height:2">
      <li>Sign in to your account</li>
      <li>Click <strong>Add Property</strong> to add your first property</li>
      <li>Share your property address with your tenants so they can submit requests</li>
      <li>When a maintenance request comes in, you\'ll approve it with one click</li>
      <li>A verified service provider will be dispatched automatically</li>
    </ol>`;
  if (role === 'service_provider') return `
    <ol style="margin:0;padding-left:20px;color:#374151;line-height:2">
      <li>Sign in to your account</li>
      <li>Complete your provider profile with your trade category and service area</li>
      <li>Jobs matching your skills will appear in your dashboard</li>
      <li>Accept jobs that fit your schedule</li>
      <li>Complete the work and get paid within 48 hours</li>
    </ol>`;
  return `
    <ol style="margin:0;padding-left:20px;color:#374151;line-height:2">
      <li>Sign in to your account</li>
      <li>Submit a maintenance request with a photo and description</li>
      <li>Your landlord will review and approve the request</li>
      <li>A service provider will be assigned and you\'ll get real-time updates</li>
      <li>Rate the service once the job is complete</li>
    </ol>`;
}

export async function sendWelcomeEmail(email: string, fullName: string, role: string) {
  const label = roleLabel(role);
  const instructions = roleInstructions(role);
  const dashboardUrl = role === 'landlord' ? 'https://hrop.ca/landlord' 
    : role === 'service_provider' ? 'https://hrop.ca/provider' 
    : 'https://hrop.ca/tenant';

  await client.emails.send({
    from: FROM,
    to: email,
    subject: `Welcome to HROP, ${fullName.split(' ')[0]}!`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
        
        <!-- Header -->
        <tr><td style="background:#0C1628;padding:32px 40px;text-align:center">
          <div style="display:inline-flex;align-items:center;gap:10px">
            <div style="background:#0099A8;width:36px;height:36px;border-radius:8px;display:inline-block;line-height:36px;text-align:center">
              <span style="color:#0C1628;font-size:18px;font-weight:bold">H</span>
            </div>
            <span style="color:#ffffff;font-size:24px;font-weight:700;margin-left:8px">HROP</span>
          </div>
          <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:14px">Fix It Fast</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px">
          <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#111827">Welcome, ${fullName.split(' ')[0]}!</h1>
          <p style="margin:0 0 24px;color:#6b7280;font-size:15px">You\'re now set up as a <strong style="color:#0099A8">${label}</strong> on HROP.</p>
          
          <div style="background:#f0fafb;border-left:4px solid #0099A8;border-radius:4px;padding:16px 20px;margin-bottom:32px">
            <p style="margin:0;font-size:14px;color:#374151">
              <strong>HROP is currently in beta.</strong> You have free access to everything. 
              Your feedback helps us build the right product — reply to this email anytime.
            </p>
          </div>

          <h2 style="margin:0 0 16px;font-size:18px;font-weight:600;color:#111827">Getting started as a ${label}</h2>
          ${instructions}

          <div style="margin:32px 0;text-align:center">
            <a href="${dashboardUrl}" style="background:#0099A8;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;display:inline-block">
              Go to Your Dashboard →
            </a>
          </div>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0">
          
          <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center">
            Questions? Reply to this email or contact us at 
            <a href="mailto:hello@hrop.ca" style="color:#0099A8">hello@hrop.ca</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">
            © 2026 HROP Inc. · Durham Region, Ontario, Canada<br>
            <a href="https://hrop.ca/privacy" style="color:#9ca3af">Privacy Policy</a> · 
            <a href="https://hrop.ca/terms" style="color:#9ca3af">Terms of Service</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  });
}
