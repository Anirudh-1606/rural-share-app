import axios from 'axios';

const BASE_URL = 'YOUR_API_BASE_URL'; // Replace with actual base URL

export interface CreateListingPayload {
  providerId: string;
  title: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  photos: string[];
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
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
  async createListing(payload: CreateListingPayload): Promise<Listing> {
    try {
      const response = await axios.post(`${BASE_URL}/listings`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating listing:', error);
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

  // Update a listing
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
}

export default new ListingService();