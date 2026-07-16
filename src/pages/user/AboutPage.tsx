import { Target, Users, Award, Heart, Zap, Building2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--primary-50), var(--bg))', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 720 }}>
          <span className="badge badge-primary mb-16" style={{ padding: '6px 16px' }}>About FlyNow</span>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)' }}>Connecting Brands and Shoppers Through Premium Digital Flyers</h1>
          <p className="text-lg text-muted mt-16">FlyNow is a modern coupon and flyer platform where companies publish promotional offers and shoppers discover, save, and redeem exclusive deals.</p>
        </div>
      </section>

      <section className="container" style={{ padding: '56px 24px' }}>
        <div className="grid grid-3">
          {[
            { i: Target, t: 'Our Mission', d: 'Make deal discovery effortless, transparent, and rewarding for both brands and shoppers.' },
            { i: Users, t: 'Our Community', d: 'Over 2.4 million shoppers and 850+ brands trust FlyNow for their coupon experience.' },
            { i: Award, t: 'Our Quality', d: 'Every coupon is reviewed and approved by our admin team before reaching users.' },
          ].map((v) => (
            <div key={v.t} className="card card-body">
              <div className="stat-icon" style={{ width: 48, height: 48, background: 'var(--primary-50)', color: 'var(--primary-dark)' }}><v.i size={24} /></div>
              <h3 style={{ marginTop: 16 }}>{v.t}</h3>
              <p className="text-muted mt-8">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--primary-50)', padding: '56px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 28, textAlign: 'center', marginBottom: 32 }}>How It Works</h2>
          <div className="grid grid-3">
            {[
              { i: Building2, t: 'For Companies', d: 'Register your company, get approved, then upload flyers and coupons that reach thousands of shoppers.' },
              { i: Zap, t: 'For Admins', d: 'Review submissions, approve quality offers, manage categories, and keep the platform healthy.' },
              { i: Heart, t: 'For Users', d: 'Browse verified offers, save favorites, and redeem exclusive coupons in-store or online.' },
            ].map((s, i) => (
              <div key={i} className="card card-body">
                <div className="stat-icon" style={{ width: 48, height: 48, background: 'var(--primary)', color: '#fff' }}><s.i size={24} /></div>
                <h3 style={{ marginTop: 16 }}>{s.t}</h3>
                <p className="text-muted mt-8">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
