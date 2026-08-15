import { sendEmail } from './sendEmail';

const BRAND = 'Centre.com.pk';
const SITE_URL = 'https://www.centre.com.pk';

function wrapInTemplate(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
<tr><td style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:30px;text-align:center;">
<h1 style="color:#fff;margin:0;font-size:24px;">${BRAND}</h1>
</td></tr>
<tr><td style="padding:30px;">
<h2 style="color:#1e293b;margin:0 0 16px;">${title}</h2>
${body}
</td></tr>
<tr><td style="background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#94a3b8;">
<p style="margin:0;">© ${new Date().getFullYear()} ${BRAND}</p>
<p style="margin:8px 0 0;"><a href="${SITE_URL}" style="color:#2563eb;">${SITE_URL}</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export const emailService = {
  async sendWelcomeEmail(email: string, name: string) {
    const title = `Welcome to ${BRAND}, ${name}! 🎉`;
    const body = `<p style="color:#475569;line-height:1.6;">Your account has been created. Explore <a href="${SITE_URL}/tools">53+ free tools</a>!</p>
    <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:12px;">Go to Dashboard →</a>`;
    return sendEmail(email, title, wrapInTemplate(title, body));
  },

  async sendOTPEmail(email: string, code: string, name: string) {
    const title = 'Your OTP Code';
    const body = `<p style="color:#475569;">Hi ${name}, use this code:</p>
    <div style="text-align:center;margin:24px 0;"><span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#2563eb;background:#eff6ff;padding:16px 32px;border-radius:12px;">${code}</span></div>
    <p style="color:#94a3b8;font-size:13px;">Expires in 10 minutes.</p>`;
    return sendEmail(email, title, wrapInTemplate(title, body));
  },

  async sendForgotPasswordEmail(email: string, resetLink: string, name: string) {
    const title = 'Reset Your Password';
    const body = `<p style="color:#475569;">Hi ${name}, click below to reset:</p>
    <a href="${resetLink}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:12px;">Reset Password →</a>
    <p style="color:#94a3b8;font-size:13px;margin-top:16px;">Link expires in 1 hour.</p>`;
    return sendEmail(email, title, wrapInTemplate(title, body));
  },

  async sendPasswordChangedEmail(email: string, name: string) {
    const title = 'Password Changed';
    const body = `<p style="color:#475569;">Hi ${name}, your password was changed successfully.</p>`;
    return sendEmail(email, title, wrapInTemplate(title, body));
  },

  async sendPlanUpgradedEmail(email: string, name: string, plan: string) {
    const title = `Plan Upgraded to ${plan.toUpperCase()}! 🚀`;
    const body = `<p style="color:#475569;">Hi ${name}, your plan is now <strong>${plan.toUpperCase()}</strong>!</p>
    <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#10b981;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:12px;">Explore Features →</a>`;
    return sendEmail(email, title, wrapInTemplate(title, body));
  },
};