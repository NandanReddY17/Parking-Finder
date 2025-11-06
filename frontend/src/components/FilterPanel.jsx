import React, { useState } from 'react';
import 'remixicon/fonts/remixicon.css';

const FilterPanel = ({ filters, onFilterChange, onClearFilters, showFilters, onToggleFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterUpdate = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters = filters.maxPrice || filters.maxDistance || filters.minSlots || filters.sortBy !== 'distance';

  return (
    <div className="space-y-2">
      {/* Quick Filter Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {/* Sort By Dropdown */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterUpdate('sortBy', e.target.value)}
            className="bg-gray-800/95 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-gray-700 text-sm font-medium appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="distance">Distance</option>
            <option value="price">Price (Low to High)</option>
            <option value="slots">Available Slots</option>
          </select>
          <i className="ri-arrow-down-s-line absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>

        {/* Filter Button */}
        <button
          onClick={onToggleFilters}
          className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all ${
            hasActiveFilters
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800/95 backdrop-blur-md text-white border border-gray-700'
          }`}
        >
          <i className="ri-filter-3-line"></i>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {[filters.maxPrice, filters.maxDistance, filters.minSlots].filter(f => f !== null && f !== '').length}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setLocalFilters({
                maxPrice: null,
                maxDistance: null,
                minSlots: null,
                sortBy: 'distance'
              });
              onClearFilters();
            }}
            className="px-4 py-2 bg-gray-800/95 backdrop-blur-md text-white rounded-xl font-medium text-sm border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-4 space-y-4 animate-in slide-in-from-top-2">
          {/* Price Filter */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              <i className="ri-money-dollar-circle-line mr-2"></i>
              Max Price ($/hr)
            </label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterUpdate('maxPrice', e.target.value)}
              placeholder="e.g., 10"
              min="0"
              step="0.5"
              className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Distance Filter */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              <i className="ri-road-map-line mr-2"></i>
              Max Distance (km)
            </label>
            <input
              type="number"
              value={filters.maxDistance || ''}
              onChange={(e) => handleFilterUpdate('maxDistance', e.target.value)}
              placeholder="e.g., 5"
              min="0"
              step="0.5"
              className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Slots Filter */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              <i className="ri-parking-box-line mr-2"></i>
              Min Available Slots
            </label>
            <input
              type="number"
              value={filters.minSlots || ''}
              onChange={(e) => handleFilterUpdate('minSlots', e.target.value)}
              placeholder="e.g., 5"
              min="0"
              step="1"
              className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

