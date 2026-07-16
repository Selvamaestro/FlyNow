import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '../../lib/toast-context';

export default function ContactPage() {
  const { show } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    show('Message sent! We will get back to you soon.', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36 }}>Get In Touch</h1>
        <p className="text-muted mt-8">Have questions or feedback? We'd love to hear from you.</p>
      </div>
      <div className="grid grid-2" style={{ gap: 32, maxWidth: 900, margin: '0 auto' }}>
        <div className="flex-col gap-16">
          {[
            { i: Mail, t: 'Email', v: 'hello@flynow.app' },
            { i: Phone, t: 'Phone', v: '+1 (555) 010-2025' },
            { i: MapPin, t: 'Address', v: '240 Market St, San Francisco, CA' },
          ].map((c) => (
            <div key={c.t} className="card card-body flex items-center gap-16">
              <div className="stat-icon" style={{ width: 48, height: 48, background: 'var(--primary-50)', color: 'var(--primary-dark)' }}><c.i size={22} /></div>
              <div><div className="font-semibold">{c.t}</div><div className="text-muted">{c.v}</div></div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="card card-body flex-col gap-16">
          <div className="field"><label className="label">Name</label><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label className="label">Email</label><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="field"><label className="label">Subject</label><input className="input" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
          <div className="field"><label className="label">Message</label><textarea className="textarea" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
          <button className="btn btn-primary"><Send size={16} /> Send Message</button>
        </form>
      </div>
    </div>
  );
}
