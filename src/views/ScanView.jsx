import React, { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import InteractiveCanvas from '../components/TryOn/InteractiveCanvas';
import { Camera, Sparkles, CheckCircle2, ChevronRight, Barcode, ShieldAlert, Loader2 } from 'lucide-react';

const ScanView = () => {
  const { wardrobe, userProfile } = useContext(AppContext);

  // Scanner States
  const [useCamera, setUseCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: scanning, 1: loading catalog, 2: results
  
  const [scannedItem, setScannedItem] = useState(null);
  const [compatibilityScore, setCompatibilityScore] = useState(0);
  const [matchingClosetItems, setMatchingClosetItems] = useState([]);
  const [showInStoreTryOn, setShowInStoreTryOn] = useState(false);

  const videoRef = useRef(null);

  // In-Store Demo Retail Tags
  const demoStoreItems = [
    {
      id: 'tag_1',
      name: 'Zara Silk Tailored Shirt',
      category: 'Tops',
      colorName: 'Sage Green',
      colorHex: '#87A987',
      pattern: 'Solid',
      brand: 'Zara Special Collection',
      price: '$59.90',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=300'
    },
    {
      id: 'tag_2',
      name: 'Farfetch Pleated Khaki Trouser',
      category: 'Bottoms',
      colorName: 'Warm Taupe',
      colorHex: '#B38B6D',
      pattern: 'Solid',
      brand: 'Loro Piana',
      price: '$380.00',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=300'
    },
    {
      id: 'tag_3',
      name: 'Chanel Classic Bouclé Vest',
      category: 'Outerwear',
      colorName: 'Ivory Cream',
      colorHex: '#FFFFF0',
      pattern: 'Solid',
      brand: 'Chanel',
      price: '$2,100.00',
      image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&q=80&w=300'
    }
  ];

  // Access user camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      setUseCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable: ', err);
      alert('Camera access denied. Please select a Demo Tag to simulate scans.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setUseCamera(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [cameraStream]);

  // Handle Barcode Scan trigger
  const triggerScan = (item) => {
    stopCamera();
    setScannedItem(item);
    setShowInStoreTryOn(false);
    setScanStep(1); // loading catalog

    // Calculate compatibility score
    // Score increases based on number of compatible items in wardrobe
    // Tops match bottoms/outerwear, bottoms match tops, etc.
    const compatible = wardrobe.filter(owned => {
      if (item.category === 'Tops') return owned.category === 'Bottoms' || owned.category === 'Outerwear';
      if (item.category === 'Bottoms') return owned.category === 'Tops' || owned.category === 'Footwear';
      if (item.category === 'Outerwear') return owned.category === 'Tops' || owned.category === 'Bottoms';
      return owned.category === 'Tops' || owned.category === 'Bottoms';
    });

    setMatchingClosetItems(compatible);

    const baseScore = 40;
    const itemsBonus = Math.min(compatible.length * 12, 55); // Max 95%
    setCompatibilityScore(baseScore + itemsBonus);

    // Simulate database lookup
    setTimeout(() => {
      setScanStep(2); // results screen
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '20px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <span className="badge-gold">Retail Scan 3.3</span>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 500, margin: '4px 0 0 0' }}>In-Store Compatibility</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Scan clothing price tags while shopping to check wardrobe matches
        </p>
      </div>

      {/* STEP 0: Scanner viewport selection */}
      {scanStep === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {useCamera ? (
            <div 
              style={{ 
                position: 'relative', 
                width: '100%', 
                height: '320px', 
                backgroundColor: '#000000', 
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden' 
              }}
            >
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              {/* Sweep Line */}
              <div 
                className="animate-sweep"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
                  boxShadow: '0 0 10px var(--accent-gold)'
                }}
              />

              {/* Red Laser Barcode Line in center */}
              <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '1.5px', backgroundColor: '#FF3B30', boxShadow: '0 0 8px #FF3B30' }} />

              {/* Corner Targets */}
              <div style={{ position: 'absolute', top: 30, left: 30, width: 24, height: 24, borderTop: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)' }} />
              <div style={{ position: 'absolute', top: 30, right: 30, width: 24, height: 24, borderTop: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)' }} />
              <div style={{ position: 'absolute', bottom: 30, left: 30, width: 24, height: 24, borderBottom: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)' }} />
              <div style={{ position: 'absolute', bottom: 30, right: 30, width: 24, height: 24, borderBottom: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)' }} />

              <button
                onClick={() => triggerScan(demoStoreItems[Math.floor(Math.random() * demoStoreItems.length)])}
                className="btn-gold"
                style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', padding: '8px 16px', fontSize: '0.75rem', gap: '4px' }}
              >
                <Barcode size={14} /> Simulate Barcode Detection
              </button>
            </div>
          ) : (
            <div className="vogue-card" style={{ margin: 0, padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <Barcode size={22} color="var(--accent-gold)" />
              </div>
              
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 4px 0' }}>Scan Barcode Tag</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto', lineHeight: 1.4 }}>
                  Connect camera to look up barcode labels on items in clothing stores and check your wardrobe alignment.
                </p>
              </div>

              <button onClick={startCamera} className="btn-primary" style={{ gap: '8px' }}>
                <Camera size={16} /> Start Scan Viewfinder
              </button>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Or simulate scanning a retail tag:
                </span>
                
                {demoStoreItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => triggerScan(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <img src={item.image} alt="" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{item.name}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{item.brand} • {item.price}</span>
                    </div>
                    <ChevronRight size={14} color="var(--text-tertiary)" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* STEP 1: Lookup Loading */}
      {scanStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px' }}>
          <Loader2 size={32} color="var(--accent-gold)" style={{ animation: 'spin 1.5s linear infinite' }} />
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 500, margin: '0 0 4px 0' }}>Analyzing Barcode Tag</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Checking compatibility against your {wardrobe.length} closet items...
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: Compatibility Analysis Results */}
      {scanStep === 2 && scannedItem && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'var(--transition-normal) fadeIn' }}>
          
          {/* Card header */}
          <div className="vogue-card" style={{ margin: 0, padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img src={scannedItem.image} alt="" style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} />
            <div>
              <span className="badge-gold">{scannedItem.brand}</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 500, margin: '4px 0 2px 0' }}>{scannedItem.name}</h4>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{scannedItem.price}</span>
            </div>
          </div>

          {/* Compatibility score radial gauge */}
          <div 
            className="vogue-card" 
            style={{ 
              margin: 0, 
              padding: '24px 16px', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid var(--accent-gold)',
              backgroundColor: 'rgba(179,146,102,0.03)'
            }}
          >
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Closet Compatibility Score
            </span>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Score text indicator */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {compatibilityScore}%
                </span>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.05em', marginTop: '2px' }}>
                  {compatibilityScore >= 75 ? 'Highly Compatible' : 'Moderate Match'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto', lineHeight: 1.35 }}>
              {compatibilityScore >= 75 
                ? `This item fits seamlessly! It matches ${matchingClosetItems.length} items in your closet and aligns with your ${userProfile.season} color profile.`
                : `This item matches ${matchingClosetItems.length} items. Keep in mind it matches fewer pieces than average.`}
            </p>
          </div>

          {/* Closet Matches list */}
          <div className="vogue-card" style={{ margin: 0, padding: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', margin: '0 0 12px 0', fontWeight: 600 }}>
              Pairs with these items you own ({matchingClosetItems.length})
            </h4>

            {matchingClosetItems.length === 0 ? (
              <div style={{ display: 'flex', gap: '8px', padding: '10px', backgroundColor: 'var(--error-rose-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--error-rose)' }}>
                <ShieldAlert size={16} color="var(--error-rose)" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.7rem', color: 'var(--error-rose)', margin: 0 }}>
                  No compatible items found. Buying this will require adding new base layers to your closet to wear it effectively.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {matchingClosetItems.slice(0, 3).map(owned => (
                  <div key={owned.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px', borderBottom: '1px solid var(--border-color)' }}>
                    <img src={owned.image} alt="" style={{ width: '24px', height: '32px', objectFit: 'cover', borderRadius: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{owned.name}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block' }}>{owned.colorName} • {owned.category}</span>
                    </div>
                    <CheckCircle2 size={14} color="var(--success-sage)" />
                  </div>
                ))}
                {matchingClosetItems.length > 3 && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textAlign: 'center', display: 'block', marginTop: '4px' }}>
                    + {matchingClosetItems.length - 3} other items in your closet
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setShowInStoreTryOn(prev => !prev)}
              className="btn-gold"
              style={{ width: '100%', gap: '6px' }}
            >
              {showInStoreTryOn ? 'Hide Body Preview' : 'Preview On My Body'}
            </button>
            <button
              onClick={() => setScanStep(0)}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              Scan Another Tag
            </button>
          </div>

          {/* Try On Preview Container */}
          {showInStoreTryOn && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 500 }}>Fit Preview Layer</h4>
              <InteractiveCanvas
                referencePhoto={userProfile.referencePhoto}
                topItem={scannedItem.category === 'Tops' || scannedItem.category === 'Outerwear' ? scannedItem : null}
                bottomItem={scannedItem.category === 'Bottoms' ? scannedItem : null}
              />
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ScanView;
