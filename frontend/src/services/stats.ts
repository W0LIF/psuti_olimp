import api from './api';

export interface DashboardStats {
  balance: number;
  total_income: number;
  total_expense: number;
  category_breakdown: Array<{
    category: string;
    icon: string;
    amount: number;
  }>;
}

export interface CategoryExpense {
  category: string;
  icon: string;
  amount: number;
}

export const statsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/stats/dashboard');
    return response.data;
  },

  async getMonthlyStats(month: number, year: number): Promise<DashboardStats> {
    const response = await api.get('/stats/monthly', {
      params: { month, year },
    });
    return response.data;
  },

  async getCategoryStats(): Promise<CategoryExpense[]> {
    const response = await api.get('/stats/categories');
    return response.data;
  },
};
