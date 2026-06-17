import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Sparkles, Shirt, Camera, Crown, User } from 'lucide-react';

const Navigation = () => {
  const { currentView, setCurrentView, isOnboarded } = useContext(AppContext);

  if (!isOnboarded) return null;

  const navItems = [
    { id: 'home', label: 'Styling', icon: Sparkles },
    { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
    { id: 'scan', label: 'Retail Scan', icon: Camera },
    { id: 'premium', label: 'Elite', icon: Crown },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav 
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 'safe-area-inset-bottom', // Support iOS notch
        zIndex: 100
      }}
    >
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = currentView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              flex: 1,
              height: '100%',
              transition: 'var(--transition-fast)'
            }}
          >
            <div style={{
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconComponent size={20} strokeWidth={isActive ? 2.5 : 1.75} />
            </div>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: isActive ? 600 : 400,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
