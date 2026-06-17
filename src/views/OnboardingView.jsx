import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ColorDropper from '../components/Common/ColorDropper';
import { Sparkles, Camera, ArrowRight, ArrowLeft, User, Palette, Ruler, Briefcase, Sliders } from 'lucide-react';
import BrandMonogram from '../components/Common/BrandMonogram';

const OnboardingView = () => {
  const { completeOnboarding } = useContext(AppContext);
  const [step, setStep] = useState(0);
  
  // Quiz states
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('25-34');
  const [occupation, setOccupation] = useState('Creative & Artistic');
  
  const [gender, setGender] = useState('Female');
  const [heightCategory, setHeightCategory] = useState('Average');
  const [bodyShape, setBodyShape] = useState('Hourglass');
  const [stylingFocus, setStylingFocus] = useState('Define Waist');
  
  const [styleVibe, setStyleVibe] = useState('Minimalist Editorial');
  const [fitStyle, setFitStyle] = useState('Tailored & Sharp');
  const [colorPalettePref, setColorPalettePref] = useState('Monochromatic Neutrals');
  const [styleGoal, setStyleGoal] = useState('Effortless Chic');
  
  const [referencePhoto, setReferencePhoto] = useState(null);
  const [sampledColor, setSampledColor] = useState('#EAD4C3');

  // High-fashion demo models for rapid testing (standing full-body against simple backdrops)
  const demoModels = {
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferencePhoto(event.target.result);
        setSampledColor('#EAD4C3'); // Reset to default skin tone placeholder
        setStep(5);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectDemoModel = (model) => {
    setReferencePhoto(model.photo);
    setSampledColor(model.defaultHex);
    setStep(5);
  };

  const handleComplete = () => {
    completeOnboarding(
      {
        name: name || 'Fashionist',
        gender,
        bodyShape,
        styleGoal: styleGoal || styleVibe,
        ageGroup,
        occupation,
        heightCategory,
        stylingFocus,
        styleVibe,
        fitStyle,
        colorPalettePref,
        skinToneHex: sampledColor
      },
      referencePhoto
    );
  };

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
      
      {/* STEP 0: Welcome Screen */}
      {step === 0 && (
        <div className="vogue-card animate-slideup" style={{ padding: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* High-fashion cover image */}
          <div style={{ width: '100%', height: '220px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#EAE7E1' }}>
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=500" 
              alt="High Fashion Cover" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <BrandMonogram size={48} />
            <div>
              <span className="badge-gold" style={{ marginBottom: '6px' }}>AI Wardrobe Styling</span>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display, serif', fontWeight: 600, margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Waardly
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '6px' }}>
                "You have a full closet, yet nothing to wear. We fix that."
              </p>
            </div>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '18px 4px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent-gold)', fontSize: '1.1rem', marginTop: '-2px' }}>✦</span>
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>Photorealistic Try-On</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>See outfit matches projected directly onto your body silhouette.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent-gold)', fontSize: '1.1rem', marginTop: '-2px' }}>✦</span>
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>Color Theory Undertones</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Auto-detect skin tones and receive color tag recommendations.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent-gold)', fontSize: '1.1rem', marginTop: '-2px' }}>✦</span>
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>5-Layer Styling Logic</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Detailed justifications matching occasion, color harmony and style icons.</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-gold"
            onClick={() => setStep(1)}
            style={{ width: '100%', padding: '14px', gap: '8px' }}
          >
            Start Styling Journey <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Editorial Header (Only for Steps 1, 2, 3, 4) */}
      {step > 0 && step < 5 && (
        <div style={{ textAlign: 'center', marginBottom: '20px', animation: 'var(--transition-normal) fadeIn' }}>
          <span className="badge-gold" style={{ marginBottom: '8px' }}>Waardly AI</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
            Create Your Profile
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Personalize your digital wardrobe shell
          </p>
        </div>
      )}

      {/* Step Indicators (Steps 1 to 5) */}
      {step > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '24px', animation: 'var(--transition-normal) fadeIn' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <React.Fragment key={i}>
              <div 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: step >= i ? 'var(--accent-gold)' : 'var(--border-color)', 
                  transition: 'background-color 0.3s' 
                }} 
              />
              {i < 5 && (
                <div 
                  style={{ 
                    width: '16px', 
                    height: '1.5px', 
                    backgroundColor: step >= i + 1 ? 'var(--accent-gold)' : 'var(--border-color)', 
                    transition: 'background-color 0.3s' 
                  }} 
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* helper styling function for quiz selectors */}
      {(() => {
        const selectItemStyle = (isActive) => ({
          flex: 1,
          padding: '10px 8px',
          border: isActive ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-color)',
          backgroundColor: isActive ? 'rgba(179,146,102,0.05)' : 'var(--bg-surface)',
          color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.75rem',
          fontWeight: isActive ? 600 : 400,
          cursor: 'pointer',
          borderRadius: 'var(--radius-xs)',
          transition: 'all 0.2s ease',
          textAlign: 'center'
        });

        return (
          <>
            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <div className="vogue-card" style={{ animation: 'var(--transition-normal) slideUp', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="var(--accent-gold)" />
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Step 1: Your Details</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Age Group
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {['18-24', '25-34', '35-44', '45+'].map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setAgeGroup(a)}
                          style={selectItemStyle(ageGroup === a)}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Daily Occupation / Vibe
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['Corporate Professional', 'Creative & Artistic', 'Academic & Student', 'Casual & Active'].map((occ) => (
                        <button
                          key={occ}
                          type="button"
                          onClick={() => setOccupation(occ)}
                          style={{
                            ...selectItemStyle(occupation === occ),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px'
                          }}
                        >
                          <Briefcase size={12} />
                          {occ}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setStep(2)}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    Continue to Body Profile <ArrowRight size={14} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Body Details */}
            {step === 2 && (
              <div className="vogue-card" style={{ animation: 'var(--transition-normal) slideUp', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Ruler size={16} color="var(--accent-gold)" />
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Step 2: Body Profile</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Gender Identity
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['Female', 'Male', 'Unisex'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          style={selectItemStyle(gender === g)}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Height Category
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['Petite', 'Average', 'Tall'].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setHeightCategory(h)}
                          style={selectItemStyle(heightCategory === h)}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Body Shape Reference
                    </label>
                    <select
                      className="form-input"
                      value={bodyShape}
                      onChange={(e) => setBodyShape(e.target.value)}
                      style={{ appearance: 'none', backgroundPosition: 'right 16px center' }}
                    >
                      <option value="Hourglass">Hourglass (Balanced Curve)</option>
                      <option value="Rectangle">Rectangle (Athletic Straight)</option>
                      <option value="Pear">Pear (Lower Volume Accent)</option>
                      <option value="Inverted Triangle">Inverted Triangle (Upper Volume Accent)</option>
                      <option value="Apple">Oval / Apple (Soft Midsection)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Styling Focus Area
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {['Elongate Silhouette', 'Define Waist', 'Structural Shoulders', 'Relaxed Comfort'].map((focus) => (
                        <button
                          key={focus}
                          type="button"
                          onClick={() => setStylingFocus(focus)}
                          style={selectItemStyle(stylingFocus === focus)}
                        >
                          {focus}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setStep(1)}
                      style={{ flex: 1 }}
                    >
                      <ArrowLeft size={14} style={{ marginRight: '8px' }} /> Back
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setStep(3)}
                      style={{ flex: 2 }}
                    >
                      Continue <ArrowRight size={14} style={{ marginLeft: '8px' }} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Style Preferences */}
            {step === 3 && (
              <div className="vogue-card" style={{ animation: 'var(--transition-normal) slideUp', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={16} color="var(--accent-gold)" />
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Step 3: Style DNA</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Preferred Style Vibe
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {['Minimalist Editorial', 'Streetwear & Sporty', 'Vintage & Bohemian', 'Bold Avant-Garde'].map((vibe) => (
                        <button
                          key={vibe}
                          type="button"
                          onClick={() => setStyleVibe(vibe)}
                          style={selectItemStyle(styleVibe === vibe)}
                        >
                          {vibe}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Silhouette Fit Preference
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['Tailored & Sharp', 'Oversized & Relaxed', 'Form-fitting & Sleek'].map((fit) => (
                        <button
                          key={fit}
                          type="button"
                          onClick={() => setFitStyle(fit)}
                          style={selectItemStyle(fitStyle === fit)}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Color Palette Tone
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {['Monochromatic Neutrals', 'Bold Contrast Hues', 'Soft Earthy Pastels', 'Rich Jewel Tones'].map((paletteName) => (
                        <button
                          key={paletteName}
                          type="button"
                          onClick={() => setColorPalettePref(paletteName)}
                          style={selectItemStyle(colorPalettePref === paletteName)}
                        >
                          {paletteName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setStep(2)}
                      style={{ flex: 1 }}
                    >
                      <ArrowLeft size={14} style={{ marginRight: '8px' }} /> Back
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setStep(4)}
                      style={{ flex: 2 }}
                    >
                      Continue <ArrowRight size={14} style={{ marginLeft: '8px' }} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {/* STEP 4: Photo Upload */}
      {step === 4 && (
        <div className="vogue-card" style={{ animation: 'var(--transition-normal) slideUp' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Camera size={16} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Step 4: Reference Photo</h3>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.4 }}>
            Upload a clear, full-body photo of yourself standing straight in simple clothes. We use this to analyze your skin tone and project outfits onto you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Native file uploader */}
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px dashed var(--accent-gold)',
                padding: '32px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(179,146,102,0.02)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(179,146,102,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(179,146,102,0.02)'}
            >
              <Camera size={28} color="var(--accent-gold)" style={{ marginBottom: '10px' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Upload From Device
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                JPEG, PNG supported
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Or select a demo silhouette
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            </div>

            {/* Demo Models List */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
              {demoModels[gender]?.map((model, idx) => (
                <button
                  key={idx}
                  onClick={() => selectDemoModel(model)}
                  style={{
                    flexShrink: 0,
                    width: '100px',
                    border: '1px solid var(--border-color)',
                    background: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <img
                    src={model.photo}
                    alt={model.name}
                    style={{
                      width: '80px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-xs)'
                    }}
                  />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>
                    {model.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setStep(3)}
              style={{ width: '100%' }}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Skin Undertone Calibration */}
      {step === 5 && (
        <div className="vogue-card" style={{ animation: 'var(--transition-normal) slideUp' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Palette size={16} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Step 5: Skin Color Calibration</h3>
          </div>

          <ColorDropper
            imageSrc={referencePhoto}
            onColorSelected={setSampledColor}
            initialColor={sampledColor}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn-gold"
              onClick={handleComplete}
              style={{ width: '100%' }}
            >
              Unlock My Closet <Sparkles size={14} style={{ marginLeft: '8px' }} />
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setStep(4)}
              style={{ width: '100%' }}
            >
              Back to Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingView;
