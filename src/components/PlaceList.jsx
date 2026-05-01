import React from 'react';
import PlaceCard from './PlaceCard';

const PlaceList = ({ title, icon: Icon, places, isLoading, onPlaceClick }) => {
  return (
    <div className="places-section">
      <h2 className="category-title">
        <Icon size={28} color="var(--primary-color)" />
        {title}
      </h2>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--glass-border)', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }} />
          <p>Discovering nearby places...</p>
        </div>
      ) : places.length === 0 ? (
        <div className="no-results">
          <p>No {title.toLowerCase()} found nearby.</p>
        </div>
      ) : (
        <div className="places-grid">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} onClick={onPlaceClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceList;
