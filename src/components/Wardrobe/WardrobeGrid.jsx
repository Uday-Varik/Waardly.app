import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, SlidersHorizontal, Trash2, Plus, ArrowDownToLine, Info } from 'lucide-react';

const WardrobeGrid = ({ onOpenScan }) => {
  const { wardrobe, removeWardrobeItem, importLuxuryEssentials, clearWardrobe } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterOccasion, setFilterOccasion] = useState('All');

  const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Footwear'];
  const occasions = ['All', 'Work', 'Date', 'Party', 'Casual', 'Formal', 'Travel', 'Gym'];

  // Filter logic
  const filteredItems = wardrobe.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.colorName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesOccasion = filterOccasion === 'All' || (item.occasions && item.occasions.includes(filterOccasion));
    
    return matchesSearch && matchesCategory && matchesOccasion;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      
      {/* Header Actions */}
      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, margin: 0 }}>My Catalog</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {wardrobe.length} item{wardrobe.length !== 1 ? 's' : ''} registered
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {wardrobe.length > 0 && (
            <button
              onClick={clearWardrobe}
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.75rem', color: 'var(--error-rose)', borderColor: 'var(--border-color)' }}
            >
              Clear All
            </button>
          )}
          <button
            onClick={onOpenScan}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.75rem', gap: '6px' }}
          >
            <Plus size={14} /> Scan Item
          </button>
        </div>
      </div>

      {/* Search and Filters Drawer Toggle */}
      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search clothes by name or color..."
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px', borderRadius: 'var(--radius-sm)' }}
          />
        </div>
      </div>

      {/* Category Pills Slider */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px',
              backgroundColor: activeCategory === cat ? 'var(--text-primary)' : 'var(--bg-surface)',
              color: activeCategory === cat ? 'var(--bg-surface)' : 'var(--text-secondary)',
              border: activeCategory === cat ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: activeCategory === cat ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Occasion Filter Pills */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', alignSelf: 'center', marginRight: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Occasion:
        </span>
        {occasions.map(occ => (
          <button
            key={occ}
            onClick={() => setFilterOccasion(occ)}
            style={{
              padding: '4px 10px',
              backgroundColor: filterOccasion === occ ? 'rgba(179,146,102,0.1)' : 'transparent',
              color: filterOccasion === occ ? 'var(--accent-gold)' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: filterOccasion === occ ? 'var(--accent-gold)' : 'transparent',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.7rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)'
            }}
          >
            {occ}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {wardrobe.length === 0 && (
        <div
          style={{
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            marginTop: '10px'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContext: 'center', justifyContent: 'center' }}>
            <SlidersHorizontal size={20} color="var(--accent-gold)" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 6px 0' }}>Your Closet is Empty</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto', lineHeight: 1.4 }}>
              Waardly is designed to suggest outfits from what you own. Start by scanning clothes or import our essentials bundle.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '260px', marginTop: '8px' }}>
            <button
              onClick={onOpenScan}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              <Plus size={14} style={{ marginRight: '6px' }} /> Scan My First Garment
            </button>
            
            <button
              onClick={importLuxuryEssentials}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.8rem', gap: '6px' }}
            >
              <ArrowDownToLine size={14} /> Import 15 Essentials
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-primary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', width: '100%', maxWidth: '300px', marginTop: '8px', textAlign: 'left' }}>
            <Info size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
              <strong>Tip:</strong> The Essentials pack imports high-res curated items so you can immediately see the Virtual Try-On overlays without taking photos.
            </p>
          </div>
        </div>
      )}

      {/* Grid List */}
      {wardrobe.length > 0 && filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '0.9rem' }}>No garments match the selected filters.</p>
          <button 
            onClick={() => { setSearch(''); setActiveCategory('All'); setFilterOccasion('All'); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '0.8rem', textDecoration: 'underline', marginTop: '8px', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {wardrobe.length > 0 && filteredItems.length > 0 && (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            animation: 'var(--transition-normal) fadeIn'
          }}
        >
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="vogue-card"
              style={{
                padding: '8px',
                margin: 0,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-xs)' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Category Badge overlay */}
                <span style={{ position: 'absolute', bottom: '6px', left: '6px', fontSize: '0.6rem', padding: '2px 6px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-surface)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  {item.category}
                </span>

                {/* Color Dot indicator */}
                <div 
                  title={item.colorName}
                  style={{ 
                    position: 'absolute', 
                    top: '6px', 
                    right: '6px', 
                    width: '14px', 
                    height: '14px', 
                    borderRadius: '50%', 
                    backgroundColor: item.colorHex,
                    border: '1.5px solid #FFFFFF',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                  }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', padding: '0 4px 4px 4px', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {item.colorName} • {item.pattern}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {item.formalLevel}
                  </span>
                  
                  <button
                    onClick={() => removeWardrobeItem(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-tertiary)',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '50%'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--error-rose)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WardrobeGrid;
