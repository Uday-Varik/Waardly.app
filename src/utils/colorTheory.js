// Color Theory Utility for Skin Tone Analysis

// Helper to convert Hex string (#RRGGBB) to RGB object
export function hexToRgb(hex) {
  let cleanHex = hex.replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  const bigint = parseInt(cleanHex, 16);
  if (isNaN(bigint)) {
    return { r: 0, g: 0, b: 0 };
  }
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

// Helper to convert RGB to HSL
// R, G, B in [0, 255]. Returns H in [0, 360], S in [0, 100], L in [0, 100]
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Analyze a skin tone color hex and map it to a seasonal color theory profile
export function analyzeSkinTone(hexColor) {
  const { r, g, b } = hexToRgb(hexColor);
  const { h, s, l } = rgbToHsl(r, g, b);

  let undertone = 'Neutral';
  let season = 'Winter';
  let justification = '';
  let palette = [];

  // Determine undertone
  // Warm: golden/yellow hues (H between 18 and 42)
  // Cool: pink/cool-red hues (H < 18 or H > 42)
  // Neutral: close boundary or low saturation
  if (s < 18) {
    undertone = 'Neutral';
  } else if (h >= 18 && h <= 45) {
    undertone = 'Warm';
  } else {
    undertone = 'Cool';
  }

  // Determine season based on undertone and lightness (L)
  if (undertone === 'Warm') {
    if (l > 48) {
      season = 'Spring';
      justification = 'Your skin tone has warm, golden undertones with a bright lightness level. Clear, warm colors with high saturation complement you best, adding radiance to your features.';
      palette = [
        { name: 'Peach Coral', hex: '#FF8B76', description: 'Brings out the warm glow in your skin.' },
        { name: 'Warm Honey', hex: '#DDB65B', description: 'Complements the golden pigment.' },
        { name: 'Sage Green', hex: '#608066', description: 'Creates a soft, natural balance.' },
        { name: 'Ivory White', hex: '#FFFFF0', description: 'Softer than pure white, matches warm undertones.' },
        { name: 'Terracotta', hex: '#D27D2D', description: 'A rich warm highlight for layering.' }
      ];
    } else {
      season = 'Autumn';
      justification = 'Your skin tone features rich, golden-bronze undertones. Muted, earthy tones and deep shades create a beautiful harmony with your deep warm complexion, mirroring natural autumnal shades.';
      palette = [
        { name: 'Forest Green', hex: '#2D4A3E', description: 'Deep contrast highlighting your undertone.' },
        { name: 'Burnt Ochre', hex: '#BD7A22', description: 'Channels your golden skin pigments.' },
        { name: 'Terracotta Clay', hex: '#C05C3E', description: 'A gorgeous, warm monochromatic match.' },
        { name: 'Warm Olive', hex: '#606E4A', description: 'Sophisticated neutral alternative.' },
        { name: 'Espresso Brown', hex: '#4A3B32', description: 'Rich baseline luxury color.' }
      ];
    }
  } else if (undertone === 'Cool') {
    if (l > 48) {
      season = 'Summer';
      justification = 'Your skin tone has cool, pinkish undertones with soft lightness. Soft pastel colors and muted cool shades reflect your cool undertone beautifully without overpowering your natural coloring.';
      palette = [
        { name: 'Powder Blue', hex: '#B0C4DE', description: 'Reflects your cool undertone elegantly.' },
        { name: 'Lavender Blush', hex: '#D6CADD', description: 'A soft, romantic contrast.' },
        { name: 'Slate Gray', hex: '#708090', description: 'A clean, tailored neutral base.' },
        { name: 'Rose Quartz', hex: '#F7CAC9', description: 'Flatters the rosy hues in your skin.' },
        { name: 'Mint Green', hex: '#98FF98', description: 'Refreshing, cool pop of color.' }
      ];
    } else {
      season = 'Winter';
      justification = 'Your skin tone has crisp, cool undertones with high contrast. High-contrast, bold and icy cool colors make your skin pop, framing your facial structure with crisp clarity.';
      palette = [
        { name: 'Royal Blue', hex: '#002366', description: 'High contrast makes your cool tone pop.' },
        { name: 'Emerald Green', hex: '#004B49', description: 'Vibrant, rich and highly flattering.' },
        { name: 'Crimson Wine', hex: '#722F37', description: 'Deep, dramatic lip/fabric matching.' },
        { name: 'Stark White', hex: '#FFFFFF', description: 'Provides a crisp, striking framework.' },
        { name: 'Charcoal Black', hex: '#1C1C1C', description: 'Deep obsidian framing color.' }
      ];
    }
  } else {
    // Neutral
    justification = 'Your skin tone sits perfectly between warm and cool, giving you high versatility. You can wear colors from both spectrums, but soft, medium-saturated tones look exceptionally elegant on you.';
    palette = [
      { name: 'Classic Navy', hex: '#002F6C', description: 'A universal, flattering classic.' },
      { name: 'Warm Taupe', hex: '#B38B6D', description: 'Elegant neutral that matches anything.' },
      { name: 'Sage', hex: '#87A987', description: 'Soft organic green.' },
      { name: 'Dusty Rose', hex: '#C08A8A', description: 'Provides a soft, delicate flush.' },
      { name: 'Cream Ivory', hex: '#FDFBF7', description: 'Soft framing background color.' }
    ];
  }

  return {
    undertone,
    season,
    justification,
    palette,
    hexColor: hexColor.toUpperCase()
  };
}
