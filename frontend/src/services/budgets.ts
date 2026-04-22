import api from './api';

export interface Budget {
  id: number;
  month: number;
  year: number;
  category_id?: number;
  limit_amount: number;
  user_id: number;
}

export interface BudgetCreate {
  month: number;
  year: number;
  category_id?: number;
  limit_amount: number;
}

export interface BudgetProgress {
  budget_id: number;
  category_id?: number;
  limit: number;
  spent: number;
  percent: number;
  status: 'ok' | 'warning' | 'exceeded';
}

export const budgetService = {
  async createBudget(data: BudgetCreate): Promise<Budget> {
    const response = await api.post('/budgets/', data);
    return response.data;
  },

  async getBudgetProgress(): Promise<BudgetProgress[]> {
    const response = await api.get('/budgets/progress');
    return response.data;
  },

  async updateBudget(id: number, data: Partial<BudgetCreate>): Promise<Budget> {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  async deleteBudget(id: number): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};
