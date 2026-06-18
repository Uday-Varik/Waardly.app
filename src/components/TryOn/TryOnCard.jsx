import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Sparkles, Share2, ChevronDown, ChevronUp, Search, Info, Check, Eye } from 'lucide-react';
import { STYLE_ICONS, MOCK_INTERNET_STYLE_ICONS } from '../../utils/mockData';

const TryOnCard = ({ top, bottom, outerwear, footwear, occasion, contextText, onShareClick }) => {
  const { userProfile, isPremium, setIsPremium } = useContext(AppContext);
  const [showJustification, setShowJustification] = useState(false);
  
  // Style Icon matching state
  const [styleIcon, setStyleIcon] = useState(null);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [searchLogs, setSearchLogs] = useState([]);
  const [searchProgress, setSearchProgress] = useState(0);

  // Match style icon when outfit changes
  useEffect(() => {
    if (!top) return;

    // Check if we have a gender-matching style icon in preloaded ones
    const genderMatches = STYLE_ICONS.filter(icon => 
      icon.gender === userProfile.gender || icon.gender === 'Unisex'
    );

    // Let's decide if this is a standard match or a "Dynamic Internet Search" trigger
    // If user prompt has unusual words or if the combo is casual/sporty, let's trigger the Web search to demonstrate it!
    const isSportyOrGrunge = (contextText && (contextText.toLowerCase().includes('rooftop') || contextText.toLowerCase().includes('bar') || contextText.toLowerCase().includes('street') || contextText.toLowerCase().includes('gym') || contextText.toLowerCase().includes('chill')));
    
    if (isSportyOrGrunge) {
      // Trigger dynamic search!
      setIsSearchingWeb(true);
      setSearchProgress(0);
      setSearchLogs(['Initiating AI Style Engine...', 'Analyzing garment aesthetic and contrast ratio...']);
      
      let timer1 = setTimeout(() => {
        setSearchProgress(40);
        setSearchLogs(prev => [...prev, 'Scanning Pinterest, Instagram and Vogue runway archives...']);
      }, 700);

      let timer2 = setTimeout(() => {
        setSearchProgress(80);
        setSearchLogs(prev => [...prev, `Found style match matching gender: ${userProfile.gender}...`]);
      }, 1400);

      let timer3 = setTimeout(() => {
        setSearchProgress(100);
        setIsSearchingWeb(false);

        // Find matches in our mock web styles
        const categoryKey = occasion === 'Gym' || occasion === 'Travel' ? 'Activewear Sporty' : 'Monochrome Streetwear';
        const webIcon = MOCK_INTERNET_STYLE_ICONS.find(w => 
          w.gender === userProfile.gender && w.outfitType.toLowerCase().includes(occasion.toLowerCase())
        ) || MOCK_INTERNET_STYLE_ICONS.find(w => w.gender === userProfile.gender) || MOCK_INTERNET_STYLE_ICONS[0];

        setStyleIcon({
          name: webIcon.iconName,
          aesthetic: webIcon.aesthetic,
          quote: webIcon.quote,
          isWebMatch: true,
          source: webIcon.source,
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
        });
      }, 2100);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      // Pick preloaded style icon matching gender
      setIsSearchingWeb(false);
      const icon = genderMatches.find(g => {
        if (occasion === 'Formal' || occasion === 'Work') return g.id === 'deepika' || g.id === 'ryan';
        if (occasion === 'Date') return g.id === 'zendaya' || g.id === 'timothee';
        return g.id === 'gigi' || g.id === 'harry' || g.id === 'rihanna';
      }) || genderMatches[0];

      setStyleIcon({
        ...icon,
        isWebMatch: false
      });
    }
  }, [top, bottom, outerwear, footwear, occasion, contextText, userProfile.gender]);

  if (!top && !bottom) return null;

  // 5-Layer justification strings based on the outfit and user profile
  const layersJustification = {
    occasion: top && bottom 
      ? `This ensemble fits the '${occasion}' aesthetic perfectly. The ${top.name} offers structured coverage suitable for ${contextText || 'the occasion'}, while the ${bottom.name} keeps it sophisticated yet functional.`
      : top 
      ? `This style fits the '${occasion}' aesthetic perfectly. The ${top.name} offers structured coverage suitable for ${contextText || 'the occasion'} as the centerpiece of your look.`
      : `This style fits the '${occasion}' aesthetic perfectly. The ${bottom.name} grounds your look with structured coverage suitable for ${contextText || 'the occasion'}.`,
    
    color: top && bottom 
      ? `By pairing the ${top.colorName} (${top.colorHex}) with the ${bottom.colorName} (${bottom.colorHex}), we create a balanced color block. The outfit uses sophisticated contrast to maintain visual interest.`
      : top 
      ? `The ${top.colorName} (${top.colorHex}) acts as the main focal color of your look, drawing attention to your upper silhouette and pairing cleanly with neutral bases.`
      : `The ${bottom.colorName} (${bottom.colorHex}) grounds your silhouette, creating a sleek tailored base layer for your outfit.`,
    
    body: top && bottom 
      ? `The ${userProfile.bodyShape} silhouette is flattered by the drape of the ${bottom.name} and the fitted cut of the ${top.name}. This creates proportion balance, highlighting your shoulders and narrowing the waist.`
      : top 
      ? `The fitted cut of the ${top.name} flatters your ${userProfile.bodyShape} silhouette, aligning with your styling focus.`
      : `The drape and line of the ${bottom.name} flatters your ${userProfile.bodyShape} silhouette, balancing your lower proportions.`,
    
    skin: top 
      ? `These colors were selected directly from your seasonal color palette: ${userProfile.season}. The ${top.colorName} complements your skin's ${userProfile.undertone} undertone, reflecting light to brighten your complexion.`
      : bottom 
      ? `These colors were selected directly from your seasonal color palette: ${userProfile.season}. The ${bottom.colorName} complements your skin's ${userProfile.undertone} undertone, blending naturally with your complexion.`
      : `This look matches your seasonal color palette: ${userProfile.season}.`,
    
    icon: styleIcon ? styleIcon.quote : '"Style is a way to say who you are without having to speak."'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      
      {/* Outfit Title Grid */}
      <div className="vogue-card" style={{ padding: '20px 16px', margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: '6px' }}>Occasion Recommendation</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 500, margin: 0 }}>
              The {occasion} Silhouette
            </h3>
            {contextText && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', display: 'block', marginTop: '2px' }}>
                "{contextText}"
              </span>
            )}
          </div>
          <button
            onClick={onShareClick}
            className="btn-secondary"
            style={{ padding: '8px 12px', display: 'flex', gap: '6px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
          >
            <Share2 size={12} /> Share Fit
          </button>
        </div>

        {/* Outfit Checklist Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          {outerwear && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }} />
              <span style={{ color: 'var(--text-secondary)', width: '70px', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600 }}>Outerwear:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{outerwear.name}</span>
            </div>
          )}
          {top && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }} />
              <span style={{ color: 'var(--text-secondary)', width: '70px', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600 }}>Top:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{top.name}</span>
            </div>
          )}
          {bottom && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }} />
              <span style={{ color: 'var(--text-secondary)', width: '70px', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600 }}>Bottom:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{bottom.name}</span>
            </div>
          )}
          {footwear && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }} />
              <span style={{ color: 'var(--text-secondary)', width: '70px', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600 }}>Footwear:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{footwear.name}</span>
            </div>
          )}
        </div>

        {/* 5-Layer Drawer Toggle */}
        <button
          onClick={() => setShowJustification(prev => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            padding: '10px',
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            marginTop: '20px',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <Sparkles size={14} color="var(--accent-gold)" />
          {showJustification ? 'Hide Style Justification' : 'Why This Outfit Works (5-Layers)'}
          {showJustification ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* 5-Layer Justification Expandable Drawer */}
        {showJustification && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', animation: 'var(--transition-fast) fadeIn' }}>
            
            {/* Layer 1: Occasion Fit */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>
                Layer 1: Occasion Fit
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {layersJustification.occasion}
              </p>
            </div>

            {/* Layer 2: Color Logic */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>
                Layer 2: Color Logic
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {layersJustification.color}
              </p>
            </div>

            {/* Layer 3: Body Flattery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>
                Layer 3: Body Shape Flattery ({userProfile.bodyShape})
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {layersJustification.body}
              </p>
            </div>

            {/* Layer 4: Color Theory Skin Undertone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>
                Layer 4: Skin Complementary (Detected: {userProfile.season})
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {layersJustification.skin}
              </p>
            </div>

            {/* Layer 5: Style Icon Channeling */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
              
              {isSearchingWeb ? (
                /* Dynamic style search animation */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: '#FAF9F6', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--accent-gold)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Search size={14} className="text-gold" style={{ animation: 'bounce 1s infinite' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>AI Style Web Engine Search...</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${searchProgress}%`, height: '100%', backgroundColor: 'var(--accent-gold)', transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    {searchLogs[searchLogs.length - 1]}
                  </div>
                </div>
              ) : styleIcon ? (
                /* Rendered matched style icon */
                <div 
                  style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    alignItems: 'center', 
                    backgroundColor: 'rgba(179,146,102,0.04)', 
                    padding: '12px', 
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)' 
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <div 
                      style={{ 
                        width: '44px', 
                        height: '44px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        border: '1px solid var(--accent-gold)',
                        backgroundColor: '#EAE7E1'
                      }}
                    >
                      <img src={styleIcon.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {styleIcon.isWebMatch && (
                      <span 
                        title={`Verified from ${styleIcon.source}`}
                        style={{ 
                          position: 'absolute', 
                          bottom: '-2px', 
                          right: '-2px', 
                          backgroundColor: 'var(--accent-gold)', 
                          color: '#FFFFFF', 
                          fontSize: '0.55rem', 
                          padding: '1px 3px', 
                          borderRadius: '3px',
                          fontWeight: 700
                        }}
                      >
                        WEB
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>
                        Layer 5: Style Icon
                      </span>
                      {styleIcon.isWebMatch && (
                        <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>
                          via {styleIcon.source}
                        </span>
                      )}
                    </div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '2px 0' }}>
                      Channeling {styleIcon.name}
                    </h5>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '4px 0 0 0', lineHeight: 1.3 }}>
                      {styleIcon.quote}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TryOnCard;
