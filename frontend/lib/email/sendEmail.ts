import nodemailer from 'nodemailer';

let transporter: any = null;

function getTransporter() {
  if (transporter) return transporter;
  
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'mail.centre.com.pk',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'noreply@centre.com.pk',
      pass: process.env.EMAIL_PASS || '',
    },
    tls: { rejectUnauthorized: false },
  });

  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const transport = getTransporter();
    const from = process.env.EMAIL_FROM || 'noreply@centre.com.pk';
    const name = process.env.EMAIL_NAME || 'Centre.com.pk';

    await transport.sendMail({
      from: `"${name}" <${from}>`,
      to,
      subject,
      html,
      replyTo: 'support@centre.com.pk',
    });

    console.log(`✅ Email sent to ${to}: ${subject}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    return false;
  }
}