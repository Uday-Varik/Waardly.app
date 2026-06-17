import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Crown, Sparkles, CreditCard, Check, ShieldCheck, Loader2 } from 'lucide-react';
import BrandMonogram from '../components/Common/BrandMonogram';

const PremiumView = () => {
  const { isPremium, setIsPremium, userProfile } = useContext(AppContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 16) {
      alert('Please enter a valid 16-digit card number.');
      return;
    }
    if (!expiry || !cvc) {
      alert('Please fill in card expiration and security codes.');
      return;
    }

    setIsProcessing(true);

    // Simulate Stripe payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsPremium(true);
      setPaymentSuccess(true);
    }, 2000);
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your Vogue Elite status?')) {
      setIsPremium(false);
      setPaymentSuccess(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '20px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <span className="badge-gold">Vogue Premium</span>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 500, margin: '4px 0 0 0' }}>Waardly Elite</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Elevate your daily styling with AI-powered premium details
        </p>
      </div>

      {/* RENDER ACTIVE SUBSCRIPTION PAGE */}
      {isPremium ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'var(--transition-normal) fadeIn' }}>
          
          <div 
            className="vogue-card" 
            style={{ 
              margin: 0, 
              padding: '30px 20px', 
              textAlign: 'center', 
              border: '2px solid var(--accent-gold)', 
              backgroundColor: 'rgba(179,146,102,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown size={24} color="var(--accent-gold)" fill="var(--accent-gold)" />
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, margin: '0 0 4px 0' }}>You are an Elite Stylist</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Active Plan: Vogue Elite Annual
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Billing Status:</span>
                <span style={{ color: 'var(--success-sage)', fontWeight: 600 }}>Active (Stripe Verified)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Renewal Date:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>June 14, 2027</span>
              </div>
            </div>
          </div>

          <div className="vogue-card" style={{ margin: 0, padding: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', margin: '0 0 12px 0', fontWeight: 600 }}>
              Your Unlocked Features
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                <Check size={14} color="var(--success-sage)" style={{ marginTop: '2px' }} />
                <span>Unlimited virtual outfit try-ons on your silhouette.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                <Check size={14} color="var(--success-sage)" style={{ marginTop: '2px' }} />
                <span>Full access to the <strong>AI Web Style Engine</strong> looking up live trends.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                <Check size={14} color="var(--success-sage)" style={{ marginTop: '2px' }} />
                <span>Double-precision canvas texture blending (Multiply modes).</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCancelSubscription}
            className="btn-secondary"
            style={{ color: 'var(--error-rose)', borderColor: 'var(--border-color)', width: '100%' }}
          >
            Cancel Subscription
          </button>

        </div>
      ) : (
        /* RENDER STRIPE PAYWALL GATEWAY */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'var(--transition-normal) fadeIn' }}>
          
          {/* Features pitch */}
          <div className="vogue-card" style={{ margin: 0, padding: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--accent-gold)" /> Upgrade to Elite
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(179,146,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <span style={{ fontSize: '0.55rem', color: 'var(--accent-gold)', fontWeight: 700 }}>1</span>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>Unlimited AI Try-Ons</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Try on as many garments as you like without daily limits.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(179,146,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <span style={{ fontSize: '0.55rem', color: 'var(--accent-gold)', fontWeight: 700 }}>2</span>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>Dynamic Web Style Search</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Unlock real-time fashion lookup for rare outfit combinations.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(179,146,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <span style={{ fontSize: '0.55rem', color: 'var(--accent-gold)', fontWeight: 700 }}>3</span>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>Watermark-Free Shares</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Option to toggles watermark brand cards when sharing fits.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Stripe Card Box */}
          <form onSubmit={handleSubscribe} className="vogue-card" style={{ margin: 0, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <CreditCard size={16} color="var(--accent-gold)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 500, margin: 0 }}>Stripe Secure Checkout</h4>
            </div>

            {/* Credit Card Preview Graphic */}
            <div 
              style={{ 
                width: '100%', 
                height: '160px', 
                borderRadius: 'var(--radius-md)', 
                background: 'linear-gradient(135deg, #1C1C1C 0%, #2D2D2D 100%)',
                border: '1px solid var(--accent-gold)',
                padding: '20px',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-subtle), 0 8px 24px rgba(179,146,102,0.15)',
                position: 'relative',
                overflow: 'hidden',
                marginTop: '4px',
                marginBottom: '4px'
              }}
            >
              {/* Gold glitter overlay */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, var(--accent-gold) 1px, transparent 1px)', backgroundSize: '8px 8px', pointerEvents: 'none' }} />
              
              {/* Top Row: Chip & Brand */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                {/* Gold microchip */}
                <div style={{ width: '32px', height: '24px', borderRadius: '4px', backgroundColor: 'var(--accent-gold)', backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.15) 1px, transparent 1px)', backgroundSize: '6px 6px', opacity: 0.9 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BrandMonogram size={14} />
                  <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '0.05em', fontStyle: 'italic' }}>
                    {cardNumber.startsWith('4') ? 'Visa Elite' : cardNumber.startsWith('5') ? 'Mastercard Gold' : 'Waardly Elite'}
                  </span>
                </div>
              </div>

              {/* Middle Row: Card Number */}
              <div style={{ zIndex: 10 }}>
                <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '0.08em', display: 'block', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  {cardNumber || '•••• •••• •••• ••••'}
                </span>
              </div>

              {/* Bottom Row: Holder & Expiry */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cardholder</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-gold)' }}>
                    {userProfile?.name || 'VOGUE MEMBER'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expires</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace' }}>
                    {expiry || 'MM/YY'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Card Number
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19))}
                style={{ fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '0.08em' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Expiration Date
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value.replace(/[^0-9]/g, '').replace(/(\d{2})/g, '$1/').replace(/\/$/, '').slice(0, 5))}
                  style={{ fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Security Code (CVC)
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="***"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-primary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginTop: '8px' }}>
              <ShieldCheck size={18} color="var(--success-sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                Your card credentials are encrypted. Subscription pricing is <strong>$9.99/month</strong>, billed annually.
              </p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-gold"
              style={{ width: '100%', padding: '14px', gap: '8px', marginTop: '12px' }}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
                  Processing Payment...
                </>
              ) : (
                'Pay $119.88 & Unlock Elite'
              )}
            </button>
          </form>

        </div>
      )}

    </div>
  );
};

export default PremiumView;
