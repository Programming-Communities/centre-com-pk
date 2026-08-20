import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Protect - Password Protect PDF Online Free | Centre.com.pk',
  description: 'Protect PDF files with password encryption. Free online PDF protector — no registration, no watermarks. Secure your PDF documents instantly.',
  keywords: 'pdf protect, protect pdf, password protect pdf, pdf encryption, secure pdf, lock pdf, pdf password',
  alternates: {
    canonical: 'https://www.centre.com.pk/tools/pdf-tools/pdf-protect',
  },
};

export default function PDFProtectPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-4">
          PDF Protect — Password Protect Your PDF
        </h1>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-8">
          Encrypt and lock your PDF files with a password. 100% free, secure, and works in your browser — no upload to server needed.
        </p>
        <div id="pdf-protect-tool" />
      </div>
    </div>
  );
}