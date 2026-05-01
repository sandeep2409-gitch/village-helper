import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import MapComponent from './components/MapComponent';
import WeatherWidget from './components/WeatherWidget';
import PlaceList from './components/PlaceList';
import ContactModal from './components/ContactModal';
import { getCoordinates, getWeather, getPlaces } from './services/api';
import { Hospital, Utensils, Building2 } from 'lucide-react';

function App() {
  const [appState, setAppState] = useState({
    isLoading: false,
    error: null,
    location: null, // { lat, lon, name }
    weather: null,
    places: {
      hospitals: [],
      restaurants: [],
      temples: []
    },
    loadingPlaces: false
  });

  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleSearch = async (village) => {
    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // 1. Get Coordinates
      const { lat, lon, displayName } = await getCoordinates(village);
      
      // Update location immediately to show map
      setAppState(prev => ({
        ...prev,
        location: { lat, lon, name: displayName },
        weather: null,
        places: { hospitals: [], restaurants: [], temples: [] },
        loadingPlaces: true
      }));

      // 2. Fetch Weather
      const weatherData = await getWeather(lat, lon);
      
      setAppState(prev => ({
        ...prev,
        weather: weatherData,
        isLoading: false
      }));

      // 3. Fetch Places (Concurrently)
      const [hospitals, restaurants, temples] = await Promise.all([
        getPlaces(lat, lon, "hospital"),
        getPlaces(lat, lon, "restaurant"),
        getPlaces(lat, lon, "temple")
      ]);

      setAppState(prev => ({
        ...prev,
        places: { hospitals, restaurants, temples },
        loadingPlaces: false
      }));

    } catch (err) {
      console.error(err);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to find the village. Please try again.",
        loadingPlaces: false
      }));
      alert(err.message || "Failed to find the village.");
    }
  };

  // Compile all markers for the map
  const mapMarkers = [
    ...appState.places.hospitals,
    ...appState.places.restaurants,
    ...appState.places.temples
  ];

  return (
    <div className="app-container">
      <header className="header">
        <h1>Village Explorer 🌾</h1>
        <p>Discover the hidden gems of your local towns and villages</p>
      </header>

      <SearchBar onSearch={handleSearch} isLoading={appState.isLoading} />

      {appState.location && (
        <>
          <div className="main-content">
            <MapComponent 
              center={[appState.location.lat, appState.location.lon]} 
              locationName={appState.location.name}
              markers={mapMarkers}
            />
            {appState.weather && (
              <WeatherWidget 
                weather={appState.weather} 
                locationName={appState.location.name.split(',')[0]} 
              />
            )}
          </div>

          <div style={{ width: '100%' }}>
            <PlaceList 
              title="Hospitals & Clinics" 
              icon={Hospital} 
              places={appState.places.hospitals} 
              isLoading={appState.loadingPlaces}
              onPlaceClick={setSelectedPlace}
            />
            
            <PlaceList 
              title="Restaurants & Cafes" 
              icon={Utensils} 
              places={appState.places.restaurants} 
              isLoading={appState.loadingPlaces}
              onPlaceClick={setSelectedPlace}
            />
            
            <PlaceList 
              title="Temples & Worship" 
              icon={Building2} 
              places={appState.places.temples} 
              isLoading={appState.loadingPlaces}
              onPlaceClick={setSelectedPlace}
            />
          </div>
        </>
      )}

      {/* Popup Modal for Contact Info */}
      <ContactModal 
        place={selectedPlace} 
        onClose={() => setSelectedPlace(null)} 
      />
    </div>
  );
}

export default App;
