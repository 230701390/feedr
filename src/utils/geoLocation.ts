
type Coordinates = {
  latitude: number;
  longitude: number;
};

export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  // Haversine formula to calculate distance between two points
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

export const getNearbyLocations = <T extends { location?: Coordinates }>(
  currentLocation: Coordinates,
  locations: T[],
  maxDistance: number = 10
): T[] => {
  return locations.filter((loc) => {
    if (!loc.location) return false;
    
    const distance = calculateDistance(currentLocation, loc.location);
    return distance <= maxDistance;
  }).sort((a, b) => {
    if (!a.location || !b.location) return 0;
    
    const distanceA = calculateDistance(currentLocation, a.location);
    const distanceB = calculateDistance(currentLocation, b.location);
    
    return distanceA - distanceB;
  });
};
