import React, { useEffect } from 'react';
import { X, Phone, MapPin, ExternalLink } from 'lucide-react';

const ContactModal = ({ place, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!place) return null;

  // Ensure phone number exists and strip text for href
  const hasPhone = place.phone && place.phone.toLowerCase() !== "no contact info available";
  const phoneHref = hasPhone ? `tel:${place.phone.replace(/[^0-9+]/g, '')}` : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} color="#333" />
        </button>
        
        <img src={place.image} alt={place.name} className="modal-image" />
        
        <div className="modal-body">
          <h2 className="modal-title">{place.name}</h2>
          
          <div className="place-phone">
            <Phone size={18} color="var(--primary-color)" />
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{place.phone}</span>
          </div>

          <p className="modal-desc">{place.summary}</p>
          
          <div className="modal-actions">
            {hasPhone && (
              <a href={phoneHref} className="contact-btn">
                <Phone size={20} />
                Call Now
              </a>
            )}
            
            {place.wikiLink && (
              <a 
                href={place.wikiLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-btn" 
                style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' }}
              >
                <ExternalLink size={20} />
                Learn More
              </a>
            )}
            
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-btn" 
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              <MapPin size={20} />
              Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
