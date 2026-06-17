import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { User, Edit2, RefreshCw, Sliders, Palette, Ruler, Sparkles, Award, Check, X, Camera } from 'lucide-react';
import BrandMonogram from '../components/Common/BrandMonogram';
import ColorDropper from '../components/Common/ColorDropper';
import { analyzeSkinTone } from '../utils/colorTheory';

const DEMO_MODELS = {
  Female: [
    {
      name: 'Model (Warm Olive)',
      photo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
      defaultHex: '#BD9A7A'
    },
    {
      name: 'Model (Cool Rose)',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
      defaultHex: '#E8C5B0'
    },
    {
      name: 'Model (Rich Umber)',
      photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
      defaultHex: '#5A3D28'
    }
  ],
  Male: [
    {
      name: 'Model (Warm Almond)',
      photo: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=400',
      defaultHex: '#D2AC8D'
    },
    {
      name: 'Model (Cool Porcelain)',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      defaultHex: '#F2D5C4'
    },
    {
      name: 'Model (Deep Espresso)',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      defaultHex: '#422A1B'
    }
  ],
  Unisex: [
    {
      name: 'Model (Golden Beige)',
      photo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400',
      defaultHex: '#C69A75'
    },
    {
      name: 'Model (Alabaster)',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      defaultHex: '#EED6C4'
    }
  ]
};

const ProfileView = () => {
  const { userProfile, setUserProfile, updateSkinTone, isPremium, setIsPremium, resetApp } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showCalibrator, setShowCalibrator] = useState(false);

  // Calibration local states
  const [calibratePhoto, setCalibratePhoto] = useState(userProfile.referencePhoto);
  const [calibrateSkinTone, setCalibrateSkinTone] = useState(userProfile.skinToneHex || '#EAD4C3');

  // Sync calibrator photo when userProfile photo loads
  useEffect(() => {
    setCalibratePhoto(userProfile.referencePhoto);
    setCalibrateSkinTone(userProfile.skinToneHex || '#EAD4C3');
  }, [userProfile.referencePhoto, userProfile.skinToneHex]);

  // Editable local states
  const [editName, setEditName] = useState(userProfile.name || '');
  const [editGender, setEditGender] = useState(userProfile.gender || 'Female');
  const [editAgeGroup, setEditAgeGroup] = useState(userProfile.ageGroup || '25-34');
  const [editOccupation, setEditOccupation] = useState(userProfile.occupation || 'Creative & Artistic');
  const [editHeightCategory, setEditHeightCategory] = useState(userProfile.heightCategory || 'Average');
  const [editBodyShape, setEditBodyShape] = useState(userProfile.bodyShape || 'Hourglass');
  const [editStylingFocus, setEditStylingFocus] = useState(userProfile.stylingFocus || 'Define Waist');
  const [editStyleVibe, setEditStyleVibe] = useState(userProfile.styleVibe || 'Minimalist Editorial');
  const [editFitStyle, setEditFitStyle] = useState(userProfile.fitStyle || 'Tailored & Sharp');
  const [editColorPalettePref, setEditColorPalettePref] = useState(userProfile.colorPalettePref || 'Monochromatic Neutrals');

  const startEditing = () => {
    setEditName(userProfile.name || '');
    setEditGender(userProfile.gender || 'Female');
    setEditAgeGroup(userProfile.ageGroup || '25-34');
    setEditOccupation(userProfile.occupation || 'Creative & Artistic');
    setEditHeightCategory(userProfile.heightCategory || 'Average');
    setEditBodyShape(userProfile.bodyShape || 'Hourglass');
    setEditStylingFocus(userProfile.stylingFocus || 'Define Waist');
    setEditStyleVibe(userProfile.styleVibe || 'Minimalist Editorial');
    setEditFitStyle(userProfile.fitStyle || 'Tailored & Sharp');
    setEditColorPalettePref(userProfile.colorPalettePref || 'Monochromatic Neutrals');
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserProfile((prev) => ({
      ...prev,
      name: editName,
      gender: editGender,
      ageGroup: editAgeGroup,
      occupation: editOccupation,
      heightCategory: editHeightCategory,
      bodyShape: editBodyShape,
      stylingFocus: editStylingFocus,
      styleVibe: editStyleVibe,
      fitStyle: editFitStyle,
      colorPalettePref: editColorPalettePref,
      styleGoal: editStyleVibe // Sync styling goal
    }));
    setIsEditing(false);
  };

  const itemStyle = (isActive) => ({
    padding: '8px 10px',
    border: isActive ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-color)',
    backgroundColor: isActive ? 'rgba(179,146,102,0.05)' : 'var(--bg-surface)',
    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.7rem',
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
    borderRadius: 'var(--radius-xs)',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', padding: '16px 20px' }}>
      
      {/* HEADER: Profile overview card */}
      <div className="vogue-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
        
        {/* Elite Member Badge */}
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '6px' }}>
          <span 
            className="badge-gold" 
            style={{ 
              backgroundColor: isPremium ? 'var(--accent-gold-light)' : 'var(--border-color)',
              color: isPremium ? 'var(--accent-gold)' : 'var(--text-secondary)',
              borderColor: isPremium ? 'var(--accent-gold)' : 'var(--border-color)'
            }}
          >
            {isPremium ? 'Vogue Elite' : 'Standard'}
          </span>
        </div>

        {/* Circular Avatar Frame */}
        <div 
          style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            border: `3px double ${userProfile.skinToneHex || 'var(--accent-gold)'}`, 
            padding: '4px',
            backgroundColor: 'var(--bg-primary)',
            position: 'relative'
          }}
        >
          {userProfile.referencePhoto ? (
            <img 
              src={userProfile.referencePhoto} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
              <User size={36} color="var(--text-tertiary)" style={{ margin: 'auto' }} />
            </div>
          )}

          {/* Skin Tone Dot Indicator */}
          <div 
            title={`Skin Tone: ${userProfile.skinToneHex}`}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 4,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: userProfile.skinToneHex || '#EAD4C3',
              border: '2px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}
          />
        </div>

        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>
            {userProfile.name || 'Style Enthusiast'}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Sparkles size={12} color="var(--accent-gold)" />
            {userProfile.season || 'Calibrated'} Season Palette
          </p>
        </div>

        {!isEditing && (
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button 
              onClick={startEditing}
              className="btn-secondary"
              style={{ flex: 1, gap: '6px', padding: '10px 12px', fontSize: '0.72rem' }}
            >
              <Edit2 size={12} /> Edit Style
            </button>
            <button 
              onClick={() => setShowCalibrator(true)}
              className="btn-secondary"
              style={{ flex: 1, gap: '6px', padding: '10px 12px', fontSize: '0.72rem', borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}
            >
              <RefreshCw size={12} /> Recalibrate
            </button>
          </div>
        )}
      </div>

      {/* QUIZ AND PROFILE DNA DETAIL EDIT PANEL */}
      {isEditing ? (
        <div className="vogue-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Edit Quiz Details</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Gender Identity</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {['Female', 'Male', 'Unisex'].map((g) => (
                  <button key={g} type="button" onClick={() => setEditGender(g)} style={itemStyle(editGender === g)}>{g}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Age Group</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {['18-24', '25-34', '35-44', '45+'].map((a) => (
                  <button key={a} type="button" onClick={() => setEditAgeGroup(a)} style={itemStyle(editAgeGroup === a)}>{a}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Occupation</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {['Corporate Professional', 'Creative & Artistic', 'Academic & Student', 'Casual & Active'].map((occ) => (
                  <button key={occ} type="button" onClick={() => setEditOccupation(occ)} style={itemStyle(editOccupation === occ)}>{occ}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Height Range</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {['Petite', 'Average', 'Tall'].map((h) => (
                  <button key={h} type="button" onClick={() => setEditHeightCategory(h)} style={itemStyle(editHeightCategory === h)}>{h}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Body Shape</label>
              <select className="form-input" value={editBodyShape} onChange={(e) => setEditBodyShape(e.target.value)}>
                <option value="Hourglass">Hourglass</option>
                <option value="Rectangle">Rectangle</option>
                <option value="Pear">Pear</option>
                <option value="Inverted Triangle">Inverted Triangle</option>
                <option value="Apple">Apple</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Styling Focus</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {['Elongate Silhouette', 'Define Waist', 'Structural Shoulders', 'Relaxed Comfort'].map((focus) => (
                  <button key={focus} type="button" onClick={() => setEditStylingFocus(focus)} style={itemStyle(editStylingFocus === focus)}>{focus}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Style Vibe</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {['Minimalist Editorial', 'Streetwear & Sporty', 'Vintage & Bohemian', 'Bold Avant-Garde'].map((vibe) => (
                  <button key={vibe} type="button" onClick={() => setEditStyleVibe(vibe)} style={itemStyle(editStyleVibe === vibe)}>{vibe}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Preferred Fit</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['Tailored & Sharp', 'Oversized & Relaxed', 'Form-fitting & Sleek'].map((fit) => (
                  <button key={fit} type="button" onClick={() => setEditFitStyle(fit)} style={itemStyle(editFitStyle === fit)}>{fit}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Color Palette Tone</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {['Monochromatic Neutrals', 'Bold Contrast Hues', 'Soft Earthy Pastels', 'Rich Jewel Tones'].map((paletteName) => (
                  <button key={paletteName} type="button" onClick={() => setEditColorPalettePref(paletteName)} style={itemStyle(editColorPalettePref === paletteName)}>{paletteName}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => setIsEditing(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleSave} className="btn-gold" style={{ flex: 1, gap: '6px' }}><Check size={14} /> Save</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* STATIC: Style DNA Profiles Grid */}
          <div className="vogue-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={16} color="var(--accent-gold)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Styling & Body DNA</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 16px', fontSize: '0.75rem' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Gender</strong>
                <span style={{ color: 'var(--text-secondary)' }}>{userProfile.gender || 'Female'}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Height Category</strong>
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
                <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Body Shape</strong>
                <span style={{ color: 'var(--text-secondary)' }}>{userProfile.bodyShape || 'Hourglass'}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Styling Focus</strong>
                <span style={{ color: 'var(--text-secondary)' }}>{userProfile.stylingFocus || 'Define Waist'}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Style Vibe</strong>
                <span style={{ color: 'var(--text-secondary)' }}>{userProfile.styleVibe || 'Minimalist Editorial'}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Preferred Fit</strong>
                <span style={{ color: 'var(--text-secondary)' }}>{userProfile.fitStyle || 'Tailored & Sharp'}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em', marginBottom: '2px' }}>Color Palette Tone</strong>
                <span style={{ color: 'var(--text-secondary)' }}>{userProfile.colorPalettePref || 'Monochromatic Neutrals'}</span>
              </div>
            </div>
          </div>

          {/* COLOR PALETTE COMPLEMENTARY DETAILS */}
          {userProfile.colorPalette && userProfile.colorPalette.length > 0 && (
            <div className="vogue-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={16} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Complementary Palette</h3>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                {userProfile.colorJustification}
              </p>

              {/* Swatch Feed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                {userProfile.colorPalette.map((color, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: color.hex,
                        border: '1px solid var(--border-color)',
                        flexShrink: 0
                      }} 
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{color.name}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{color.hex}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{color.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPLICATION SETTINGS & ACCOUNT RESET */}
          <div className="vogue-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid rgba(201, 107, 107, 0.2)', backgroundColor: 'rgba(201, 107, 107, 0.01)' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--error-rose)', margin: 0 }}>System Preferences</h4>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Manage account parameters and cache data.</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setIsPremium(!isPremium)}
                className="btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '0.7rem', border: '1px solid var(--border-color)' }}
              >
                Toggle Premium Status
              </button>
              <button 
                onClick={resetApp}
                className="btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '0.7rem', borderColor: 'var(--error-rose)', color: 'var(--error-rose)' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--error-rose)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                  e.currentTarget.style.color = 'var(--error-rose)';
                }}
              >
                Reset App Data <RefreshCw size={10} style={{ marginLeft: '4px' }} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* SKIN TONE CALIBRATION BOTTOM DRAWER MODAL */}
      {showCalibrator && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              maxHeight: '90vh',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
              animation: 'slideUp 0.4s ease forwards'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={18} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>Skin Tone Calibration</h3>
              </div>
              <button 
                onClick={() => setShowCalibrator(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="no-scrollbar">
              
              {/* Photo selector & uploader */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: '1px dashed var(--accent-gold)',
                      padding: '10px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'rgba(179,146,102,0.02)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Camera size={14} color="var(--accent-gold)" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setCalibratePhoto(event.target.result);
                            setCalibrateSkinTone('#EAD4C3'); // Reset skin tone
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Demo Silhouette models select */}
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                    Or select a demo silhouette:
                  </span>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
                    {(DEMO_MODELS[userProfile.gender] || DEMO_MODELS.Female).map((model, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCalibratePhoto(model.photo);
                          setCalibrateSkinTone(model.defaultHex);
                        }}
                        style={{
                          flexShrink: 0,
                          width: '74px',
                          border: calibratePhoto === model.photo ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-color)',
                          background: calibratePhoto === model.photo ? 'rgba(179,146,102,0.03)' : 'none',
                          borderRadius: 'var(--radius-xs)',
                          padding: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <img
                          src={model.photo}
                          alt={model.name}
                          style={{
                            width: '60px',
                            height: '75px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-xs)'
                          }}
                        />
                        <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>
                          {model.name.replace('Model ', '')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Color Dropper Component */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                {calibratePhoto ? (
                  <ColorDropper
                    imageSrc={calibratePhoto}
                    onColorSelected={setCalibrateSkinTone}
                    initialColor={calibrateSkinTone}
                  />
                ) : (
                  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyItems: 'center', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ margin: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Upload or select a photo to begin calibration</span>
                  </div>
                )}
              </div>

              {/* Real-time season analysis preview */}
              {calibrateSkinTone && (
                <div 
                  style={{ 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: '16px',
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '10px' 
                  }}
                >
                  {(() => {
                    const analysis = analyzeSkinTone(calibrateSkinTone);
                    return (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Detected Season: <span style={{ color: 'var(--accent-gold)' }}>{analysis.season} ({analysis.undertone})</span>
                          </span>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                          {analysis.justification}
                        </p>
                        
                        {/* Color swatches preview */}
                        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
                          {analysis.palette.map((color, index) => (
                            <div 
                              key={index}
                              title={color.name}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: color.hex,
                                border: '1px solid var(--border-color)',
                                flexShrink: 0
                              }}
                            />
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', gap: '10px', padding: '16px 20px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
              <button 
                onClick={() => setShowCalibrator(false)} 
                className="btn-secondary" 
                style={{ flex: 1, padding: '10px' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  updateSkinTone(calibrateSkinTone);
                  setUserProfile(prev => ({
                    ...prev,
                    referencePhoto: calibratePhoto
                  }));
                  setShowCalibrator(false);
                }} 
                className="btn-gold" 
                style={{ flex: 1, padding: '10px' }}
              >
                Save Calibration
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileView;
