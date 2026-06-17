import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { X, Calendar, CheckCircle2, Circle, Sparkles, Shirt } from 'lucide-react';

const DailyTrackerModal = ({ onClose }) => {
  const { wardrobe, logDailyWear } = useContext(AppContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const [photo, setPhoto] = useState(null);

  const toggleItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedItems.length === 0 && !photo) {
      alert('Please select at least one garment or upload a photo.');
      return;
    }
    logDailyWear(selectedItems, photo);
    onClose();
  };

  // Group items by category
  const categorized = {
    Tops: wardrobe.filter(i => i.category === 'Tops'),
    Bottoms: wardrobe.filter(i => i.category === 'Bottoms'),
    Outerwear: wardrobe.filter(i => i.category === 'Outerwear'),
    Footwear: wardrobe.filter(i => i.category === 'Footwear')
  };

  return (
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
          maxHeight: '85vh',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
          animation: 'var(--transition-normal) slideUp'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>What are you wearing today?</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable contents */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }} className="no-scrollbar">
          
          {wardrobe.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-secondary)' }}>
              <Shirt size={28} color="var(--text-tertiary)" style={{ margin: '0 auto 12px auto' }} />
              <p style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                No clothes in your wardrobe yet. Please scan or import items in the Wardrobe tab first to log them here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Image Upload section */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Daily Snapshot (Optional)
                </label>
                {photo ? (
                  <div style={{ position: 'relative', width: '100px', height: '130px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={photo} alt="Daily Look" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => setPhoto(null)}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#FFFFFF'
                      }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      border: '1px dashed var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--bg-surface)'
                    }}
                  >
                    <X size={14} style={{ transform: 'rotate(45deg)' }} /> Add a photo of today's fit
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              {/* Categorized selector checklist */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
                  Select items you are wearing:
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Object.keys(categorized).map((catName) => {
                    const items = categorized[catName];
                    if (items.length === 0) return null;

                    return (
                      <div key={catName}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                          {catName}
                        </span>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {items.map(item => {
                            const selected = selectedItems.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                  padding: '8px 12px',
                                  backgroundColor: 'var(--bg-surface)',
                                  border: selected ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                                  borderRadius: 'var(--radius-sm)',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  transition: 'var(--transition-fast)'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <img src={item.image} alt="" style={{ width: '30px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} />
                                  <div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{item.name}</span>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{item.colorName} • {item.pattern}</span>
                                  </div>
                                </div>

                                {selected ? (
                                  <CheckCircle2 size={18} color="var(--accent-gold)" fill="rgba(179,146,102,0.1)" />
                                ) : (
                                  <Circle size={18} color="var(--border-color)" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSave}
            disabled={wardrobe.length === 0}
            className="btn-gold"
            style={{ flex: 1, gap: '6px' }}
          >
            Save Outfit <Sparkles size={14} />
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default DailyTrackerModal;
