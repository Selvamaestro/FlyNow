import { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { useToast } from '../../lib/toast-context';

export default function ContactPage() {
  const { show } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      show('Your message has been sent successfully! We will get back to you soon.', 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 800);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      desc: 'Our support team responds within 24 hours.',
      value: 'hello@flynow.com',
      color: '#3B82F6',
    },
    {
      icon: Phone,
      title: 'Call Us',
      desc: 'Mon-Fri from 9am to 6pm EST.',
      value: '+1 (555) 019-3829',
      color: '#10B981',
    },
    {
      icon: MapPin,
      title: 'Headquarters',
      desc: 'Come visit our central office.',
      value: '240 Market St, San Francisco, CA',
      color: '#D89B17',
    },
  ];

  const faqs = [
    { q: 'How do I redeem a digital coupon?', a: 'Just save the coupon to your wallet, open the QR code on your phone, and let the cashier scan it at checkout.' },
    { q: 'Can my business upload custom flyers?', a: 'Yes! Create a Company account, wait for Admin approval, and you can upload unlimited flyers with retail/discount prices.' },
    { q: 'Is FlyNow free to use for shoppers?', a: 'Absolutely. FlyNow is 100% free for shoppers to discover, save, and redeem exclusive deals.' },
  ];

  return (
    <div>
      {/* ═══════ HERO SECTION ═══════ */}
      <section
        style={{
          background: 'radial-gradient(circle at top right, #FFF2C7 0%, #FFF8EA 30%, #ffffff 75%)',
          padding: '80px 0 100px',
          overflow: 'hidden',
        }}
      >
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            alignItems: 'center',
            gap: '60px',
          }}
        >
          {/* LEFT */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFF4D8',
                color: '#D89B17',
                padding: '8px 18px',
                borderRadius: '30px',
                fontWeight: 600,
                marginBottom: '25px',
                fontSize: 14,
              }}
            >
              ✦ Get In Touch
            </div>

            <h1
              style={{
                fontSize: '58px',
                lineHeight: 1.08,
                fontWeight: 800,
                color: '#222',
                marginBottom: '25px',
              }}
            >
              Connect with
              <span style={{ color: '#D89B17' }}> FlyNow</span>
              <br />
              We're Here to Help
            </h1>

            <p
              style={{
                fontSize: '19px',
                color: '#666',
                maxWidth: '560px',
                lineHeight: 1.7,
                marginBottom: '40px',
              }}
            >
              Have a question, feedback, or need help setting up your merchant profile? Let's start a conversation. Our dedicated team is ready to assist you.
            </p>

            {/* Quick trust banner */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#fff',
                padding: '12px 24px',
                borderRadius: 50,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                border: '1px solid #ECE8DD',
              }}
            >
              <ShieldCheck size={20} color="#10B981" />
              <span style={{ fontWeight: 600, fontSize: 15, color: '#333' }}>
                Your data is secure and protected
              </span>
            </div>
          </div>

          {/* RIGHT — Hero Image */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                width: '460px',
                height: '460px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #FFD768 0%, rgba(255,215,104,0.15) 70%, transparent 100%)',
                filter: 'blur(15px)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
              }}
            />
            <img
              src="/images/contact-hero.png"
              alt="Contact FlyNow"
              style={{
                width: '100%',
                maxWidth: 540,
                display: 'block',
                margin: 'auto',
                borderRadius: 28,
                position: 'relative',
                zIndex: 2,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              }}
            />
          </div>
        </div>
      </section>

      {/* ═══════ CONTACT CARDS SECTION ═══════ */}
      <section style={{ padding: '80px 0', background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 28,
            }}
          >
            {contactMethods.map((method, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FAF8F2',
                  borderRadius: 24,
                  padding: '36px 30px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
                  border: '1px solid #ECE8DD',
                  transition: 'all 0.3s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = '#FFE08A';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(216,155,23,0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#ECE8DD';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.02)';
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    background: `${method.color}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  <method.icon size={26} color={method.color} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#222' }}>
                  {method.title}
                </h3>
                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  {method.desc}
                </p>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#D89B17',
                  }}
                >
                  {method.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FORM + FAQ SECTION ═══════ */}
      <section className="container" style={{ padding: '90px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 60,
            alignItems: 'start',
          }}
        >
          {/* LEFT: Contact Form */}
          <div
            style={{
              background: '#fff',
              borderRadius: 28,
              padding: '45px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
              border: '1px solid #ECE8DD',
            }}
          >
            <div style={{ marginBottom: 30 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#D89B17',
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: 8,
                }}
              >
                <MessageSquare size={16} /> Send a Message
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800 }}>We'd love to hear from you</h2>
              <p style={{ color: '#666', marginTop: 8 }}>
                Fill out the form below and our team will get in touch as soon as possible.
              </p>
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="field">
                  <label className="label" style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>
                    Full Name
                  </label>
                  <input
                    className="input"
                    required
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: 12,
                      border: '1px solid #ECE8DD',
                      outline: 'none',
                      background: '#FAF8F2',
                      fontSize: 15,
                    }}
                  />
                </div>
                <div className="field">
                  <label className="label" style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>
                    Email Address
                  </label>
                  <input
                    className="input"
                    type="email"
                    required
                    placeholder="email@flynow.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: 12,
                      border: '1px solid #ECE8DD',
                      outline: 'none',
                      background: '#FAF8F2',
                      fontSize: 15,
                    }}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>
                  Subject
                </label>
                <input
                  className="input"
                  required
                  placeholder="How can we help you?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: 12,
                    border: '1px solid #ECE8DD',
                    outline: 'none',
                    background: '#FAF8F2',
                    fontSize: 15,
                  }}
                />
              </div>

              <div className="field">
                <label className="label" style={{ fontWeight: 600, color: '#333', marginBottom: 8, display: 'block' }}>
                  Message
                </label>
                <textarea
                  className="textarea"
                  required
                  placeholder="Describe your inquiry details..."
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: 12,
                    border: '1px solid #ECE8DD',
                    outline: 'none',
                    background: '#FAF8F2',
                    fontSize: 15,
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#E4A817',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(228,168,23,0.25)',
                  transition: 'all 0.3s',
                  marginTop: 10,
                }}
              >
                <Send size={18} />
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* RIGHT: FAQs Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#D89B17',
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: 8,
                }}
              >
                <HelpCircle size={16} /> FAQ
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Frequently Asked</h2>
              <p style={{ color: '#666' }}>
                Quick answers to common inquiries.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    paddingBottom: 20,
                    borderBottom: idx !== faqs.length - 1 ? '1px solid #ECE8DD' : 'none',
                  }}
                >
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#222' }}>
                    {faq.q}
                  </h4>
                  <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Custom CTA Card */}
            <div
              style={{
                background: 'radial-gradient(circle at bottom right, #FFF2C7 0%, #FFF8EA 100%)',
                borderRadius: 24,
                padding: '30px',
                border: '1px solid #FFE08A',
                marginTop: 10,
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Looking for deals?</h3>
              <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                Explore our main offers catalog to discover exclusive promotions.
              </p>
              <a
                href="/offers"
                style={{
                  color: '#D89B17',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Browse Offers Now <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
