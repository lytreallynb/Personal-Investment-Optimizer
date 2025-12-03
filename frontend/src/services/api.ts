import axios, { AxiosInstance } from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  BudgetProfile,
  OptimizationRequest,
  OptimizationResponse,
  ScenarioRequest,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 errors (unauthorized)
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<User> {
    const response = await this.client.post<User>('/api/auth/register', data);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/login', credentials);
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/api/auth/me');
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }

  // Budget endpoints
  async createOrUpdateBudgetProfile(profile: BudgetProfile): Promise<BudgetProfile> {
    const response = await this.client.post<BudgetProfile>('/api/budget/', profile);
    return response.data;
  }

  async getBudgetProfile(): Promise<BudgetProfile> {
    const response = await this.client.get<BudgetProfile>('/api/budget/');
    return response.data;
  }

  async getOptimizationHistory(): Promise<OptimizationResponse[]> {
    const response = await this.client.get<any[]>('/api/budget/history');
    return response.data.map(item => item.result_json);
  }

  // Optimization endpoints
  async runOptimization(request: OptimizationRequest): Promise<OptimizationResponse> {
    const response = await this.client.post<OptimizationResponse>('/api/optimize/', request);
    return response.data;
  }

  async runScenarioAnalysis(request: ScenarioRequest): Promise<OptimizationResponse> {
    const response = await this.client.post<OptimizationResponse>('/api/optimize/scenario', request);
    return response.data;
  }

  async getRecommendations(): Promise<string[]> {
    const response = await this.client.get<string[]>('/api/optimize/recommendations');
    return response.data;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export const apiService = new ApiService();
