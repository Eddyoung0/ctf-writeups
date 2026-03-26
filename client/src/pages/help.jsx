import React, { useEffect } from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import BackButton from '../components/BackButton';

const faqs = [
  {
    question: 'How do I track my order?',
    answer: 'Open your cart and complete checkout. After order creation, tracking updates are sent to your email.',
  },
  {
    question: 'How do I remove items from my cart?',
    answer: 'Go to Cart from the navbar and use the remove icon on any item.',
  },
  {
    question: 'Can I save products for later?',
    answer: 'Yes. Tap the heart icon on any product to add it to your favourites.',
  },
];

const Help = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-24 pb-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 space-y-6">
        <BackButton fallback="/" />
        <div className="rounded-2xl border border-neutral-200 bg-[#007E5D] p-6 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <h1 className="text-3xl font-semibold text-white">Help & Support</h1>
          <p className="mt-2 text-sm text-white">Find quick answers and contact our support team.</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold text-neutral-900">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-neutral-200 p-4 bg-neutral-50">
                <p className="font-medium text-neutral-900">{faq.question}</p>
                <p className="mt-1 text-sm text-neutral-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold text-neutral-900">Contact Support</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50 text-neutral-700 inline-flex items-center gap-2">
              <Mail size={16} /> support@quickkart.com
            </div>
            <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50 text-neutral-700 inline-flex items-center gap-2">
              <Phone size={16} /> +92 300 0000000
            </div>
            <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50 text-neutral-700 inline-flex items-center gap-2">
              <MessageCircle size={16} />  Order Message
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
