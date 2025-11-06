# Parking Finder App

A simple parking finder application that helps you find nearby parking places and navigate to them.

## Features

- 🗺️ **Find Nearby Parking** - Automatically detects your location and shows nearby parking places
- 📍 **Interactive Map** - View parking places on an interactive map
- 📋 **Parking List** - Browse available parking places with details
- 🚗 **Navigation** - Get directions to any parking place via Google Maps
- 💾 **Local Storage** - All data stored locally in browser

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Add Google Maps API Key:
   - Create a `.env` file in the `frontend` directory
   - Add your Google Maps API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
   - Note: The app will work without the API key, but map functionality will be limited

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ParkingList.jsx      # List view of parking places
│   │   ├── ParkingMap.jsx       # Map view with markers
│   │   └── ParkingDetails.jsx   # Detailed parking information
│   ├── pages/
│   │   └── ParkingFinder.jsx    # Main page component
│   ├── utils/
│   │   └── parkingStorage.js    # localStorage utilities
│   ├── App.jsx                  # Main app router
│   └── main.jsx                 # App entry point
```

## Usage

1. **Allow Location Access** - The app will request your location to show nearby parking places
2. **Browse Parking Places** - View parking places in list or map view
3. **View Details** - Click on any parking place to see more information
4. **Navigate** - Click "Navigate" to get directions via Google Maps

## Data Storage

All parking data is stored in browser localStorage. The app comes with 5 sample parking places by default. You can modify the data in `src/utils/parkingStorage.js`.

## Technologies Used

- React
- React Router
- Tailwind CSS
- Google Maps API (optional)
- Remix Icons

## Notes

- The app uses browser geolocation API to get your location
- If location access is denied, it defaults to a central location
- Parking data persists in localStorage across sessions
- Map functionality requires a Google Maps API key (optional)

## License

This project is open source and available for educational purposes.

