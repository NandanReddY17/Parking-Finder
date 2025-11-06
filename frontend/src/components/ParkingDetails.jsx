import React from 'react';
import { sessionStore, bookingStore } from '../utils/appStorage';
import 'remixicon/fonts/remixicon.css';

const ParkingDetails = ({ parking, userLocation, onBack, onNavigate }) => {
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(2)} km`;
  };

  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}/hr`;
  };

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-white shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <button
            onClick={onBack}
            className="mb-4 flex items-center text-white/90 hover:text-white transition-colors font-medium"
          >
            <i className="ri-arrow-left-line mr-2 text-xl"></i>
            Back
          </button>
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <i className="ri-parking-box-line text-3xl"></i>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{parking.name}</h1>
              <p className="text-white/90 flex items-start">
                <i className="ri-map-pin-line mr-2 mt-1 flex-shrink-0"></i>
                <span>{parking.address}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          {/* Price and Distance Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="text-sm opacity-90 mb-1">Price</div>
              <div className="text-3xl font-bold">
                {formatPrice(parking.price)}
              </div>
              <div className="text-sm opacity-80 mt-1">per hour</div>
            </div>
            {parking.distance && (
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="text-sm opacity-90 mb-1">Distance</div>
                <div className="text-3xl font-bold">
                  {formatDistance(parking.distance)}
                </div>
                <div className="text-sm opacity-80 mt-1">away</div>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <i className="ri-parking-box-line text-blue-600 text-xl"></i>
                <span className="text-gray-700 font-semibold">Availability</span>
              </div>
              <span className={`font-bold text-lg ${getAvailabilityColor(parking.availableSpots, parking.totalSpots)}`}>
                {parking.availableSpots} / {parking.totalSpots} spots
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  (parking.availableSpots / parking.totalSpots) * 100 > 50
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : (parking.availableSpots / parking.totalSpots) * 100 > 20
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-red-500 to-pink-600'
                }`}
                style={{
                  width: `${(parking.availableSpots / parking.totalSpots) * 100}%`
                }}
              ></div>
            </div>
          </div>

          {/* Rating and Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rating */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 border border-yellow-100">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-400 p-3 rounded-xl">
                  <i className="ri-star-fill text-white text-xl"></i>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Rating</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {parking.rating} / 5.0
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {parking.features && parking.features.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <i className="ri-checkbox-multiple-line mr-2 text-blue-600"></i>
                  Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parking.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"
                    >
                      <i className="ri-check-line mr-1 text-green-500"></i>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map Preview */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-64 flex items-center justify-center shadow-inner border border-gray-300">
            <div className="text-center">
              <div className="bg-white p-4 rounded-full mb-3 shadow-md inline-block">
                <i className="ri-map-pin-line text-4xl text-blue-600"></i>
              </div>
              <p className="text-gray-700 font-medium mb-1">Location</p>
              <p className="text-sm text-gray-500">
                {parking.lat.toFixed(4)}, {parking.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Navigate Button */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate(parking)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <i className="ri-navigation-line text-xl"></i>
              <span>Navigate</span>
            </button>
            <button
              onClick={() => {
                const user = sessionStore.getCurrentUser();
                if (!user) {
                  window.location.href = '/login';
                  return;
                }
                bookingStore.create({ userId: user.id, parking });
                alert('Parking slot booked! Find it in Account > Bookings');
                window.location.reload();
              }}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-green-700 transition-all"
            >
              <i className="ri-parking-box-line mr-2"></i>
              Book Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetails;

