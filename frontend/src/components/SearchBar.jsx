import React from 'react';
import 'remixicon/fonts/remixicon.css';

const SearchBar = ({ value, onChange, placeholder = "Search parking slots by area..." }) => {
  return (
    <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700">
      <div className="flex items-center px-4 py-3">
        <i className="ri-search-line text-gray-400 text-xl mr-3"></i>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-base"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

