import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import InteractiveCanvas from '../components/TryOn/InteractiveCanvas';
import TryOnCard from '../components/TryOn/TryOnCard';
import DailyTrackerModal from '../components/Common/DailyTrackerModal';
import { Sparkles, Calendar, PlusCircle, CheckCircle, Share2, Download, MessageCircle, X } from 'lucide-react';
import BrandMonogram from '../components/Common/BrandMonogram';

const Home = () => {
  const { wardrobe, userProfile, dailyLogs, isPremium } = useContext(AppContext);

  // Styling query states
  const [occasion, setOccasion] = useState('Work');
  const [contextText, setContextText] = useState('');
  
  // Suggestion results
  const [suggestion, setSuggestion] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Daily wear tracker states
  const [showTracker, setShowTracker] = useState(false);
  const [todayLog, setTodayLog] = useState(null);

  // Style DNA toggle state
  const [showDna, setShowDna] = useState(false);

  // Sharing states
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const occasions = ['Work', 'Date', 'Party', 'Casual', 'Formal', 'Travel', 'Gym'];

  const inspirations = [
    {
      name: 'Minimalist Ivory Blazer',
      occasion: 'Work',
      vibe: 'Structured Ivory Blazer, tailored trousers',
      image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&q=80&w=250',
      badge: 'Workwear'
    },
    {
      name: 'Earthy Camel Trench',
      occasion: 'Casual',
      vibe: 'Double-Breasted Cashmere Trench, joggers',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=250',
      badge: 'Outdoor Vibe'
    },
    {
      name: 'Suede Date Jacket',
      occasion: 'Date',
      vibe: 'Suede jacket with black turtleneck',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=250',
      badge: 'Date Night'
    },
    {
      name: 'Resort Linen Shirt',
      occasion: 'Travel',
      vibe: 'French Linen shirt and straight denim',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=250',
      badge: 'Relaxed Fit'
    }
  ];

  const loadInspiration = (ins) => {
    setOccasion(ins.occasion);
    setContextText(ins.vibe);
    const container = document.querySelector('.main-content');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Check if today's wear is already logged
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA');
    const log = dailyLogs.find(l => l.date === today);
    setTodayLog(log);
  }, [dailyLogs]);

  // Occasion Matchmaker Algorithm
  const generateOutfit = () => {
    if (wardrobe.length === 0) {
      alert('Your wardrobe is empty. Please go to the Wardrobe tab and import the Essentials pack or scan some clothes first!');
      return;
    }

    setIsGenerating(true);
    setHasSearched(false);

    // Simulate AI computing layers
    setTimeout(() => {
      // Filter items by occasion
      const categoryItems = (cat) => wardrobe.filter(item => 
        item.category === cat && item.occasions && item.occasions.includes(occasion)
      );

      let tops = categoryItems('Tops');
      let bottoms = categoryItems('Bottoms');
      let outers = categoryItems('Outerwear');
      let shoes = categoryItems('Footwear');

      // Fallback: if no items match the occasion specifically, use general category items
      if (tops.length === 0) tops = wardrobe.filter(i => i.category === 'Tops');
      if (bottoms.length === 0) bottoms = wardrobe.filter(i => i.category === 'Bottoms');
      if (outers.length === 0) outers = wardrobe.filter(i => i.category === 'Outerwear');
      if (shoes.length === 0) shoes = wardrobe.filter(i => i.category === 'Footwear');

      // Matchmaker selection
      const top = tops[Math.floor(Math.random() * tops.length)] || null;
      const bottom = bottoms[Math.floor(Math.random() * bottoms.length)] || null;
      
      // Determine if outerwear is needed based on prompt context (e.g., chilly, cold, rooftop, evening)
      const needsOuterwear = contextText && (
        contextText.toLowerCase().includes('chill') || 
        contextText.toLowerCase().includes('cold') || 
        contextText.toLowerCase().includes('rooftop') || 
        contextText.toLowerCase().includes('night') || 
        contextText.toLowerCase().includes('breeze')
      );
      const outerwear = (needsOuterwear || Math.random() > 0.5) ? (outers[Math.floor(Math.random() * outers.length)] || null) : null;
      
      const footwear = shoes[Math.floor(Math.random() * shoes.length)] || null;

      setSuggestion({ top, bottom, outerwear, footwear });
      setHasSearched(true);
      setIsGenerating(false);
    }, 1200);
  };

  // Mock Copy action for sharing
  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', padding: '16px 0' }}>
      
      {/* Passive Daily Wear Tracker Banner */}
      <div 
        className="vogue-card" 
        style={{ 
          padding: '16px', 
          margin: '0 20px', 
          borderColor: todayLog ? 'var(--border-color)' : 'var(--accent-gold)', 
          backgroundColor: todayLog ? 'var(--bg-surface)' : 'rgba(179,146,102,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Calendar size={18} color="var(--accent-gold)" />
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
              {todayLog ? 'Daily Wear Logged' : 'What are you wearing today?'}
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              {todayLog ? 'Great fit! Building wardrobe stats.' : 'Log your look to track closet utility.'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowTracker(true)}
          style={{
            background: 'none',
            border: todayLog ? '1px solid var(--border-color)' : '1px solid var(--accent-gold)',
            color: todayLog ? 'var(--text-secondary)' : 'var(--accent-gold)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: todayLog ? 'transparent' : 'rgba(179,146,102,0.08)'
          }}
        >
          {todayLog ? <CheckCircle size={12} color="var(--success-sage)" /> : <PlusCircle size={12} />}
          {todayLog ? 'Edit Log' : 'Log Fit'}
        </button>
      </div>

      {/* My Style DNA Card */}
      <div 
        className="vogue-card" 
        style={{ 
          padding: '16px', 
          margin: '0 20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          borderColor: showDna ? 'var(--accent-gold)' : 'var(--border-color)',
          backgroundColor: showDna ? 'rgba(179,146,102,0.01)' : 'var(--bg-surface)',
          transition: 'all 0.3s ease'
        }}
      >
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer' 
          }} 
          onClick={() => setShowDna(!showDna)}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Sparkles size={18} color="var(--accent-gold)" />
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>My Style DNA Profile</h4>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {userProfile.styleVibe || userProfile.styleGoal} • {userProfile.bodyShape} • {userProfile.season || 'Neutral'}
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
            {showDna ? 'Hide' : 'View DNA'}
          </span>
        </div>
        
        {showDna && (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '12px 16px', 
              paddingTop: '14px', 
              borderTop: '1px solid var(--border-color)', 
              fontSize: '0.75rem', 
              animation: 'var(--transition-normal) fadeIn' 
            }}
          >
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Height</strong>
              <span style={{ color: 'var(--text-secondary)' }}>{userProfile.heightCategory || 'Average'}</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Age Group</strong>
              <span style={{ color: 'var(--text-secondary)' }}>{userProfile.ageGroup || '25-34'}</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Occupation</strong>
              <span style={{ color: 'var(--text-secondary)' }}>{userProfile.occupation || 'Creative'}</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Styling Focus</strong>
              <span style={{ color: 'var(--text-secondary)' }}>{userProfile.stylingFocus || 'Define Waist'}</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Preferred Fit</strong>
              <span style={{ color: 'var(--text-secondary)' }}>{userProfile.fitStyle || 'Tailored'}</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Palette Tone</strong>
              <span style={{ color: 'var(--text-secondary)' }}>{userProfile.colorPalettePref || 'Neutrals'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Occasion Selection & Query Builder */}
      <div className="vogue-card" style={{ padding: '24px 20px', margin: '0 20px' }}>
        <span className="badge-gold" style={{ marginBottom: '8px' }}>Occasion Engine</span>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 500, margin: '0 0 16px 0' }}>Where are you going?</h3>

        {/* Occasion Chips Slider */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }} className="no-scrollbar">
          {occasions.map(occ => (
            <button
              key={occ}
              onClick={() => setOccasion(occ)}
              style={{
                padding: '8px 16px',
                backgroundColor: occasion === occ ? 'var(--text-primary)' : 'var(--bg-surface)',
                color: occasion === occ ? 'var(--bg-surface)' : 'var(--text-secondary)',
                border: occasion === occ ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.75rem',
                fontWeight: occasion === occ ? 600 : 400,
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              {occ}
            </button>
          ))}
        </div>

        {/* Context Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Add Extra Context (Climate, Vibe)
          </label>
          <input
            type="text"
            placeholder="e.g. rooftop bar, chilly breeze, casual dinner date"
            className="form-input"
            value={contextText}
            onChange={(e) => setContextText(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateOutfit}
          disabled={isGenerating}
          className="btn-gold"
          style={{ width: '100%', padding: '14px', gap: '8px' }}
        >
          {isGenerating ? 'Curating Styling Matches...' : 'Generate Try-On outfit'}
          <Sparkles size={14} />
        </button>
      </div>

      {/* Suggestion & Canvas Try-On Results */}
      {hasSearched && suggestion && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 20px', animation: 'var(--transition-normal) fadeIn' }}>
          
          {/* Draggable Try On Canvas */}
          <InteractiveCanvas
            referencePhoto={userProfile.referencePhoto}
            topItem={suggestion.top}
            bottomItem={suggestion.bottom}
            outerwearItem={suggestion.outerwear}
            footwearItem={suggestion.footwear}
          />

          {/* Details and Drawer */}
          <TryOnCard
            top={suggestion.top}
            bottom={suggestion.bottom}
            outerwear={suggestion.outerwear}
            footwear={suggestion.footwear}
            occasion={occasion}
            contextText={contextText}
            onShareClick={() => setShowShareModal(true)}
          />

        </div>
      )}

      {/* Daily Style Inspiration Grid Feed */}
      {!hasSearched && !isGenerating && (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'var(--transition-normal) fadeIn' }}>
          
          {/* Header */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 500, margin: 0 }}>Daily Style Feed</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Curated luxury fashion concepts. Tap to load settings.
            </span>
          </div>

          {/* Grid list of Inspirations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {inspirations.map((ins, idx) => (
              <button
                key={idx}
                onClick={() => loadInspiration(ins)}
                style={{
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '8px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'var(--transition-normal)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-gold)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
                  <img src={ins.image} alt={ins.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: 6, left: 6, fontSize: '0.55rem', padding: '2px 6px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-surface)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    {ins.badge}
                  </span>
                </div>

                <div style={{ padding: '0 2px' }}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                    {ins.name}
                  </h4>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Occasion: {ins.occasion}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* Daily Tracker Modal Trigger */}
      {showTracker && (
        <DailyTrackerModal onClose={() => setShowTracker(false)} />
      )}

      {/* Premium Polaroid Share Modal (Feature 4.1) */}
      {showShareModal && suggestion && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-primary)',
              width: '100%',
              maxWidth: '380px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'relative'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowShareModal(false)}
              style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 500, textAlign: 'center', margin: 0 }}>
              Share Your Look
            </h3>

            {/* Custom Polaroid Layout Card */}
            <div
              id="shareable-card"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EAE7E1',
                padding: '16px 16px 24px 16px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Photo Canvas Frame with Watermark */}
              <div style={{ position: 'relative', width: '100%', height: '260px', backgroundColor: '#FAF9F6', overflow: 'hidden' }}>
                <img src={userProfile.referencePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Simulated overlays */}
                {suggestion.bottom && (
                  <img src={suggestion.bottom.image} alt="" style={{ position: 'absolute', left: '50%', top: '65%', transform: 'translate(-50%, -50%) scale(0.6)', height: '140px', objectFit: 'contain' }} />
                )}
                {suggestion.top && (
                  <img src={suggestion.top.image} alt="" style={{ position: 'absolute', left: '52%', top: '45%', transform: 'translate(-50%, -50%) scale(0.55)', height: '140px', objectFit: 'contain' }} />
                )}
                {suggestion.outerwear && (
                  <img src={suggestion.outerwear.image} alt="" style={{ position: 'absolute', left: '48%', top: '42%', transform: 'translate(-50%, -50%) scale(0.6)', height: '140px', objectFit: 'contain' }} />
                )}

                {/* PREMIUM WATERMARK (Feature 4.1) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0,0,0,0.65)',
                    color: '#FFFFFF',
                    padding: '4px 8px',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <BrandMonogram size={10} color="#FFFFFF" /> WAARDLY AI
                </div>
              </div>

              {/* Polaroid Bottom Text Details */}
              <div style={{ textAlign: 'center', padding: '4px 0' }}>
                <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', margin: 0, fontWeight: 600 }}>
                  The {occasion} Silhouette
                </h4>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                  Matched for {userProfile.name} • {userProfile.season} Palette
                </p>
              </div>
            </div>

            {/* Share targets drawer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textAlign: 'center' }}>
                Send to Friends for a Second Opinion
              </span>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button
                  onClick={handleCopyLink}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.65rem',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} color="var(--accent-gold)" />
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>

                <button
                  onClick={() => alert('Opening WhatsApp Share Drawer... (Simulated)')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.65rem',
                    cursor: 'pointer'
                  }}
                >
                  <MessageCircle size={14} color="#25D366" />
                  WhatsApp
                </button>

                <button
                  onClick={() => alert('Opening Instagram Stories Direct Share... (Simulated)')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.65rem',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  Instagram
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
