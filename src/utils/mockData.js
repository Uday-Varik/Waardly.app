// Mock Data and Style Engine Rules for Waardly

export const STYLE_ICONS = [
  {
    id: 'zendaya',
    name: 'Zendaya',
    gender: 'Female',
    aesthetic: 'Chic, Glamour, Tailored & Bold',
    quote: '"Fashion is a tool of self-expression. Wear what makes you feel powerful."',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' // Silhouette representation
  },
  {
    id: 'deepika',
    name: 'Deepika Padukone',
    gender: 'Female',
    aesthetic: 'Regal, Modern Fusion, Elegant & Drapey',
    quote: '"Comfort is key. If you feel comfortable in what you wear, you will carry it off with confidence."',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'gigi',
    name: 'Gigi Hadid',
    gender: 'Female',
    aesthetic: 'Streetwear, Casual Luxury & Athleisure Chic',
    quote: '"I like mixing sportswear with high-fashion tailoring. It keeps fashion fun and wearable."',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'rihanna',
    name: 'Rihanna',
    gender: 'Female',
    aesthetic: 'Avant-Garde, Over-sized, Rule-breaking & Edgy',
    quote: '"I don\'t dress for anyone else. I dress for myself and like to push boundaries."',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'ryan',
    name: 'Ryan Reynolds',
    gender: 'Male',
    aesthetic: 'Classic Smart-Casual, Preppy, Textured Jackets',
    quote: '"Keep it simple, keep it fitted. A good suede jacket or textured blazer does 90% of the work."',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'timothee',
    name: 'Timothée Chalamet',
    gender: 'Male',
    aesthetic: 'Modern Romantic, Soft Tailoring, Artistic Silhouette',
    quote: '"Fashion is an art form. I love clothes that have a fluid, slightly romantic and structured shape."',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'harry',
    name: 'Harry Styles',
    gender: 'Unisex',
    aesthetic: 'Retro Eclectic, Flamboyant, Wide-Leg & Fluid',
    quote: '"There\'s so much joy to be had in playing with clothes. Gender lines in fashion are dissolving."',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200'
  }
];

// Preloaded "Luxury Essentials" that can be imported to populate the wardrobe
export const LUXURY_ESSENTIALS = [
  // Tops
  {
    id: 'item_1',
    name: 'Oversized Silk Button-Down',
    category: 'Tops',
    colorName: 'Ivory White',
    colorHex: '#FFFFF0',
    pattern: 'Solid',
    occasions: ['Work', 'Date', 'Casual', 'Formal', 'Travel'],
    formalLevel: 'Smart-Casual',
    image: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'item_2',
    name: 'Fine-Knit Cashmere Turtleneck',
    category: 'Tops',
    colorName: 'Charcoal Black',
    colorHex: '#1C1C1C',
    pattern: 'Solid',
    occasions: ['Work', 'Date', 'Formal', 'Travel'],
    formalLevel: 'Smart-Casual',
    image: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'item_3',
    name: 'Relaxed Heavyweight Tee',
    category: 'Tops',
    colorName: 'Sage Green',
    colorHex: '#87A987',
    pattern: 'Solid',
    occasions: ['Casual', 'Travel', 'Gym'],
    formalLevel: 'Casual',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'item_4',
    name: 'French Linen Resort Shirt',
    category: 'Tops',
    colorName: 'Sandstone Beige',
    colorHex: '#E1D9C3',
    pattern: 'Solid',
    occasions: ['Casual', 'Travel', 'Date'],
    formalLevel: 'Casual',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=150'
  },

  // Bottoms
  {
    id: 'item_5',
    name: 'Silk Wide-Leg Trousers',
    category: 'Bottoms',
    colorName: 'Warm Taupe',
    colorHex: '#B38B6D',
    pattern: 'Solid',
    occasions: ['Work', 'Date', 'Formal'],
    formalLevel: 'Formal',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'item_6',
    name: 'Tailored Wool Slacks',
    category: 'Bottoms',
    colorName: 'Midnight Navy',
    colorHex: '#002F6C',
    pattern: 'Solid',
    occasions: ['Work', 'Formal', 'Date'],
    formalLevel: 'Formal',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'item_7',
    name: 'Minimalist Straight-Leg Denim',
    category: 'Bottoms',
    colorName: 'Vintage Blue',
    colorHex: '#7A91B8',
    pattern: 'Solid',
    occasions: ['Casual', 'Date', 'Travel'],
    formalLevel: 'Casual',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'item_8',
    name: 'Premium Drawstring Joggers',
    category: 'Bottoms',
    colorName: 'Heather Gray',
    colorHex: '#9E9E9E',
    pattern: 'Solid',
    occasions: ['Travel', 'Gym', 'Casual'],
    formalLevel: 'Casual',
    image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&q=80&w=150'
  },

  // Outerwear
  {
    id: 'item_9',
    name: 'Double-Breasted Cashmere Trench',
    category: 'Outerwear',
    colorName: 'Camel Gold',
    colorHex: '#C5A880',
    pattern: 'Solid',
    occasions: ['Work', 'Date', 'Formal', 'Travel'],
    formalLevel: 'Formal',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'item_10',
    name: 'Soft Suede Overshirt',
    category: 'Outerwear',
    colorName: 'Burnt Ochre',
    colorHex: '#BD7A22',
    pattern: 'Solid',
    occasions: ['Casual', 'Date', 'Travel'],
    formalLevel: 'Smart-Casual',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'item_11',
    name: 'Structured Crop Blazer',
    category: 'Outerwear',
    colorName: 'Ivory Cream',
    colorHex: '#F5F2EB',
    pattern: 'Solid',
    occasions: ['Work', 'Date', 'Formal'],
    formalLevel: 'Formal',
    image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&q=80&w=150'
  },

  // Footwear
  {
    id: 'item_12',
    name: 'Italian Leather Chelsea Boots',
    category: 'Footwear',
    colorName: 'Espresso Brown',
    colorHex: '#4A3B32',
    pattern: 'Solid',
    occasions: ['Work', 'Date', 'Formal', 'Casual'],
    formalLevel: 'Smart-Casual',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'item_13',
    name: 'Minimalist White Leather Sneaker',
    category: 'Footwear',
    colorName: 'Stark White',
    colorHex: '#FFFFFF',
    pattern: 'Solid',
    occasions: ['Casual', 'Travel', 'Date', 'Work'],
    formalLevel: 'Casual',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'item_14',
    name: 'Patent Leather Slingback Loafers',
    category: 'Footwear',
    colorName: 'Ebony Black',
    colorHex: '#0F0F0F',
    pattern: 'Solid',
    occasions: ['Work', 'Formal', 'Date'],
    formalLevel: 'Formal',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=300',
    iconOverlay: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=150'
  }
];

// Simulated "Online Search Engine" results for style icons that match specific aesthetics
export const MOCK_INTERNET_STYLE_ICONS = [
  {
    outfitType: 'Activewear Sporty',
    iconName: 'Bella Hadid',
    gender: 'Female',
    aesthetic: '90s Sporty Chic & Athleisure',
    quote: '"I love pairing cycling shorts and track jackets with designer sunglasses. Streetwear is high fashion."',
    source: 'Pinterest Style Board 2026'
  },
  {
    outfitType: 'Bohemian / Floral',
    iconName: 'Florence Welch',
    gender: 'Female',
    aesthetic: 'Ethereal Boho & Vintage Floral Romanticism',
    quote: '"Flowing silks and lace fabrics are timeless. They carry history and drama."',
    source: 'Vogue Runway archives'
  },
  {
    outfitType: 'Monochrome Streetwear',
    iconName: 'Hailey Bieber',
    gender: 'Female',
    aesthetic: 'Oversized Streetwear, Leather Coats & Clean Silhouettes',
    quote: '"My style is very tomboy-meets-chic. I love oversized leather jackets with slim trousers."',
    source: 'Instagram Style Feed'
  },
  {
    outfitType: 'Edgy Streetwear / Grunge',
    iconName: 'A$AP Rocky',
    gender: 'Male',
    aesthetic: 'High-Fashion Streetwear, Quilted Textures & Bold Prints',
    quote: '"Fashion is a playground. I like mixing floral patterns with rough utility wear."',
    source: 'GQ Style File 2026'
  },
  {
    outfitType: 'Classic Tailored / Formal',
    iconName: 'David Gandy',
    gender: 'Male',
    aesthetic: 'Savile Row Tailoring & Sharp British Sartorialism',
    quote: '"A well-tailored double-breasted suit is the peak of elegance. Fit is everything."',
    source: 'British GQ Archives'
  },
  {
    outfitType: 'Minimalist Relaxed',
    iconName: 'Mary-Kate & Ashley Olsen',
    gender: 'Female',
    aesthetic: 'Quiet Luxury, Oversized Knits & Flowing Draped Neutrals',
    quote: '"Luxury lies in the fabric, the cut and the sheer simplicity of the line."',
    source: 'Harper\'s Bazaar Style Guides'
  }
];
