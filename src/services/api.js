const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "YOUR_OPENWEATHER_API_KEY";
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || "YOUR_UNSPLASH_API_KEY";

export const getCoordinates = async (village) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(village)}`);
  const data = await res.json();
  if (data.length === 0) throw new Error("Village not found");
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    displayName: data[0].display_name
  };
};

export const getWeather = async (lat, lon) => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
  const data = await res.json();
  if (data.cod !== 200) throw new Error(data.message);
  return data;
};

export const getPlaces = async (lat, lon, type) => {
  let query = "";
  if (type === "hospital") {
    query = `
      [out:json];
      (
        node["amenity"~"hospital|clinic|doctors"](around:10000,${lat},${lon});
        node["healthcare"~"hospital|clinic"](around:10000,${lat},${lon});
      );
      out center;
    `;
  } else if (type === "restaurant") {
    query = `
      [out:json];
      node["amenity"~"restaurant|cafe|fast_food|food_court"](around:10000,${lat},${lon});
      out center;
    `;
  } else if (type === "temple") {
    query = `
      [out:json];
      node["amenity"="place_of_worship"](around:10000,${lat},${lon});
      out center;
    `;
  }

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  });
  const data = await res.json();
  
  if (!data.elements || data.elements.length === 0) return [];

  // Map places and fetch additional info concurrently for efficiency
  // Limit to top 6 to prevent overwhelming APIs
  const topPlaces = data.elements.slice(0, 6);
  
  const enrichedPlaces = await Promise.all(topPlaces.map(async (place) => {
    if (!place.tags || !place.tags.name) return null;
    
    const name = place.tags.name;
    const phone = place.tags["phone"] || place.tags["contact:phone"] || "No contact info available";
    
    try {
      const [imgRes, wikiRes] = await Promise.all([
        fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(name + ' ' + type)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`),
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`)
      ]);
      
      const imgData = await imgRes.json();
      const wikiData = await wikiRes.json();
      
      return {
        id: place.id,
        name,
        phone,
        lat: place.lat,
        lon: place.lon,
        image: imgData.results?.[0]?.urls?.small || "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=400",
        summary: wikiData.extract || "No description available.",
        wikiLink: wikiData.content_urls?.desktop?.page || null
      };
    } catch (e) {
      console.error("Error enriching place info", e);
      return {
        id: place.id,
        name,
        phone,
        lat: place.lat,
        lon: place.lon,
        image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=400",
        summary: "No description available.",
        wikiLink: null
      };
    }
  }));

  return enrichedPlaces.filter(p => p !== null);
};
