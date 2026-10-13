'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Thanks — we’ll be in touch shortly.');
      setForm({ name: '', email: '', message: '' });
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Name
        </label>
        <input id="name" required value={form.name} onChange={update('name')} className="input-field" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input id="email" type="email" required value={form.email} onChange={update('email')} className="input-field" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
          How can we help?
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={update('message')}
          className="input-field resize-y"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
