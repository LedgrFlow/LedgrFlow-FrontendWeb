import axios from "axios";

const API_BASE = "/api"; // Cambia según tu ruta base real

export interface CurrencyConversionResult {
  success: boolean;
  amount: number;
  from_currency: string;
  to_currency: string;
  converted_amount: number;
  rate: number;
  timestamp: string;
  source?: string;
  error?: string;
}

export interface CurrencyRatesResponse {
  success: boolean;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface NewsItem {
  title: string;
  url: string;
  summary?: string;
  source?: string;
  published_at?: string;
}

export interface NewsResponse {
  success: boolean;
  articles: NewsItem[];
}

export interface ServiceStatus {
  success: boolean;
  services: {
    news: boolean;
    currency: boolean;
  };
}

export const BackendNews = {
  // --- CURRENCY SERVICES ---

  getCurrencyRates: async (): Promise<CurrencyRatesResponse> => {
    const response = await axios.get(`${API_BASE}/currency/rates`);
    return response.data;
  },

  convertCurrency: async (
    amount: number,
    from: string,
    to: string
  ): Promise<CurrencyConversionResult> => {
    const response = await axios.get(`${API_BASE}/currency/convert`, {
      params: {
        amount,
        from,
        to,
      },
    });
    return response.data;
  },

  // --- NEWS SERVICES ---

  getNews: async (
    category: "finance" | "technology" | "crypto" | "general" = "finance",
    count = 10
  ): Promise<NewsResponse> => {
    const response = await axios.get(`${API_BASE}/news`, {
      params: { category, count },
    });
    return response.data;
  },

  getFinanceNews: async (count = 10): Promise<NewsResponse> => {
    const response = await axios.get(`${API_BASE}/news/finance`, {
      params: { count },
    });
    return response.data;
  },

  getTechnologyNews: async (count = 10): Promise<NewsResponse> => {
    const response = await axios.get(`${API_BASE}/news/technology`, {
      params: { count },
    });
    return response.data;
  },

  getCryptoNews: async (count = 10): Promise<NewsResponse> => {
    const response = await axios.get(`${API_BASE}/news/crypto`, {
      params: { count },
    });
    return response.data;
  },

  // --- STATUS ---

  getStatus: async (): Promise<ServiceStatus> => {
    const response = await axios.get(`${API_BASE}/news/status`);
    return response.data;
  },
};
