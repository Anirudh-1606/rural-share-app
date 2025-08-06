import axios from 'axios';
<<<<<<< HEAD
=======
import { ImagePickerResult } from './ImagePickerService';

>>>>>>> 6f82ee59370ce739dd22d1e52e30a74ad5c1e2f7
import { API_BASE_URL } from '../config/api';
import { Category, SubCategory } from './CatalogueService';

const BASE_URL = API_BASE_URL;

export interface CreateListingPayload {
  providerId: string;
  title: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
<<<<<<< HEAD
  photos: string[];
  videoUrl?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; 
  };
=======
  photos: ImagePickerResult[];
  coordinates: [number, number]; // [longitude, latitude]
>>>>>>> 6f82ee59370ce739dd22d1e52e30a74ad5c1e2f7
  price: number;
  unitOfMeasure: string;
  minimumOrder: number;
  availableFrom: string; 
  availableTo: string; 
  isActive: boolean;
  tags: string[];
  isVerified: boolean;
}

export interface Listing extends CreateListingPayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  bookingCount: number;
  __v: number;
}

export interface PopulatedListing extends Omit<Listing, 'categoryId' | 'subCategoryId'> {
  categoryId: Category;
  subCategoryId: SubCategory;
}

class ListingService {
  private getAuthHeaders(token?: string) {
    return token ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } : {};
  }

  async createListing(payload: CreateListingPayload, token: string): Promise<Listing> {
    try {
<<<<<<< HEAD
      const response = await axios.post(
        `${BASE_URL}/listings`,
        payload,
        this.getAuthHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating listing:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create listing');
=======
      console.log('ListingService: Creating listing with payload:', payload);
      console.log('ListingService: Using token:', token);

      // Create FormData for file upload
      const formData = new FormData();

      // Add photos as files
      if (payload.photos && payload.photos.length > 0) {
        payload.photos.forEach((photo, index) => {
          if (photo.uri) {
            // Create file object from URI
            const file = {
              uri: photo.uri,
              type: photo.type || 'image/jpeg',
              name: photo.name || `photo_${index}.jpg`,
            } as any;
            
            formData.append('photos', file);
          }
        });
      }

      // Add other data as JSON string
      const listingData = {
        providerId: payload.providerId,
        title: payload.title,
        description: payload.description,
        categoryId: payload.categoryId,
        subCategoryId: payload.subCategoryId,
        coordinates: payload.coordinates,
        price: payload.price,
        unitOfMeasure: payload.unitOfMeasure,
        minimumOrder: payload.minimumOrder,
        availableFrom: payload.availableFrom,
        availableTo: payload.availableTo,
        tags: payload.tags,
        isActive: payload.isActive,
        viewCount: payload.viewCount,
        bookingCount: payload.bookingCount,
        isVerified: payload.isVerified,
      };

      formData.append('data', JSON.stringify(listingData));

      console.log('ListingService: Sending FormData with files:', payload.photos.length);
      console.log('ListingService: FormData structure:', {
        hasPhotos: payload.photos.length > 0,
        photoCount: payload.photos.length,
        firstPhotoUri: payload.photos[0]?.uri || 'none'
      });

      const response = await axios.post(`${BASE_URL}/listings`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('ListingService: Error creating listing:', error);
      throw error;
>>>>>>> 6f82ee59370ce739dd22d1e52e30a74ad5c1e2f7
    }
  }

  async getProviderListings(providerId: string, token?: string): Promise<Listing[]> {
    try {
      const response = await axios.get(
        `${BASE_URL}/listings/provider/${providerId}`,
        this.getAuthHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching provider listings:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch provider listings');
    }
  }

  async getListingById(listingId: string, token?: string): Promise<PopulatedListing> {
    try {
      const response = await axios.get(
        `${BASE_URL}/listings/${listingId}`,
        this.getAuthHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching listing:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch listing');
    }
  }

  async updateListing(listingId: string, payload: Partial<CreateListingPayload>, token: string): Promise<Listing> {
    try {
      console.log('ListingService.updateListing - URL:', `${BASE_URL}/listings/${listingId}`);
      console.log('ListingService.updateListing - payload:', JSON.stringify(payload, null, 2));
      const response = await axios.patch(
        `${BASE_URL}/listings/${listingId}`,
        payload,
        this.getAuthHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating listing:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update listing');
    }
  }

  async deleteListing(listingId: string, token: string): Promise<void> {
    try {
      await axios.delete(
        `${BASE_URL}/listings/${listingId}`,
        this.getAuthHeaders(token)
      );
    } catch (error: any) {
      console.error('Error deleting listing:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete listing');
    }
  }

  async toggleListingStatus(listingId: string, isActive: boolean, token: string): Promise<Listing> {
    try {
      const response = await axios.patch(
        `${BASE_URL}/listings/${listingId}`,
        { isActive },
        this.getAuthHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      console.error('Error toggling listing status:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update listing status');
    }
  }

  async getListingsByCategories(categoryId: string, subCategoryId: string, token?: string): Promise<Listing[]> {
    try {
      const response = await axios.get(
        `${BASE_URL}/listings`,
        {
          ...this.getAuthHeaders(token),
          params: { categoryId, subCategoryId }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching listings by category:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch listings');
    }
  }
}

export default new ListingService();
