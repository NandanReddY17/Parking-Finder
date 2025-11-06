// Parking places storage utilities (Chennai area)

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Sample parking places data - Near Shiv Nadar University, Chennai
// Shiv Nadar University Chennai approx: 13.0827 N, 80.2707 E
const defaultParkingPlaces = [
  { id: '1', name: 'Shiv Nadar University Main Gate Parking', address: 'Near Main Gate, Shiv Nadar University, Kalavakkam, Chennai', lat: 13.0827, lng: 80.2707, availableSpots: 25, totalSpots: 60, price: 2.0, distance: null, rating: 4.5, features: ['Campus Access','Covered','Student Discount'] },
  { id: '2', name: 'Kalavakkam Road Parking Lot', address: 'Kalavakkam Main Road, Near University, Chennai', lat: 13.085, lng: 80.272, availableSpots: 15, totalSpots: 40, price: 1.5, distance: null, rating: 4.2, features: ['Cheap','Open Air','Close to Campus'] },
  { id: '3', name: 'IT Corridor Parking Complex', address: 'IT Highway, OMR Road, Near University, Chennai', lat: 13.08, lng: 80.268, availableSpots: 45, totalSpots: 100, price: 3.0, distance: null, rating: 4.3, features: ['Covered','Large Capacity','24/7'] },
  { id: '4', name: 'Student Hostel Area Parking', address: 'Hostel Road, Near Student Accommodation, Chennai', lat: 13.084, lng: 80.269, availableSpots: 30, totalSpots: 70, price: 2.5, distance: null, rating: 4.1, features: ['Student Friendly','Secure','Affordable'] },
  { id: '5', name: 'OMR Road Side Parking', address: 'OMR Road, Near Kalavakkam, Chennai', lat: 13.078, lng: 80.265, availableSpots: 20, totalSpots: 35, price: 1.0, distance: null, rating: 3.8, features: ['Street Parking','Cheap','Easy Access'] },
  // Nearby
  { id: '6', name: 'Sholinganallur Metro Station Parking', address: 'Sholinganallur Metro Station, OMR Road, Chennai', lat: 13.04, lng: 80.23, availableSpots: 60, totalSpots: 150, price: 2.5, distance: null, rating: 4.6, features: ['Metro Access','Covered','Long-term'] },
  { id: '7', name: 'Semmencherry Parking Lot', address: 'Semmencherry, Near OMR, Chennai', lat: 13.06, lng: 80.24, availableSpots: 35, totalSpots: 80, price: 2.0, distance: null, rating: 4.1, features: ['Covered','Secure','Affordable'] },
  { id: '8', name: 'Kelambakkam Road Parking', address: 'Kelambakkam Main Road, Chennai', lat: 13.09, lng: 80.275, availableSpots: 18, totalSpots: 30, price: 1.5, distance: null, rating: 4.0, features: ['Open Air','Cheap','Nearby'] },
  { id: '9', name: 'SIPCOT IT Park Parking', address: 'SIPCOT IT Park, Siruseri, Chennai', lat: 13.075, lng: 80.26, availableSpots: 100, totalSpots: 250, price: 4.0, distance: null, rating: 4.5, features: ['IT Park','Large Capacity','Covered','Secure'] },
  { id: '10', name: 'Siruseri Parking Complex', address: 'Siruseri, OMR Road, Chennai', lat: 12.83, lng: 80.18, availableSpots: 45, totalSpots: 110, price: 3.5, distance: null, rating: 4.2, features: ['IT Corridor','Covered','Large Capacity'] }
];

export const parkingStorage = {
  // Initialize with defaults once
  initialize: () => {
    if (!localStorage.getItem('parkingPlaces')) {
      localStorage.setItem('parkingPlaces', JSON.stringify(defaultParkingPlaces));
    }
  },

  getAllParkingPlaces: () => {
    const places = localStorage.getItem('parkingPlaces');
    return places ? JSON.parse(places) : defaultParkingPlaces;
  },

  getParkingPlaceById: (id) => {
    const places = parkingStorage.getAllParkingPlaces();
    return places.find((p) => p.id === id);
  },

  addParkingPlace: (placeData) => {
    const places = parkingStorage.getAllParkingPlaces();
    const newPlace = {
      id: generateId(),
      name: placeData.name,
      address: placeData.address,
      lat: placeData.lat,
      lng: placeData.lng,
      availableSpots: placeData.availableSpots || 0,
      totalSpots: placeData.totalSpots || 0,
      price: placeData.price || 0,
      distance: null,
      rating: placeData.rating || 0,
      features: placeData.features || []
    };
    places.push(newPlace);
    localStorage.setItem('parkingPlaces', JSON.stringify(places));
    return newPlace;
  },

  updateParkingPlace: (id, updates) => {
    const places = parkingStorage.getAllParkingPlaces();
    const index = places.findIndex((p) => p.id === id);
    if (index !== -1) {
      places[index] = { ...places[index], ...updates };
      localStorage.setItem('parkingPlaces', JSON.stringify(places));
      return places[index];
    }
    return null;
  },

  // Haversine distance in km
  calculateDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  getNearbyParkingPlaces: (userLat, userLng, radius = 15) => {
    const places = parkingStorage.getAllParkingPlaces();
    const placesWithDistance = places.map((place) => {
      const distance = parkingStorage.calculateDistance(
        userLat,
        userLng,
        place.lat,
        place.lng
      );
      return { ...place, distance };
    });

    return placesWithDistance
      .filter((place) => place.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }
};
