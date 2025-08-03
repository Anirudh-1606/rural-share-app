import axios from 'axios';
import { API_BASE_URL } from '../config/api';

<<<<<<< HEAD
const BASE_URL = API_BASE_URL + '/api'  // Replace with actual base URL
=======
const BASE_URL = 'http://localhost:3000/api' // Replace with actual base URL
>>>>>>> 2449c095e3bda9684533562c3edc214fa459dda3

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

interface SubCategory {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface CategoryHierarchy {
  category: Category;
  subCategories: SubCategory[];
}

class CatalogueService {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(`${BASE_URL}/catalogue/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get categories by type
  async getCategoriesByType(type: string): Promise<Category[]> {
    try {
      const response = await axios.get(`${BASE_URL}/catalogue/categories`, {
        params: { category: type }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories by type:', error);
      throw error;
    }
  }

  // Get subcategories for a category
  async getSubCategories(categoryId: string): Promise<SubCategory[]> {
    try {
      const response = await axios.get(
        `${BASE_URL}/catalogue/${categoryId}/subcategories`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  }

  // Get complete category hierarchy
  async getCategoryHierarchy(): Promise<CategoryHierarchy[]> {
    try {
      const response = await axios.get(`${BASE_URL}/catalogue/hierarchy`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category hierarchy:', error);
      throw error;
    }
  }
}

export default new CatalogueService();