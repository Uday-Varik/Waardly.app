import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Crown, Sparkles, RefreshCw } from 'lucide-react';
import BrandMonogram from '../Common/BrandMonogram';

const Header = () => {
  const { userProfile, isPremium, resetApp, isOnboarded } = useContext(AppContext);

  return (
    <header className="glass-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BrandMonogram size={22} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, letterSpacing: '0.12em', fontSize: '1.25rem', textTransform: 'uppercase', lineHeight: 1 }}>
            WAARDLY
          </span>
          {isOnboarded && userProfile.season && (
            <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', marginTop: '2px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Sparkles size={8} /> {userProfile.season}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isPremium && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(179,146,102,0.1)', border: '1px solid var(--accent-gold)', padding: '4px 8px', borderRadius: '4px' }}>
            <Crown size={12} color="var(--accent-gold)" fill="var(--accent-gold)" />
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>
              Vogue Elite
            </span>
          </div>
        )}

        {isOnboarded && (
          <button 
            onClick={resetApp} 
            title="Reset App"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--error-rose)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
