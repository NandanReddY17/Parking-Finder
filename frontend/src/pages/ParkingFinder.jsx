import React, { useState, useEffect } from 'react';
import { parkingStorage } from '../utils/parkingStorage';
import ParkingList from '../components/ParkingList';
import ParkingMap from '../components/ParkingMap';
import ParkingDetails from '../components/ParkingDetails';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom'
import FilterPanel from '../components/FilterPanel';
import 'remixicon/fonts/remixicon.css';

const ParkingFinder = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyParking, setNearbyParking] = useState([]);
  const [filteredParking, setFilteredParking] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    maxPrice: null,
    maxDistance: null,
    minSlots: null,
    sortBy: 'distance' // distance, price, slots
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Initialize parking storage
    parkingStorage.initialize();

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Get nearby parking places (increased radius to 15km for Chennai area)
          const nearby = parkingStorage.getNearbyParkingPlaces(latitude, longitude, 15);
          setNearbyParking(nearby);
          setFilteredParking(nearby);
          setLoading(false);
        },
        (err) => {
          console.error('Error getting location:', err);
          // Default to Shiv Nadar University Chennai if geolocation fails
          const defaultLocation = { lat: 13.0827, lng: 80.2707 }; // Shiv Nadar University Chennai
          setUserLocation(defaultLocation);
          const nearby = parkingStorage.getNearbyParkingPlaces(defaultLocation.lat, defaultLocation.lng, 15);
          setNearbyParking(nearby);
          setFilteredParking(nearby);
          setLoading(false);
          setError('Could not get your location. Showing Shiv Nadar University Chennai area.');
        }
      );
    } else {
      // Fallback if geolocation not supported - Default to Shiv Nadar University Chennai
      const defaultLocation = { lat: 13.0827, lng: 80.2707 }; // Shiv Nadar University Chennai
      setUserLocation(defaultLocation);
      const nearby = parkingStorage.getNearbyParkingPlaces(defaultLocation.lat, defaultLocation.lng, 15);
      setNearbyParking(nearby);
      setFilteredParking(nearby);
      setLoading(false);
      setError('Geolocation is not supported. Showing Shiv Nadar University Chennai area.');
    }
  }, []);

  // Filter and search parking places
  useEffect(() => {
    let filtered = [...nearbyParking];

    // Search by area/name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(parking => 
        parking.name.toLowerCase().includes(query) ||
        parking.address.toLowerCase().includes(query)
      );
    }

    // Filter by price
    if (filters.maxPrice !== null && filters.maxPrice !== '') {
      filtered = filtered.filter(parking => parking.price <= parseFloat(filters.maxPrice));
    }

    // Filter by distance
    if (filters.maxDistance !== null && filters.maxDistance !== '') {
      filtered = filtered.filter(parking => 
        parking.distance && parking.distance <= parseFloat(filters.maxDistance)
      );
    }

    // Filter by minimum slots
    if (filters.minSlots !== null && filters.minSlots !== '') {
      filtered = filtered.filter(parking => 
        parking.availableSpots >= parseInt(filters.minSlots)
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      if (filters.sortBy === 'price') {
        return a.price - b.price;
      } else if (filters.sortBy === 'slots') {
        return b.availableSpots - a.availableSpots;
      } else {
        // distance (default)
        return (a.distance || 0) - (b.distance || 0);
      }
    });

    setFilteredParking(filtered);
  }, [nearbyParking, searchQuery, filters]);

  const handleParkingSelect = (parking) => {
    setSelectedParking(parking);
    // Smoothly scroll the sheet into full view
    try {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      });
    } catch {}
  };

  const handleBackToList = () => {
    setSelectedParking(null);
  };

  const handleNavigate = (parking) => {
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${parking.lat},${parking.lng}`;
    if (userLocation) {
      const urlWithOrigin = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${parking.lat},${parking.lng}`;
      window.open(urlWithOrigin, '_blank');
    } else {
      window.open(url, '_blank');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      maxPrice: null,
      maxDistance: null,
      minSlots: null,
      sortBy: 'distance'
    });
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-blue-500 mx-auto mb-6"></div>
            <i className="ri-parking-box-line text-4xl text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></i>
          </div>
          <p className="text-gray-300 font-medium text-lg">Finding parking places near you...</p>
          <p className="text-gray-500 text-sm mt-2">Please allow location access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-900">
      {/* Map Background - Always visible */}
      <div className="absolute inset-0 z-0">
        <ParkingMap
          parkingPlaces={filteredParking}
          userLocation={userLocation}
          onSelect={handleParkingSelect}
        />
      </div>

      {/* Search Bar - Top */}
      <div className="absolute top-4 left-4 right-16 z-40">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search parking slots by area..."
        />
      </div>

      {/* Account/Profile button */}
      <div className="absolute top-4 right-4 z-50">
        <a href="/account" className="h-11 w-11 rounded-xl bg-gray-800/95 backdrop-blur-md border border-gray-700 flex items-center justify-center text-white shadow">
          <i className="ri-user-3-line"></i>
        </a>
      </div>

      {/* Filter Buttons - Below Search */}
      <div className="absolute top-24 left-4 right-4 z-40">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-32 left-4 right-4 z-50 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center">
            <i className="ri-alert-line text-xl mr-2"></i>
            <p className="font-medium text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Bottom Panel - Parking List */}
      {selectedParking ? (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
          <ParkingDetails
            parking={selectedParking}
            userLocation={userLocation}
            onBack={handleBackToList}
            onNavigate={handleNavigate}
          />
        </div>
      ) : (
        <div className={`absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${
          showList ? 'translate-y-0' : 'translate-y-[calc(100%-100px)]'
        }`}>
          {/* Panel Handle */}
          <div 
            className="flex justify-center pt-3 pb-2 cursor-pointer"
            onClick={() => setShowList(!showList)}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Panel Header */}
          <div className="px-4 pb-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                {filteredParking.length > 0 ? (
                  <>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {filteredParking.length} Parking {filteredParking.length === 1 ? 'Place' : 'Places'} Found
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {searchQuery ? `Searching for "${searchQuery}"` : 'Nearby parking spots'}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-gray-800">Suggested nearby places</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Popular options around you</p>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowList(!showList)}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <i className={`ri-${showList ? 'arrow-down' : 'arrow-up'}-line text-xl`}></i>
              </button>
            </div>
          </div>

          {/* Parking List */}
          <div className={`overflow-y-auto ${filteredParking.length === 0 ? 'max-h-64' : 'max-h-[calc(85vh-100px)]'}`}>
            <ParkingList
              parkingPlaces={filteredParking}
              userLocation={userLocation}
              onSelect={handleParkingSelect}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingFinder;

