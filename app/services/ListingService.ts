import axios from 'axios';
import { ImagePickerResult } from './ImagePickerService';

import { API_BASE_URL } from '../config/api';

const BASE_URL = API_BASE_URL;

export interface CreateListingPayload {
  providerId: string;
  title: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  photos: ImagePickerResult[];
  coordinates: [number, number]; // [longitude, latitude]
  price: number;
  unitOfMeasure: string;
  minimumOrder: number;
  availableFrom: string;
  availableTo: string;
  tags: string[];
  isActive: boolean;
  viewCount: number;
  bookingCount: number;
  isVerified: boolean;
}

export interface Listing extends CreateListingPayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

class ListingService {
  // Create a new listing
  async createListing(payload: CreateListingPayload, token: string): Promise<Listing> {
    try {
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
    }
  }

  // Get listings by provider
  async getProviderListings(providerId: string): Promise<Listing[]> {
    try {
      const response = await axios.get(`${BASE_URL}/listings/provider/${providerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider listings:', error);
      throw error;
    }
  }

  // Get listing by ID
  async getListingById(listingId: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/listings/${listingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching listing by ID:', error);
      throw error;
    }
  }
  async updateListing(listingId: string, payload: Partial<CreateListingPayload>): Promise<Listing> {
    try {
      const response = await axios.put(`${BASE_URL}/listings/${listingId}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  }

  // Delete a listing
  async deleteListing(listingId: string): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/listings/${listingId}`);
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  }

  // Toggle listing active status
  async toggleListingStatus(listingId: string, isActive: boolean): Promise<Listing> {
    try {
      const response = await axios.patch(`${BASE_URL}/listings/${listingId}/status`, {
        isActive
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling listing status:', error);
      throw error;
    }
  }

  // Get listings by category and subcategory
  async getListingsByCategories(categoryId: string, subCategoryId: string): Promise<Listing[]> {
    try {
      const response = await axios.get(`${BASE_URL}/listings`, {
        params: { categoryId, subCategoryId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching listings by category and subcategory:', error);
      throw error;
    }
  }
}

export default new ListingService();