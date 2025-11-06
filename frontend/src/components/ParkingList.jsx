import React from 'react';
import { parkingStorage } from '../utils/parkingStorage';
import { sessionStore, bookingStore } from '../utils/appStorage';
import 'remixicon/fonts/remixicon.css';

const ParkingList = ({ parkingPlaces, userLocation, onSelect, onNavigate }) => {
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(2)} km`;
  };

  const formatPrice = (price) => {
    return `₹${4*price.toFixed(2)}/hr`;
  };

  const suggestions = React.useMemo(() => {
    const all = parkingStorage.getAllParkingPlaces();
    if (!userLocation) return all.slice(0, 5);
    const withDistance = all.map(p => ({
      ...p,
      distance: p.distance ?? parkingStorage.calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng)
    }));
    return withDistance.sort((a,b) => (a.distance || 0) - (b.distance || 0)).slice(0, 5);
  }, [userLocation]);

  return (
    <div className="bg-white">
      {parkingPlaces.length === 0 ? (
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-semibold text-gray-800">Suggested nearby places</h3>
              <p className="text-xs text-gray-500">Showing popular options around you</p>
            </div>
          </div>
          <div className="space-y-3">
            {suggestions.map((parking) => (
              <div
                key={parking.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
                onClick={() => onSelect(parking)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{parking.name}</h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
                        <div className="flex items-center">
                          <i className="ri-star-fill text-yellow-500 mr-1"></i>
                          <span className="font-medium">{parking.rating}</span>
                        </div>
                        {typeof parking.distance === 'number' && (
                          <div className="flex items-center">
                            <i className="ri-road-map-line mr-1"></i>
                            <span>{formatDistance(parking.distance)}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 flex items-start">
                        <i className="ri-map-pin-line mr-1 mt-0.5 flex-shrink-0"></i>
                        <span>{parking.address}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-bold text-green-600 mb-1">{formatPrice(parking.price)}</div>
                      <div className="text-xs text-gray-500">{parking.availableSpots}/{parking.totalSpots} spots</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(parking);
                        }}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Directions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {parkingPlaces.map((parking) => (
            <div
              key={parking.id}
              className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
              onClick={() => onSelect(parking)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {parking.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">Parking lot</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
                      <div className="flex items-center">
                        <i className="ri-star-fill text-yellow-500 mr-1"></i>
                        <span className="font-medium">{parking.rating}</span>
                        <span className="text-gray-400 ml-1">({Math.floor(Math.random() * 10) + 1})</span>
                      </div>
                      {parking.distance && (
                        <div className="flex items-center">
                          <i className="ri-road-map-line mr-1"></i>
                          <span>{formatDistance(parking.distance)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-start">
                      <i className="ri-map-pin-line mr-1 mt-0.5 flex-shrink-0"></i>
                      <span>{parking.address}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-bold text-green-600 mb-1">
                      {formatPrice(parking.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {parking.availableSpots}/{parking.totalSpots} spots
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(parking);
                      }}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Directions
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const user = sessionStore.getCurrentUser();
                        if (!user) {
                          window.location.href = '/login';
                          return;
                        }
                        bookingStore.create({ userId: user.id, parking });
                        alert('Booked! Check Account > Bookings');
                        window.location.reload();
                      }}
                      className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Book
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Share functionality
                        if (navigator.share) {
                          navigator.share({
                            title: parking.name,
                            text: `Check out ${parking.name} at ${parking.address}`,
                            url: window.location.href
                          });
                        }
                      }}
                      className="px-3 py-1.5 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <i className="ri-share-line text-lg"></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Save functionality
                      }}
                      className="px-3 py-1.5 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <i className="ri-bookmark-line text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParkingList;

