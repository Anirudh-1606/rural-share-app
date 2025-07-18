import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

class LocationService {
  async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'RuralShare needs access to your location to show nearby services',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return false;
  }

  getCurrentPosition(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('LocationService: Geolocation.getCurrentPosition success:', { latitude, longitude });
          
          // Get city name from coordinates using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );
            const responseText = await response.text();
            try {
              const data = JSON.parse(responseText);
              console.log('LocationService: Reverse geocoding success:', data);
            } catch (jsonError) {
              console.error('LocationService: JSON parsing failed, raw response:', responseText);
              throw jsonError;
            }
            
            resolve({
              latitude,
              longitude,
              city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
              state: data.address?.state || '',
              country: data.address?.country || '',
            });
          } catch (error) {
            console.error('LocationService: Reverse geocoding failed:', error);
            // If geocoding fails, still return coordinates
            resolve({ latitude, longitude });
          }
        },
        (error) => {
          console.error('LocationService: Geolocation.getCurrentPosition error:', error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        console.log('LocationService: Location permission denied');
        return null;
      }

      console.log('LocationService: Location permission granted, attempting to get current position...');
      const location = await this.getCurrentPosition();
      console.log('LocationService: Successfully retrieved location:', location);
      return location;
    } catch (error) {
      console.error('LocationService: Error getting location:', error);
      return null;
    }
  }
}

export default new LocationService();