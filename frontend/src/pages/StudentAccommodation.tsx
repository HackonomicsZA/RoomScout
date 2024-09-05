import React, { useEffect, useState } from 'react';

const StudentAccommodation: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [accommodations, setAccommodations] = useState<google.maps.places.PlaceResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('Wits University'); // Default search query
  const [distances, setDistances] = useState<string[]>([]);
  const [universityLocation, setUniversityLocation] = useState<google.maps.LatLng | null>(null);

  useEffect(() => {
    const initMap = () => {
      const mapInstance = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: { lat: -26.1906, lng: 28.0306 }, // Default location (Wits University)
          zoom: 14,
        }
      );

      setMap(mapInstance);
      performGeocodeSearch(); // Initial geocode search
    };

    const loadMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCf28D3Rw4IaDmJy5UPCsq1en65a3Aj-ik&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initMap();
      };
      document.body.appendChild(script);
    };

    loadMapScript();
  }, []);

  const performGeocodeSearch = () => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0].geometry) {
        const location = results[0].geometry.location;
        setUniversityLocation(location);
        if (map) {
          map.setCenter(location);
          performNearbySearch(map, location);
        }
      } else {
        console.error('Error with geocoding:', status);
        setErrorMessage('Unable to find the specified university.');
      }
    });
  };

  const performNearbySearch = (mapInstance: google.maps.Map, location: google.maps.LatLng) => {
    const service = new google.maps.places.PlacesService(mapInstance);
    const request: google.maps.places.PlaceSearchRequest = {
      location: location,
      radius: 100000, // Adjust the radius as needed
      type: 'lodging', // Search for lodging/accommodation places
      keyword: `student accommodation around ${searchQuery}`,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setAccommodations(results);
        setErrorMessage(null); // Clear any previous errors
        calculateDistances(results, mapInstance, location); // Calculate distances for each accommodation
      } else {
        console.error('Error with nearby search:', status);
        setAccommodations([]); // Clear any previous results
        setErrorMessage('No accommodations found or an error occurred.');
      }
    });
  };

  const calculateDistances = (accommodations: google.maps.places.PlaceResult[], mapInstance: google.maps.Map, universityLocation: google.maps.LatLng) => {
    const directionsService = new google.maps.DirectionsService();
    
    accommodations.forEach((accommodation, index) => {
      if (accommodation.geometry?.location) {
        const directionsRenderer = new google.maps.DirectionsRenderer(); // Create a new DirectionsRenderer
        directionsRenderer.setMap(mapInstance);

        const request: google.maps.DirectionsRequest = {
          origin: universityLocation,
          destination: accommodation.geometry.location,
          travelMode: google.maps.TravelMode.WALKING, // Can be changed to WALKING or BICYCLING
        };

        directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result); // Render the directions on the map
            const distanceText = result.routes[0].legs[0].distance?.text;
            setDistances((prevDistances) => {
              const updatedDistances = [...prevDistances];
              updatedDistances[index] = distanceText || 'Distance not available';
              return updatedDistances;
            });
          } else {
            setDistances((prevDistances) => {
              const updatedDistances = [...prevDistances];
              updatedDistances[index] = 'Route not available';
              return updatedDistances;
            });
          }
        });
      } else {
        setDistances((prevDistances) => {
          const updatedDistances = [...prevDistances];
          updatedDistances[index] = 'Location not available';
          return updatedDistances;
        });
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getPhotoUrl = (photo: google.maps.places.PlacePhoto) => {
    return photo.getUrl({ maxWidth: 200 }); // Adjust the size as needed
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Enter university name"
      />
      <button onClick={performGeocodeSearch}>
        Search Accommodations
      </button>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
      <h2>Available Student Accommodations near {searchQuery}</h2>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : accommodations.length === 0 ? (
        <p>Searching for nearby student accommodations...</p>
      ) : (
        <ol>
          {accommodations.map((accommodation, index) => (
            <li key={accommodation.place_id}>
              <strong>{index + 1}. {accommodation.name}</strong>
              <p>{accommodation.vicinity}</p>
              {accommodation.rating && <p>Rating: {accommodation.rating}</p>}
              {accommodation.user_ratings_total && <p>Rated by: {accommodation.user_ratings_total} people</p>}
              {accommodation.photos && accommodation.photos.length > 0 && (
                <div>
                  {accommodation.photos.map((photo, photoIndex) => (
                    <img
                      key={photoIndex}
                      src={getPhotoUrl(photo)}
                      alt={`Photo ${photoIndex + 1} of ${accommodation.name}`}
                      style={{ width: '100px', height: '100px', margin: '5px' }} // Adjust styles as needed
                    />
                  ))}
                </div>
              )}
              <p>Distance from university: {distances[index] || 'Calculating...'}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default StudentAccommodation;
