import React, { useEffect, useRef, useState } from 'react';

const ParkingMap = ({ parkingPlaces, userLocation, onSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // Initialize Google Maps
    const initMap = () => {
      if (!window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: userLocation.lat, lng: userLocation.lng },
        zoom: 13,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);

      // Add user location marker
      new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        title: 'Your Location',
        zIndex: 1000
      });

      // Add parking place markers
      markersRef.current = parkingPlaces.map((parking) => {
        const marker = new window.google.maps.Marker({
          position: { lat: parking.lat, lng: parking.lng },
          map: map,
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#34D399',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1,
            rotation: 180
          },
          title: parking.name
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${parking.name}</h3>
              <p style="font-size: 11px; color: #666; margin: 4px 0;">${parking.address}</p>
              <p style="font-size: 12px; margin: 4px 0;">
                <span style="color: #10b981; font-weight: bold;">$${parking.price.toFixed(2)}/hr</span>
              </p>
              <p style="font-size: 11px; margin: 4px 0;">
                ${parking.availableSpots}/${parking.totalSpots} spots available
              </p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          onSelect(parking);
        });

        return marker;
      });
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      // Using a demo key - user should replace with their own
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error('Failed to load Google Maps');
        setMapLoaded(false);
      };
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Cleanup
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [parkingPlaces, userLocation, onSelect]);

  return (
    <div className="h-full w-full relative">
      <div ref={mapRef} className="h-full w-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
            {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
              <p className="text-sm text-gray-500 mt-2">
                Note: Add VITE_GOOGLE_MAPS_API_KEY to .env for map functionality
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingMap;

