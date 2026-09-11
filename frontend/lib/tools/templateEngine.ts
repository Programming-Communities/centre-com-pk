// lib/tools/templateEngine.ts
import { ToolInput } from './toolGenerator';

export function generateTranslations(input: ToolInput): any {
  const { name, description } = input;
  const l = name.toLowerCase();

  return {
    en: {
      title: name,
      description: description || `Free online ${l} tool`,
      keywords: [l, `free ${l}`, `online ${l}`],
      faqs: [
        { question: `What is ${name}?`, answer: `${name} is a free online tool.` },
        { question: `How to use ${name}?`, answer: `Enter input and click the button.` },
      ],
      labels: {
        input: 'Input', output: 'Output', calculate: 'Calculate',
        copy: 'Copy', copied: 'Copied!', clear: 'Clear', result: 'Result',
      },
    },
    ur: {
      title: name,
      description: description || `${name} - مفت آن لائن ٹول`,
      keywords: [l, `مفت ${l}`, `آن لائن ${l}`],
      faqs: [
        { question: `${name} کیا ہے؟`, answer: `${name} ایک مفت آن لائن ٹول ہے۔` },
        { question: `${name} کیسے استعمال کریں؟`, answer: `اپنا ان پٹ درج کریں اور بٹن دبائیں۔` },
      ],
      labels: {
        input: 'ان پٹ', output: 'آؤٹ پٹ', calculate: 'حساب کریں',
        copy: 'کاپی', copied: 'کاپی ہو گیا!', clear: 'صاف کریں', result: 'نتیجہ',
      },
    },
    hi: {
      title: name,
      description: description || `${name} - मुफ्त ऑनलाइन टूल`,
      keywords: [l, `मुफ्त ${l}`, `ऑनलाइन ${l}`],
      faqs: [
        { question: `${name} क्या है?`, answer: `${name} एक मुफ्त ऑनलाइन टूल है।` },
        { question: `${name} का उपयोग कैसे करें?`, answer: `इनपुट दर्ज करें और बटन दबाएं।` },
      ],
      labels: {
        input: 'इनपुट', output: 'आउटपुट', calculate: 'गणना करें',
        copy: 'कॉपी', copied: 'कॉपी हो गया!', clear: 'साफ करें', result: 'परिणाम',
      },
    },
    ar: {
      title: name,
      description: description || `${name} - أداة مجانية عبر الإنترنت`,
      keywords: [l, `${l} مجاني`, `${l} عبر الإنترنت`],
      faqs: [
        { question: `ما هو ${name}؟`, answer: `${name} أداة مجانية عبر الإنترنت.` },
        { question: `كيفية استخدام ${name}؟`, answer: `أدخل البيانات وانقر على الزر.` },
      ],
      labels: {
        input: 'المدخل', output: 'المخرج', calculate: 'احسب',
        copy: 'نسخ', copied: 'تم النسخ!', clear: 'مسح', result: 'النتيجة',
      },
    },
  };
}