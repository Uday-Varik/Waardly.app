import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import WardrobeGrid from '../components/Wardrobe/WardrobeGrid';
import AddItemModal from '../components/Wardrobe/AddItemModal';
import InteractiveCanvas from '../components/TryOn/InteractiveCanvas';
import { Shirt, FileText, Crop, ArrowRight, Sparkles, Check, Loader2, RefreshCw } from 'lucide-react';

const WardrobeView = () => {
  const { addWardrobeItem, userProfile } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('catalog'); // 'catalog', 'receipt', 'screenshot'
  const [showScanModal, setShowScanModal] = useState(false);

  // Ingestion states
  const [isImporting, setIsImporting] = useState(false);
  const [importLogs, setImportLogs] = useState([]);
  const [importedItemName, setImportedItemName] = useState(null);

  // Screenshot states
  const [screenshotSrc, setScreenshotSrc] = useState(null);
  const [cropBox, setCropBox] = useState({ top: 20, left: 20, width: 60, height: 60 });
  const [screenshotItem, setScreenshotItem] = useState(null);
  const [showScreenshotTryOn, setShowScreenshotTryOn] = useState(false);

  // Demo receipt options
  const demoReceipts = [
    {
      store: 'Amazon Fashion',
      orderId: '#403-294021-93',
      item: {
        name: 'Premium Wool Blazer',
        category: 'Outerwear',
        colorName: 'Charcoal Black',
        colorHex: '#1F1F21',
        pattern: 'Solid',
        occasions: ['Work', 'Formal', 'Date'],
        formalLevel: 'Formal',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300'
      }
    },
    {
      store: 'Myntra Luxe',
      orderId: '#MY-9204928-2',
      item: {
        name: 'Striped Linen Trousers',
        category: 'Bottoms',
        colorName: 'Flax Beige',
        colorHex: '#DFD8C4',
        pattern: 'Striped',
        occasions: ['Casual', 'Travel', 'Date'],
        formalLevel: 'Smart-Casual',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=300'
      }
    },
    {
      store: 'Ajio Signature',
      orderId: '#AJIO-830219-F',
      item: {
        name: 'Suede Monk Strap Shoes',
        category: 'Footwear',
        colorName: 'Camel Sand',
        colorHex: '#C6A482',
        pattern: 'Solid',
        occasions: ['Date', 'Work', 'Formal'],
        formalLevel: 'Smart-Casual',
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=300'
      }
    }
  ];

  // Simulating receipt scanning & adding item
  const handleReceiptImport = (receipt) => {
    setIsImporting(true);
    setImportLogs(['Connecting to API gateway...', 'Downloading order details...']);
    setImportedItemName(null);

    setTimeout(() => {
      setImportLogs(prev => [...prev, `Parsing invoice metadata from ${receipt.store}...`]);
    }, 600);

    setTimeout(() => {
      setImportLogs(prev => [...prev, 'Mapping product image to catalog categories...']);
    }, 1200);

    setTimeout(() => {
      setIsImporting(false);
      setImportedItemName(receipt.item.name);
      addWardrobeItem(receipt.item);
    }, 2000);
  };

  // Screenshot Upload handler
  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshotSrc(event.target.result);
        setShowScreenshotTryOn(false);
        setScreenshotItem(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate Crop and Map to Try-On Layer
  const handleScreenshotCrop = () => {
    // Generate a mock clothing item representing the cropped screenshot segment
    const croppedItem = {
      name: 'Cropped Item from Screenshot',
      category: 'Tops',
      colorName: 'Gold Honey',
      colorHex: '#D4AF37',
      pattern: 'Patterned',
      image: screenshotSrc // Use the uploaded photo directly as the overlay texture
    };
    setScreenshotItem(croppedItem);
    setShowScreenshotTryOn(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '20px' }}>
      
      {/* Editorial Sub Tabs Header */}
      <div 
        style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-color)', 
          paddingBottom: '10px', 
          marginBottom: '20px', 
          gap: '16px' 
        }}
      >
        <button
          onClick={() => setActiveSubTab('catalog')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: activeSubTab === 'catalog' ? 600 : 400,
            color: activeSubTab === 'catalog' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            paddingBottom: '4px',
            borderBottom: activeSubTab === 'catalog' ? '2px solid var(--accent-gold)' : 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          My Wardrobe
        </button>

        <button
          onClick={() => setActiveSubTab('receipt')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: activeSubTab === 'receipt' ? 600 : 400,
            color: activeSubTab === 'receipt' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            paddingBottom: '4px',
            borderBottom: activeSubTab === 'receipt' ? '2px solid var(--accent-gold)' : 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          Store Import
        </button>

        <button
          onClick={() => setActiveSubTab('screenshot')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: activeSubTab === 'screenshot' ? 600 : 400,
            color: activeSubTab === 'screenshot' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            paddingBottom: '4px',
            borderBottom: activeSubTab === 'screenshot' ? '2px solid var(--accent-gold)' : 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          Screenshot Fit
        </button>
      </div>

      {/* Main Tab Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* SUB TAB 1: Wardrobe Grid Catalog */}
        {activeSubTab === 'catalog' && (
          <WardrobeGrid onOpenScan={() => setShowScanModal(true)} />
        )}

        {/* SUB TAB 2: Receipt Ingestion */}
        {activeSubTab === 'receipt' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="vogue-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <FileText size={18} color="var(--accent-gold)" />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 500, margin: 0 }}>Connect Purchase Invoices</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '20px' }}>
                Build your wardrobe catalog automatically by uploading receipts or copy-pasting order details from Amazon, Myntra or Ajio invoices.
              </p>

              {/* Paste box / file input mock */}
              <div 
                style={{ 
                  border: '1px dashed var(--border-color)', 
                  padding: '24px 16px', 
                  borderRadius: 'var(--radius-sm)', 
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-primary)',
                  marginBottom: '20px'
                }}
              >
                <FileText size={28} color="var(--text-tertiary)" style={{ marginBottom: '8px', margin: '0 auto 8px auto' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', color: 'var(--text-primary)' }}>
                  Drag & Drop PDF Invoice
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                  Supports email attachments and receipt scans
                </span>
              </div>

              {/* Simulated Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Select a store order to simulate import:
                </span>
                
                {demoReceipts.map((receipt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleReceiptImport(receipt)}
                    disabled={isImporting}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface)',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                        {receipt.store}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                        Order ID: {receipt.orderId} • {receipt.item.name}
                      </span>
                    </div>
                    <ArrowRight size={14} color="var(--accent-gold)" />
                  </button>
                ))}
              </div>
            </div>

            {/* Ingestion logs console overlay */}
            {isImporting && (
              <div className="vogue-card" style={{ margin: 0, padding: '16px', backgroundColor: '#1C1C1A', border: '1px solid var(--accent-gold)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Loader2 size={12} color="var(--accent-gold)" style={{ animation: 'spin 1.5s linear infinite' }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 600, fontFamily: 'monospace' }}>
                    AI Parser Console
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'monospace', fontSize: '0.65rem', color: '#B5F28D' }}>
                  {importLogs.map((log, idx) => (
                    <div key={idx}>&gt; {log}</div>
                  ))}
                </div>
              </div>
            )}

            {importedItemName && (
              <div style={{ backgroundColor: 'var(--success-sage-bg)', border: '1px solid var(--success-sage)', padding: '12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={16} color="var(--success-sage)" />
                <span style={{ fontSize: '0.75rem', color: 'var(--success-sage)', fontWeight: 600 }}>
                  Successfully cataloged: "{importedItemName}" to your wardrobe!
                </span>
              </div>
            )}
          </div>
        )}

        {/* SUB TAB 3: Screenshot Try On */}
        {activeSubTab === 'screenshot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="vogue-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Crop size={18} color="var(--accent-gold)" />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 500, margin: 0 }}>Screenshot Try-On</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '20px' }}>
                Find an outfit you love on Pinterest or Instagram, screenshot it and upload it here to crop the item and overlay it on your body instantly.
              </p>

              {!screenshotSrc ? (
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px dashed var(--border-color)',
                    padding: '40px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(179,146,102,0.02)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <Crop size={28} color="var(--accent-gold)" style={{ marginBottom: '10px' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Upload Outfit Screenshot</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Select JPEG/PNG from camera roll
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Crop view container with custom crop bounding box overlay */}
                  <div style={{ position: 'relative', width: '100%', maxHeight: '300px', backgroundColor: '#EAE7E1', overflow: 'hidden', display: 'flex', justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}>
                    <img src={screenshotSrc} alt="Screenshot Source" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                    
                    {/* Bounding box crop simulation frame */}
                    <div
                      style={{
                        position: 'absolute',
                        top: `${cropBox.top}%`,
                        left: `${cropBox.left}%`,
                        width: `${cropBox.width}%`,
                        height: `${cropBox.height}%`,
                        border: '2px solid var(--accent-gold)',
                        boxShadow: '0 0 0 4000px rgba(0,0,0,0.4)',
                        cursor: 'move',
                        pointerEvents: 'none'
                      }}
                    >
                      <div style={{ position: 'absolute', top: -4, left: -4, width: 8, height: 8, backgroundColor: 'var(--accent-gold)' }} />
                      <div style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, backgroundColor: 'var(--accent-gold)' }} />
                      <div style={{ position: 'absolute', bottom: -4, left: -4, width: 8, height: 8, backgroundColor: 'var(--accent-gold)' }} />
                      <div style={{ position: 'absolute', bottom: -4, right: -4, width: 8, height: 8, backgroundColor: 'var(--accent-gold)' }} />
                    </div>
                  </div>

                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center', display: 'block' }}>
                    AI isolated bounding box targeting the core top garment.
                  </span>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleScreenshotCrop}
                      className="btn-gold"
                      style={{ flex: 1, gap: '6px' }}
                    >
                      Crop & Try On <Sparkles size={14} />
                    </button>
                    <button
                      onClick={() => setScreenshotSrc(null)}
                      className="btn-secondary"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Screenshot Try-on Overlay view */}
            {showScreenshotTryOn && screenshotItem && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'var(--transition-normal) fadeIn' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 500, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  Screenshot Try-On Canvas
                </h4>

                <InteractiveCanvas
                  referencePhoto={userProfile.referencePhoto}
                  topItem={screenshotItem}
                  bottomItem={null}
                />
              </div>
            )}

          </div>
        )}

      </div>

      {/* Manual Scanner Modal overlay */}
      {showScanModal && (
        <AddItemModal onClose={() => setShowScanModal(false)} />
      )}

    </div>
  );
};

export default WardrobeView;
