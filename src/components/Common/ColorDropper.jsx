import React, { useRef, useState, useEffect } from 'react';
import { Pipette } from 'lucide-react';

const ColorDropper = ({ imageSrc, onColorSelected, initialColor = '#EAD4C3' }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const [skinCoordPercent, setSkinCoordPercent] = useState({ x: 0.5, y: 0.35 });
  const [currentHex, setCurrentHex] = useState(initialColor);
  const [loupeImage, setLoupeImage] = useState(null);

  // Helper to convert RGB to HSV
  const rgbToHsv = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s, v };
  };

  // Internal System: Automatically identify skin tone color from image
  const autoDetectSkinTone = (img, ctx) => {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    
    // Grid sampling
    const sampleStepX = Math.max(1, Math.floor(width / 60));
    const sampleStepY = Math.max(1, Math.floor(height / 60));
    
    let totalR = 0, totalG = 0, totalB = 0;
    let sumX = 0, sumY = 0;
    let totalWeight = 0;
    
    // Gaussian prior centered around the middle horizontally and upper-middle vertically (where face/neck usually is)
    const centerX = width / 2;
    const centerY = height * 0.45;
    const sigmaX = width * 0.3;
    const sigmaY = height * 0.35;
    
    for (let y = 0; y < height; y += sampleStepY) {
      for (let x = 0; x < width; x += sampleStepX) {
        try {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          const r = pixel[0];
          const g = pixel[1];
          const b = pixel[2];
          const a = pixel[3];
          
          if (a < 150) continue; // Skip alpha transparent pixels
          
          const { h, s, v } = rgbToHsv(r, g, b);
          
          // Skin tone hue range is typically orange-ish (0 to 50 degrees in HSV, or 335 to 360 degrees)
          const isSkinHue = (h >= 0 && h <= 50) || (h >= 335 && h <= 360);
          
          // Skin tone saturation is usually medium-low (10% to 70%)
          const isSkinSat = (s >= 0.10 && s <= 0.70);
          
          // Skin tone value/brightness (15% to 95%)
          const isSkinVal = (v >= 0.15 && v <= 0.95);
          
          // Standard RGB rule (Red channel must be larger than Green, which must be larger than Blue)
          const isSkinRGB = r > 50 && g > 35 && b > 20 && r > g && g >= b - 10 && (r - g > 10) && (Math.max(r,g,b) - Math.min(r,g,b) > 12);
          
          if ((isSkinHue && isSkinSat && isSkinVal) || isSkinRGB) {
            // Apply Gaussian spatial prior weight
            const dx = x - centerX;
            const dy = y - centerY;
            const weight = Math.exp(-((dx * dx) / (2 * sigmaX * sigmaX) + (dy * dy) / (2 * sigmaY * sigmaY)));
            
            totalR += r * weight;
            totalG += g * weight;
            totalB += b * weight;
            sumX += x * weight;
            sumY += y * weight;
            totalWeight += weight;
          }
        } catch (e) {
          // Ignore canvas read errors
        }
      }
    }
    
    if (totalWeight > 0.01) {
      const avgR = Math.min(255, Math.floor(totalR / totalWeight));
      const avgG = Math.min(255, Math.floor(totalG / totalWeight));
      const avgB = Math.min(255, Math.floor(totalB / totalWeight));
      const avgX = sumX / totalWeight;
      const avgY = sumY / totalWeight;
      
      const hex = '#' + [avgR, avgG, avgB].map(v => {
        const hexStr = v.toString(16);
        return hexStr.length === 1 ? '0' + hexStr : hexStr;
      }).join('');
      
      return { hex, x: avgX, y: avgY };
    }
    
    return null;
  };

  // Initialize offscreen canvas and run skin tone identifier when image loads
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous'; // Avoid CORS issues for canvas sampling
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      setLoupeImage(img);

      // Perform automatic skin tone detection using our internal system
      const result = autoDetectSkinTone(img, ctx);
      
      if (result) {
        setCurrentHex(result.hex);
        onColorSelected(result.hex);
        setSkinCoordPercent({ x: result.x / img.naturalWidth, y: result.y / img.naturalHeight });
      } else {
        // Fallback: Perform initial color sample in the middle of the image
        const midX = Math.floor(img.naturalWidth / 2);
        const midY = Math.floor(img.naturalHeight / 3); // Approx face/neck area
        samplePixelColor(midX, midY);
        setSkinCoordPercent({ x: 0.5, y: 0.33 });
      }
    };
  }, [imageSrc]);

  // Update pointer position whenever image size or skin coordinates percentage changes
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const updatePosition = () => {
      const rect = img.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setPointerPos({
          x: Math.floor(skinCoordPercent.x * rect.width),
          y: Math.floor(skinCoordPercent.y * rect.height)
        });
      }
    };

    updatePosition();
    const timer = setTimeout(updatePosition, 100);

    window.addEventListener('resize', updatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
    };
  }, [skinCoordPercent, imageSrc]);

  // Sample pixel color from offscreen canvas
  const samplePixelColor = (canvasX, canvasY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Boundary check
    if (canvasX < 0 || canvasX >= canvas.width || canvasY < 0 || canvasY >= canvas.height) return;

    try {
      const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      
      // Convert RGB to HEX
      const hex = '#' + [r, g, b].map(x => {
        const hexStr = x.toString(16);
        return hexStr.length === 1 ? '0' + hexStr : hexStr;
      }).join('');

      setCurrentHex(hex);
      onColorSelected(hex);
    } catch (e) {
      console.error('Failed to extract color pixel: ', e);
    }
  };

  // Convert client cursor coords to image/canvas relative coords
  const handlePointerAction = (clientX, clientY) => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const rect = img.getBoundingClientRect();
    
    // Relative position in pixels on current displayed image
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Constrain inside bounds
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    setPointerPos({ x, y });

    // Scale coordinates to natural image dimensions for canvas extraction
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const canvasX = Math.max(0, Math.min(Math.floor(x * scaleX), img.naturalWidth - 1));
    const canvasY = Math.max(0, Math.min(Math.floor(y * scaleY), img.naturalHeight - 1));

    // Also update skinCoordPercent so that resize works with manual selections!
    setSkinCoordPercent({ x: canvasX / img.naturalWidth, y: canvasY / img.naturalHeight });

    samplePixelColor(canvasX, canvasY);
  };

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    handlePointerAction(clientX, clientY);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    handlePointerAction(clientX, clientY);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Event handlers for Mouse
  const onMouseDown = (e) => {
    handleStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  // Event handlers for Touch (iOS & Android)
  const onTouchStart = (e) => {
    if (e.touches.length === 0) return;
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Offscreen canvas used purely for pixel color extraction */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Pipette size={14} className="text-gold" />
        Drag the eyedropper over your skin to analyze undertones
      </p>

      {/* Interactive image viewport container */}
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchMove={onTouchMove}
        onTouchEnd={handleEnd}
        style={{
          position: 'relative',
          width: '100%',
          maxHeight: '340px',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          backgroundColor: '#EAE7E1',
          cursor: isDragging ? 'none' : 'crosshair',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          userSelect: 'none',
          touchAction: 'none'
        }}
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Skin Tone Target"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          draggable="false"
          style={{
            maxWidth: '100%',
            maxHeight: '340px',
            objectFit: 'contain',
            userSelect: 'none',
            display: 'block'
          }}
        />

        {/* Dynamic Magnifying Loupe */}
        {isDragging && loupeImage && (
          <div
            style={{
              position: 'absolute',
              // Loupe position is offset upwards by 60px so finger/cursor doesn't cover it
              left: `${pointerPos.x - 45}px`,
              top: `${pointerPos.y - 110}px`,
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '3px solid var(--text-primary)',
              boxShadow: 'var(--shadow-premium), 0 0 0 100px rgba(0, 0, 0, 0.2) inset',
              pointerEvents: 'none',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: currentHex,
              zIndex: 100
            }}
          >
            {/* Zoomed background effect using CSS backgroundPosition mapping */}
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${imageSrc})`,
                backgroundRepeat: 'no-repeat',
                // Zoom scale is 2.5x
                backgroundSize: imgRef.current ? `${imgRef.current.width * 2.2}px ${imgRef.current.height * 2.2}px` : 'auto',
                backgroundPosition: imgRef.current 
                  ? `-${pointerPos.x * 2.2 - 45}px -${pointerPos.y * 2.2 - 45}px`
                  : 'center'
              }}
            />
            {/* Crosshairs */}
            <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.5)' }} />
            <div style={{ position: 'absolute', height: '100%', width: '1px', backgroundColor: 'rgba(255,255,255,0.5)' }} />
            <div 
              style={{ 
                position: 'absolute', 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                border: '1.5px solid #FFFFFF', 
                backgroundColor: currentHex 
              }} 
            />
          </div>
        )}

        {/* Small floating eyedropper pointer target when not dragging */}
        {!isDragging && pointerPos.x > 0 && (
          <div
            style={{
              position: 'absolute',
              left: `${pointerPos.x}px`,
              top: `${pointerPos.y}px`,
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: '2px solid #FFFFFF',
              backgroundColor: currentHex,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#000000' }} />
          </div>
        )}
      </div>

      {/* Selected Color Visual Feedback */}
      <div 
        style={{ 
          marginTop: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          backgroundColor: 'var(--bg-surface)', 
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          width: '100%'
        }}
      >
        <div 
          style={{ 
            width: '28px', 
            height: '28px', 
            borderRadius: '50%', 
            backgroundColor: currentHex, 
            border: '1px solid var(--border-color)' 
          }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            Selected Skin Color
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
            {currentHex.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ColorDropper;
