// Email sending has moved to the serverless function at /api/send-welcome-email.ts
// This avoids exposing the Resend API key in the client-side bundle.
//
// To send a welcome email, POST to /api/send-welcome-email with:
//   { email, fullName, role }
