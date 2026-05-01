import React from 'react';
import { Phone, ExternalLink } from 'lucide-react';

const PlaceCard = ({ place, onClick }) => {
  return (
    <div className="glass-panel place-card" onClick={() => onClick(place)} style={{ cursor: 'pointer' }}>
      <img src={place.image} alt={place.name} className="place-image" loading="lazy" />
      <div className="place-info">
        <h4 className="place-name">{place.name}</h4>
        <div className="place-phone">
          <Phone size={16} />
          {place.phone}
        </div>
        <p className="place-desc">{place.summary}</p>
        <span className="place-link" style={{ marginTop: 'auto', display: 'inline-block' }}>
          Click to View Options
        </span>
      </div>
    </div>
  );
};

export default PlaceCard;
