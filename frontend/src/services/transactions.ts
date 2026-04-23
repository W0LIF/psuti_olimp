import api from './api';

export interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  comment?: string;
  category_id: number;
  user_id: number;
}

export interface TransactionCreate {
  amount: number;
  type: 'income' | 'expense';
  date: string;
  comment?: string;
  category_id: number;
}

export const transactionService = {
  async createTransaction(data: TransactionCreate): Promise<Transaction> {
    const response = await api.post('/transactions/', data);
    return response.data;
  },

  async getTransactions(params?: {
    start_date?: string;
    end_date?: string;
    category_id?: number;
  }): Promise<Transaction[]> {
    const response = await api.get('/transactions/', { params });
    return response.data;
  },

  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  async getMonthlyTransactions(month: number, year: number): Promise<Transaction[]> {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    return this.getTransactions({ start_date: startDate, end_date: endDate });
  },

  async getPublicTransactions(userId: number, month: number, year: number): Promise<any[]> {
    const response = await api.get(`/transactions/public/${userId}?month=${month}&year=${year}`);
    return response.data;
  },
};
