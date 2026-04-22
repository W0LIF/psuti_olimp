import api from './api';

export interface Category {
  id: number;
  name: string;
  icon: string;
  is_default: boolean;
  user_id: number;
}

export interface CategoryCreate {
  name: string;
  icon: string;
  is_default?: boolean;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories/');
    return response.data;
  },

  async createCategory(data: CategoryCreate): Promise<Category> {
    const response = await api.post('/categories/', data);
    return response.data;
  },

  async updateCategory(id: number, data: Partial<CategoryCreate>): Promise<Category> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
