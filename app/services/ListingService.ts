import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { Category, SubCategory } from './CatalogueService';

const BASE_URL = API_BASE_URL;

export interface CreateListingPayload {
  providerId: string;
  title: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  photos: string[];
  videoUrl?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; 
  };
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
      const response = await axios.post(
        `${BASE_URL}/listings`,
        payload,
        this.getAuthHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating listing:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create listing');
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
