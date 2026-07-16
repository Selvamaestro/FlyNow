import { Link } from 'react-router-dom';
import { Target, Heart, Zap, Building2, ShieldCheck, Globe, ArrowRight, Star } from 'lucide-react';

const partners = [
  'Amazon', 'Flipkart', 'Myntra', 'Nike', 'IKEA',
  'Samsung', 'Boat', 'TinyTreasures', 'ProAthlete',
];

const stats = [
  { value: '12k+', label: 'ACTIVE COUPONS' },
  { value: '$2.4M', label: 'SAVINGS DELIVERED' },
  { value: '850+', label: 'BRAND PARTNERS' },
  { value: '2.4M', label: 'HAPPY USERS' },
];

const values = [
  { icon: Target, title: 'Our Mission', desc: 'Make deal discovery effortless, transparent, and rewarding for both brands and everyday shoppers.' },
  { icon: ShieldCheck, title: 'Trust & Quality', desc: 'Every coupon is manually reviewed and approved by our admin team before it reaches you — no spam, no scams.' },
  { icon: Globe, title: 'Accessibility', desc: 'We believe savings should be available to everyone, everywhere. FlyNow works on every device, every browser.' },
];

const howItWorks = [
  { icon: Building2, title: 'For Companies', desc: 'Register your company, get approved by our team, then upload flyers and digital coupons that reach thousands of shoppers instantly.', color: '#F97316' },
  { icon: Zap, title: 'For Admins', desc: 'Review every submission, approve quality offers, manage categories and brands, and keep the platform safe and vibrant.', color: '#3B82F6' },
  { icon: Heart, title: 'For Users', desc: 'Browse verified offers, save favorites to your digital wallet, and redeem exclusive coupons in-store or online with a single tap.', color: '#EC4899' },
];

const team = [
  { name: 'Piramu Chendu', role: 'Founder & CEO', initials: 'PC', color: '#D89B17' },
  { name: 'Aswin Ram', role: 'Head of Engineering', initials: 'AR', color: '#3B82F6' },
  { name: 'Priya Sharma', role: 'Design Lead', initials: 'PS', color: '#EC4899' },
  { name: 'David Kim', role: 'Marketing Director', initials: 'DK', color: '#10B981' },
];

export default function AboutPage() {
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
              ✦ About FlyNow
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
              Fuel Your
              <span style={{ color: '#D89B17' }}> Savings</span>
              <br />
              with Advanced Tech
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
              Leverage the power of advanced technology to discover deals,
              streamline coupon management, and drive savings. Stay ahead with
              innovative solutions built for the future of shopping.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link
                to="/register"
                style={{
                  background: '#222',
                  color: '#fff',
                  padding: '16px 32px',
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: 16,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.3s',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
              >
                Get Started for Free
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={18} fill="#D89B17" color="#D89B17" />
                <span style={{ fontWeight: 700, fontSize: 16 }}>4.8</span>
              </div>
            </div>

            {/* User badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 32,
                background: '#fff',
                padding: '8px 16px',
                borderRadius: 50,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex' }}>
                {['#D89B17', '#3B82F6', '#EC4899', '#10B981'].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: c,
                      border: '2px solid #fff',
                      marginLeft: i > 0 ? -8 : 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {['S', 'A', 'P', 'D'][i]}
                  </div>
                ))}
              </div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#444' }}>
                2.4M+ Users
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
              src="/images/about-hero.png"
              alt="About FlyNow"
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

      {/* ═══════ BRAND PARTNERS MARQUEE ═══════ */}
      <section
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '28px 0',
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 60,
            animation: 'marquee 20s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          {[...partners, ...partners].map((p, i) => (
            <span
              key={i}
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#bbb',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#ddd',
                  display: 'inline-block',
                }}
              />
              {p}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ═══════ STATS + EMPOWERMENT SECTION ═══════ */}
      <section className="container" style={{ padding: '90px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'center',
          }}
        >
          {/* Left copy */}
          <div>
            <h2
              style={{
                fontSize: 46,
                fontWeight: 800,
                lineHeight: 1.1,
                color: '#222',
                marginBottom: 12,
              }}
            >
              Empowering your
              <br />
              success{' '}
              <span style={{ color: '#D89B17' }}>with our solutions</span>
            </h2>
          </div>

          {/* Right stats grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 32,
            }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <h3
                  style={{
                    fontSize: 42,
                    fontWeight: 800,
                    color: '#222',
                    marginBottom: 4,
                  }}
                >
                  {s.value}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#999',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial block */}
        <div
          style={{
            marginTop: 64,
            textAlign: 'center',
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <p
            style={{
              fontSize: 20,
              lineHeight: 1.7,
              color: '#444',
            }}
          >
            Struggling to find the best deals? Our users found the perfect
            solution with FlyNow. By simplifying coupon discovery and boosting
            brand visibility, they've saved more in less time.{' '}
            <span style={{ color: '#bbb' }}>
              Join thousands who've transformed their shopping into a savings
              machine.
            </span>
          </p>
        </div>
      </section>

      {/* ═══════ OUR VALUES ═══════ */}
      <section
        style={{
          background: '#FFFCF3',
          padding: '90px 0',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
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
                marginBottom: 16,
                fontSize: 14,
              }}
            >
              ✦ What We Stand For
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 800 }}>
              Discover our <span style={{ color: '#D89B17' }}>FlyNow</span>
            </h2>
            <p
              style={{
                color: '#666',
                fontSize: 18,
                maxWidth: 600,
                margin: '16px auto 0',
              }}
            >
              Unleash the full potential of digital coupons with FlyNow.
              Organize, collaborate, and achieve more with ease.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 28,
            }}
          >
            {values.map((v) => (
              <div
                key={v.title}
                style={{
                  background: '#fff',
                  borderRadius: 24,
                  padding: '36px 30px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s',
                  border: '1px solid transparent',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(216,155,23,0.12)';
                  e.currentTarget.style.borderColor = '#FFE08A';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: '#FFF6DD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  <v.icon size={28} color="#D89B17" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
                  {v.title}
                </h3>
                <p style={{ color: '#777', lineHeight: 1.7, fontSize: 15 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="container" style={{ padding: '90px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
            How <span style={{ color: '#D89B17' }}>FlyNow</span> Works
          </h2>
          <p style={{ color: '#666', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
            Three perspectives, one powerful platform built for everyone.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
          }}
        >
          {howItWorks.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#fff',
                borderRadius: 24,
                padding: '40px 30px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.06)';
              }}
            >
              {/* Accent top bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: item.color,
                }}
              />
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: `${item.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <item.icon size={28} color={item.color} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
                {item.title}
              </h3>
              <p style={{ color: '#777', lineHeight: 1.7, fontSize: 15 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ TEAM SECTION ═══════ */}
      <section
        style={{
          background: '#1A1A1A',
          padding: '90px 0',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(216,155,23,0.15)',
                color: '#F4B000',
                padding: '8px 18px',
                borderRadius: '30px',
                fontWeight: 600,
                marginBottom: 16,
                fontSize: 14,
              }}
            >
              ✦ Our Team
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff' }}>
              Meet the <span style={{ color: '#D89B17' }}>Minds</span> Behind FlyNow
            </h2>
            <p
              style={{
                color: '#888',
                fontSize: 18,
                maxWidth: 560,
                margin: '16px auto 0',
              }}
            >
              Passionate people building the future of digital coupon discovery.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 50,
              alignItems: 'center',
            }}
          >
            {/* Team image */}
            <div>
              <img
                src="/images/about-team.png"
                alt="FlyNow Team"
                style={{
                  width: '100%',
                  borderRadius: 24,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
              />
            </div>

            {/* Team members */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {team.map((t) => (
                <div
                  key={t.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 18,
                    padding: '20px 24px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.3s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(216,155,23,0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: t.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>
                      {t.name}
                    </div>
                    <div style={{ color: '#888', fontSize: 14 }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section
        style={{
          background: 'radial-gradient(circle at bottom left, #FFF2C7 0%, #FFF8EA 30%, #ffffff 75%)',
          padding: '100px 0',
        }}
      >
        <div
          className="container"
          style={{ textAlign: 'center', maxWidth: 700 }}
        >
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
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            ✦ Start Saving Today
          </div>
          <h2 style={{ fontSize: 44, fontWeight: 800, marginBottom: 18 }}>
            Ready to
            <span style={{ color: '#D89B17' }}> Transform</span> Your
            <br />
            Shopping Experience?
          </h2>
          <p
            style={{
              color: '#666',
              fontSize: 19,
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 580,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Join over 2.4 million users who save hundreds every month with
            FlyNow's premium digital coupons. It's free, fast, and secure.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <Link
              to="/register"
              style={{
                background: '#E4A817',
                color: '#fff',
                padding: '16px 36px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: 16,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(228,168,23,0.35)',
                transition: 'all 0.3s',
              }}
            >
              Create Free Account
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/offers"
              style={{
                background: '#fff',
                color: '#222',
                padding: '16px 36px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: 16,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '2px solid #ECE8DD',
                transition: 'all 0.3s',
              }}
            >
              Browse Offers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
