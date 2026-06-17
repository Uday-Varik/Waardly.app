import React, { useState, useEffect, useRef } from 'react';
import { Layers, Move, RefreshCw, ZoomIn, RotateCw, Eye } from 'lucide-react';

// Helper to remove solid white background on the fly using a border-aware flood-fill algorithm
const processGarmentImage = (url) => {
  if (!url) return Promise.resolve(null);
  
  return new Promise((resolve) => {
    if (url.startsWith('data:')) {
      resolve(url);
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        const visited = new Uint8Array(width * height);
        const queue = [];
        
        const pushPixel = (x, y) => {
          const idx = y * width + x;
          if (!visited[idx]) {
            visited[idx] = 1;
            queue.push({ x, y });
          }
        };
        
        // Push all border pixels to queue as the seed for flood fill
        for (let x = 0; x < width; x++) {
          pushPixel(x, 0);
          pushPixel(x, height - 1);
        }
        for (let y = 0; y < height; y++) {
          pushPixel(0, y);
          pushPixel(width - 1, y);
        }
        
        while (queue.length > 0) {
          const { x, y } = queue.shift();
          const offset = (y * width + x) * 4;
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const a = data[offset + 3];
          
          if (a === 0) continue;
          
          // Identify white/light background pixels (threshold 230 out of 255)
          const isWhite = r > 230 && g > 230 && b > 230;
          
          if (isWhite) {
            data[offset + 3] = 0; // Clear alpha (transparent)
            
            const neighbors = [
              { x: x + 1, y },
              { x: x - 1, y },
              { x: x, y: y + 1 },
              { x: x, y: y - 1 }
            ];
            
            for (const n of neighbors) {
              if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
                const nIdx = n.y * width + n.x;
                if (!visited[nIdx]) {
                  visited[nIdx] = 1;
                  queue.push(n);
                }
              }
            }
          }
        }
        
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL());
      } catch (err) {
        console.error("Canvas flood-fill background removal error: ", err);
        resolve(url); // Fallback to original image URL
      }
    };
    img.onerror = () => {
      resolve(url);
    };
  });
};

const InteractiveCanvas = ({ referencePhoto, topItem, bottomItem, outerwearItem, footwearItem }) => {
  const containerRef = useRef(null);
  const [layers, setLayers] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [containerWidth, setContainerWidth] = useState(360);
  const [isProcessing, setIsProcessing] = useState(false);

  // Measure container width on mount
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth || 360);
    }
  }, []);

  // Initialize overlay layers and process images to remove backgrounds on the fly
  useEffect(() => {
    let active = true;

    const loadLayers = async () => {
      setIsProcessing(true);
      const newLayers = [];
      const centerX = containerWidth / 2;

      // Order: Bottoms -> Tops -> Outerwear -> Footwear (back to front by default)
      if (bottomItem) {
        const processed = await processGarmentImage(bottomItem.image);
        if (!active) return;
        newLayers.push({
          id: 'bottom',
          name: bottomItem.name,
          image: processed || bottomItem.image,
          x: centerX,
          y: 220,
          scale: 0.55,
          rotation: 0,
          opacity: 0.95,
          blendMode: 'normal',
          zIndex: 1
        });
      }

      if (topItem) {
        const processed = await processGarmentImage(topItem.image);
        if (!active) return;
        newLayers.push({
          id: 'top',
          name: topItem.name,
          image: processed || topItem.image,
          x: centerX,
          y: 130,
          scale: 0.5,
          rotation: 0,
          opacity: 0.95,
          blendMode: 'normal',
          zIndex: 2
        });
      }

      if (outerwearItem) {
        const processed = await processGarmentImage(outerwearItem.image);
        if (!active) return;
        newLayers.push({
          id: 'outerwear',
          name: outerwearItem.name,
          image: processed || outerwearItem.image,
          x: centerX,
          y: 125,
          scale: 0.55,
          rotation: 0,
          opacity: 0.95,
          blendMode: 'normal',
          zIndex: 3
        });
      }

      if (footwearItem) {
        const processed = await processGarmentImage(footwearItem.image);
        if (!active) return;
        newLayers.push({
          id: 'footwear',
          name: footwearItem.name,
          image: processed || footwearItem.image,
          x: centerX,
          y: 320,
          scale: 0.4,
          rotation: 0,
          opacity: 0.95,
          blendMode: 'normal',
          zIndex: 4
        });
      }

      if (active) {
        setLayers(newLayers);
        setIsProcessing(false);
        if (newLayers.length > 0) {
          setSelectedLayerId(newLayers[newLayers.length - 1].id);
        } else {
          setSelectedLayerId(null);
        }
      }
    };

    loadLayers();

    return () => {
      active = false;
    };
  }, [topItem, bottomItem, outerwearItem, footwearItem, containerWidth]);

  // Handle Drag State
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeDragId, setActiveDragId] = useState(null);

  const startDrag = (id, clientX, clientY) => {
    setSelectedLayerId(id);
    setActiveDragId(id);
    const targetLayer = layers.find(l => l.id === id);
    if (targetLayer) {
      setDragStart({ x: clientX - targetLayer.x, y: clientY - targetLayer.y });
    }
  };

  const handleDrag = (clientX, clientY) => {
    if (!activeDragId) return;

    setLayers(prev => prev.map(layer => {
      if (layer.id === activeDragId) {
        return {
          ...layer,
          x: clientX - dragStart.x,
          y: clientY - dragStart.y
        };
      }
      return layer;
    }));
  };

  const endDrag = () => {
    setActiveDragId(null);
  };

  // Touch and Mouse handlers
  const handleTouchStart = (id, e) => {
    if (e.touches.length === 0) return;
    startDrag(id, e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 0) return;
    handleDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleMouseDown = (id, e) => {
    e.preventDefault();
    startDrag(id, e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    handleDrag(e.clientX, e.clientY);
  };

  // Modify currently selected layer
  const updateSelectedLayer = (field, value) => {
    setLayers(prev => prev.map(l => {
      if (l.id === selectedLayerId) {
        return { ...l, [field]: value };
      }
      return l;
    }));
  };

  const resetLayers = () => {
    const centerX = containerWidth / 2;
    setLayers(prev => prev.map(l => {
      let defaultScale = 0.5;
      let defaultY = 130;
      
      if (l.id === 'bottom') { defaultScale = 0.55; defaultY = 220; }
      else if (l.id === 'outerwear') { defaultScale = 0.55; defaultY = 125; }
      else if (l.id === 'footwear') { defaultScale = 0.4; defaultY = 320; }

      return {
        ...l,
        x: centerX,
        y: defaultY,
        scale: defaultScale,
        rotation: 0,
        opacity: 0.95,
        blendMode: 'normal'
      };
    }));
  };

  const activeLayer = layers.find(l => l.id === selectedLayerId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      
      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchMove={handleTouchMove}
        onTouchEnd={endDrag}
        style={{
          position: 'relative',
          width: '100%',
          height: '380px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          userSelect: 'none',
          touchAction: 'none'
        }}
      >
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

        {/* User reference photo */}
        <img
          src={referencePhoto}
          alt="Base Silhouette"
          draggable="false"
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            opacity: showOriginal ? 1 : 0.85,
            transition: 'opacity 0.2s ease'
          }}
        />

        {/* Processing Shimmer Loader */}
        {isProcessing && (
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(250, 249, 246, 0.75)', 
              backdropFilter: 'blur(6px)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px',
              zIndex: 100 
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2.5px solid var(--border-color)', borderTopColor: 'var(--accent-gold)', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Fitting garment...
            </span>
          </div>
        )}

        {/* Technical crosshair overlay for fit HUD feel */}
        <div style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--accent-gold)', fontSize: '0.65rem', fontFamily: 'monospace', opacity: 0.6 }}>
          FIT VIEWPORT 2.3 // ACTIVE
        </div>

        {/* Toggle suggestion items on top */}
        {!showOriginal && layers.map((layer) => (
          <div
            key={layer.id}
            onMouseDown={(e) => handleMouseDown(layer.id, e)}
            onTouchStart={(e) => handleTouchStart(layer.id, e)}
            style={{
              position: 'absolute',
              left: `${layer.x}px`,
              top: `${layer.y}px`,
              transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale})`,
              cursor: activeDragId === layer.id ? 'grabbing' : 'grab',
              zIndex: layer.zIndex,
              mixBlendMode: layer.blendMode,
              opacity: layer.opacity,
              transition: activeDragId === layer.id ? 'none' : 'transform 0.15s ease',
              border: selectedLayerId === layer.id ? '1px dashed var(--accent-gold)' : 'none',
              padding: selectedLayerId === layer.id ? '4px' : 0
            }}
          >
            <img
              src={layer.image}
              alt={layer.name}
              draggable="false"
              style={{
                height: '160px',
                objectFit: 'contain',
                pointerEvents: 'none'
              }}
            />
          </div>
        ))}

        {/* View mode actions */}
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '8px', zIndex: 50 }}>
          <button
            onClick={() => setShowOriginal(prev => !prev)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: showOriginal ? 'var(--accent-gold)' : 'var(--text-primary)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <Eye size={12} /> {showOriginal ? 'Show Try-On' : 'Show Original'}
          </button>
          <button
            onClick={resetLayers}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--text-primary)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <RefreshCw size={10} /> Reset
          </button>
        </div>
      </div>

      {/* Control HUD Menu */}
      {!showOriginal && activeLayer && (
        <div 
          className="vogue-card" 
          style={{ 
            padding: '16px', 
            margin: 0,
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            border: '1px solid var(--accent-gold)',
            backgroundColor: 'rgba(179, 146, 102, 0.02)'
          }}
        >
          {/* Layer Selector Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }} className="no-scrollbar">
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', alignSelf: 'center', marginRight: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Adjust layer:
            </span>
            {layers.map(l => (
              <button
                key={l.id}
                onClick={() => setSelectedLayerId(l.id)}
                style={{
                  padding: '4px 10px',
                  backgroundColor: selectedLayerId === l.id ? 'var(--text-primary)' : 'var(--bg-surface)',
                  color: selectedLayerId === l.id ? 'var(--bg-surface)' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.7rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  fontWeight: selectedLayerId === l.id ? 600 : 400
                }}
              >
                {l.id}
              </button>
            ))}
          </div>

          {/* Sliders Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Scale */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ZoomIn size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.7rem', width: '45px', color: 'var(--text-secondary)' }}>Size</span>
              <input
                type="range"
                min="0.25"
                max="1.2"
                step="0.01"
                value={activeLayer.scale}
                onChange={(e) => updateSelectedLayer('scale', parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent-gold)' }}
              />
              <span style={{ fontSize: '0.7rem', width: '30px', textAlign: 'right', fontFamily: 'monospace' }}>
                {Math.round(activeLayer.scale * 100)}%
              </span>
            </div>

            {/* Rotation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <RotateCw size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.7rem', width: '45px', color: 'var(--text-secondary)' }}>Tilt</span>
              <input
                type="range"
                min="-60"
                max="60"
                step="1"
                value={activeLayer.rotation}
                onChange={(e) => updateSelectedLayer('rotation', parseInt(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent-gold)' }}
              />
              <span style={{ fontSize: '0.7rem', width: '30px', textAlign: 'right', fontFamily: 'monospace' }}>
                {activeLayer.rotation}°
              </span>
            </div>

            {/* Opacity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Layers size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.7rem', width: '45px', color: 'var(--text-secondary)' }}>Blend</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={activeLayer.opacity}
                onChange={(e) => updateSelectedLayer('opacity', parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent-gold)' }}
              />
              <span style={{ fontSize: '0.7rem', width: '30px', textAlign: 'right', fontFamily: 'monospace' }}>
                {Math.round(activeLayer.opacity * 100)}%
              </span>
            </div>

            {/* Advanced Blend Modes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
              <Move size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Render Mode:</span>
              <div style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'flex-end' }}>
                {['normal', 'multiply', 'soft-light'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => updateSelectedLayer('blendMode', mode)}
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.65rem',
                      border: '1px solid',
                      borderColor: activeLayer.blendMode === mode ? 'var(--accent-gold)' : 'var(--border-color)',
                      backgroundColor: activeLayer.blendMode === mode ? 'rgba(179, 146, 102, 0.05)' : 'transparent',
                      color: activeLayer.blendMode === mode ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      fontWeight: activeLayer.blendMode === mode ? 600 : 400
                    }}
                  >
                    {mode === 'normal' ? 'Solid' : mode === 'multiply' ? 'Texture' : 'Glow'}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCanvas;
