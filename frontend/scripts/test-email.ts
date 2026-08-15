import { sendEmail } from '../lib/email/sendEmail';

async function testEmail() {
  console.log('📧 Testing email configuration...');
  console.log(`📧 Host: ${process.env.EMAIL_HOST}`);
  console.log(`📧 Port: ${process.env.EMAIL_PORT}`);
  console.log(`📧 User: ${process.env.EMAIL_USER}`);
  console.log(`📧 From: ${process.env.EMAIL_FROM}`);

  const result = await sendEmail({
    to: process.env.EMAIL_USER || 'admin@centre.com.pk',
    subject: '✅ Centre.com.pk Email Test',
    html: `
      <h1>🎉 Email Working!</h1>
      <p>This is a test email from Centre.com.pk</p>
      <p>If you're seeing this, your email configuration is working!</p>
      <hr>
      <p>Centre.com.pk — Free Online Tools</p>
    `,
  });

  console.log('📧 Result:', result);
}

testEmail();
