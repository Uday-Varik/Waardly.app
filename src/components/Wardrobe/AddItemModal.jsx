import React, { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { X, Camera, RefreshCw, Check, Loader2, Sparkles, Upload } from 'lucide-react';

const AddItemModal = ({ onClose }) => {
  const { addWardrobeItem } = useContext(AppContext);

  // States
  const [useCamera, setUseCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: input, 1: scanning, 2: edit tags
  
  // Tag fields (to be filled by AI Tagger)
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tops');
  const [colorName, setColorName] = useState('Charcoal');
  const [colorHex, setColorHex] = useState('#222222');
  const [pattern, setPattern] = useState('Solid');
  const [itemOccasions, setItemOccasions] = useState(['Casual']);
  const [formalLevel, setFormalLevel] = useState('Casual');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Demo garments for quick camera-free simulation
  const demoGarments = [
    {
      name: 'Structured Linen Blazer',
      category: 'Outerwear',
      colorName: 'Sage Green',
      colorHex: '#608066',
      pattern: 'Solid',
      occasions: ['Work', 'Date', 'Casual', 'Formal'],
      formalLevel: 'Smart-Casual',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Cropped Knit Vest',
      category: 'Tops',
      colorName: 'Warm Honey',
      colorHex: '#DDB65B',
      pattern: 'Solid',
      occasions: ['Casual', 'Date', 'Travel'],
      formalLevel: 'Casual',
      image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Pleated Cream Skirt',
      category: 'Bottoms',
      colorName: 'Cream Ivory',
      colorHex: '#FFFFF0',
      pattern: 'Solid',
      occasions: ['Date', 'Formal', 'Casual'],
      formalLevel: 'Smart-Casual',
      image: 'https://images.unsplash.com/photo-1583496661160-fb48862c4a4e?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Chelsea Suede Boots',
      category: 'Footwear',
      colorName: 'Espresso Brown',
      colorHex: '#4A3B32',
      pattern: 'Solid',
      occasions: ['Work', 'Date', 'Casual', 'Formal'],
      formalLevel: 'Smart-Casual',
      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=300'
    }
  ];

  // Access user camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer rear camera on mobile
      });
      setCameraStream(stream);
      setUseCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable: ', err);
      alert('Camera access not supported or denied. Please use File Upload or Demo simulation.');
    }
  };

  // Close camera stream
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

  // Compress and downscale base64 images to stay under localStorage limits
  const compressImage = (base64Str, maxWidth = 400, maxHeight = 400) => {
    return new Promise((resolve) => {
      if (!base64Str || !base64Str.startsWith('data:')) {
        resolve(base64Str);
        return;
      }
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg');
    compressImage(dataUrl).then(compressedUrl => {
      setCapturedImage(compressedUrl);
      stopCamera();
      runAITaggerSimulation(compressedUrl, 'Captured Item');
    });
  };

  // Upload file handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawUrl = event.target.result;
        compressImage(rawUrl).then(compressedUrl => {
          setCapturedImage(compressedUrl);
          runAITaggerSimulation(compressedUrl, file.name.split('.')[0] || 'Uploaded Item');
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger simulated tagging logs before form displays
  const runAITaggerSimulation = (imageSrc, defaultName) => {
    setScanStep(1); // Show scanning screen
    setIsScanning(true);

    // AI tags simulation based on default name or demo selection
    // Set default values that look smart
    setName(defaultName || 'Silk Top');
    setCategory('Tops');
    setColorName('Teal Green');
    setColorHex('#004D40');
    setPattern('Solid');
    setItemOccasions(['Work', 'Casual']);
    setFormalLevel('Smart-Casual');

    // Simulate logs running in interval
    setTimeout(() => {
      setIsScanning(false);
      setScanStep(2); // Show Edit Form
    }, 2200);
  };

  const selectDemoGarment = (demo) => {
    setCapturedImage(demo.image);
    setScanStep(1); // scanning
    setIsScanning(true);

    setName(demo.name);
    setCategory(demo.category);
    setColorName(demo.colorName);
    setColorHex(demo.colorHex);
    setPattern(demo.pattern);
    setItemOccasions(demo.occasions);
    setFormalLevel(demo.formalLevel);

    setTimeout(() => {
      setIsScanning(false);
      setScanStep(2); // show edit form
    }, 2200);
  };

  // Toggle occasion choices
  const toggleOccasion = (occ) => {
    setItemOccasions(prev => 
      prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ]
    );
  };

  const handleSave = () => {
    addWardrobeItem({
      name,
      category,
      colorName,
      colorHex,
      pattern,
      occasions: itemOccasions,
      formalLevel,
      image: capturedImage
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--bg-primary)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        animation: 'var(--transition-normal) slideUp'
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Modal Sticky Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color="var(--accent-gold)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>Scan Clothing Item</h3>
        </div>
        <button 
          onClick={() => { stopCamera(); onClose(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }} className="no-scrollbar">
        
        {/* STEP 0: Inputs & Viewfinders */}
        {scanStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Viewfinder block */}
            {useCamera ? (
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '300px', 
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
                {/* Sweep scan lines */}
                <div 
                  className="animate-sweep"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
                    boxShadow: '0 0 10px var(--accent-gold)',
                    pointerEvents: 'none'
                  }}
                />
                {/* Viewfinder Target Brackets */}
                <div style={{ position: 'absolute', top: 20, left: 20, width: 20, height: 20, borderTop: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)' }} />
                <div style={{ position: 'absolute', top: 20, right: 20, width: 20, height: 20, borderTop: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)' }} />
                <div style={{ position: 'absolute', bottom: 20, left: 20, width: 20, height: 20, borderBottom: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)' }} />
                <div style={{ position: 'absolute', bottom: 20, right: 20, width: 20, height: 20, borderBottom: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)' }} />

                {/* Shutter Capture Button */}
                <button
                  onClick={capturePhoto}
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '4px solid rgba(179,146,102,0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--text-primary)' }} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Camera Trigger */}
                <button
                  onClick={startCamera}
                  className="btn-primary"
                  style={{ gap: '8px', padding: '24px' }}
                >
                  <Camera size={20} /> Use Camera Viewfinder
                </button>

                {/* Drag-and-drop / File input */}
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px dashed var(--border-color)',
                    padding: '30px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <Upload size={24} color="var(--accent-gold)" style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Upload Outfit File</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    Select a photo from your gallery
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                {/* Simulated Quick Clothes Trigger */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    Or click a demo item to scan:
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {demoGarments.map((demo, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectDemoGarment(demo)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <img 
                          src={demo.image} 
                          alt="" 
                          style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} 
                        />
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {demo.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* STEP 1: AI Tagger Scanning state */}
        {scanStep === 1 && (
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '60px 20px',
              gap: '24px'
            }}
          >
            <div style={{ position: 'relative', width: '180px', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img src={capturedImage} alt="Scanning" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
              {/* Sweep Line */}
              <div className="animate-sweep" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: 'var(--accent-gold)', boxShadow: '0 0 12px var(--accent-gold)' }} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <Loader2 size={24} className="text-gold" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 12px auto' }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              <h4 style={{ fontSize: '1rem', fontWeight: 500, margin: '0 0 8px 0' }}>AI Tagger Extracting Metadata</h4>
              
              {/* Simulated terminal logs */}
              <div 
                style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.65rem', 
                  color: 'var(--accent-gold)', 
                  backgroundColor: '#1C1C1A',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-xs)',
                  width: '260px',
                  textAlign: 'left',
                  height: '60px',
                  overflow: 'hidden',
                  lineHeight: 1.4
                }}
              >
                <div style={{ animation: 'shimmer 1.5s infinite' }}>
                  &gt; Analyzing RGB color channels...<br />
                  &gt; Classifying fabric structure...<br />
                  &gt; Tagging style categories...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Editing Tags Form */}
        {scanStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Visual Header */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <img src={capturedImage} alt="Analyzed" style={{ width: '64px', height: '84px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} />
              <div>
                <span className="badge-gold">AI Scan Match 100%</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 500, margin: '4px 0 0 0' }}>Verify Clothes Tags</h4>
              </div>
            </div>

            {/* Editing inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Garment Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select 
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Garment Pattern
                  </label>
                  <select 
                    className="form-input"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                  >
                    <option value="Solid">Solid</option>
                    <option value="Striped">Striped</option>
                    <option value="Plaid">Plaid</option>
                    <option value="Patterned">Patterned</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Detected Color
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Color Hex
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      style={{ width: '40px', height: '40px', border: '1px solid var(--border-color)', padding: 0, borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={colorHex.toUpperCase()}
                      onChange={(e) => setColorHex(e.target.value)}
                      style={{ fontFamily: 'monospace' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Formal Rating
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Casual', 'Smart-Casual', 'Formal'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormalLevel(f)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: formalLevel === f ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                        backgroundColor: formalLevel === f ? 'rgba(179,146,102,0.04)' : 'transparent',
                        color: formalLevel === f ? 'var(--accent-gold)' : 'var(--text-secondary)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: formalLevel === f ? 600 : 400,
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-xs)'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Assign Occasions
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Work', 'Date', 'Party', 'Casual', 'Formal', 'Travel', 'Gym'].map((o) => {
                    const active = itemOccasions.includes(o);
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => toggleOccasion(o)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid',
                          borderColor: active ? 'var(--text-primary)' : 'var(--border-color)',
                          backgroundColor: active ? 'var(--text-primary)' : 'transparent',
                          color: active ? 'var(--bg-surface)' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontFamily: 'Inter, sans-serif',
                          cursor: 'pointer',
                          borderRadius: '20px',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              <button
                type="button"
                className="btn-gold"
                onClick={handleSave}
                style={{ gap: '8px' }}
              >
                <Check size={16} /> Save to Wardrobe
              </button>
              
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setScanStep(0)}
              >
                Retake Scan
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AddItemModal;
