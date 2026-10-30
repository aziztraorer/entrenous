/**
 * API Service
 * Axios instance for HTTP requests to backend
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add token
    this.client.interceptors.request.use((config) => {
      const token = sessionStorage.getItem('entre-nous-token') || localStorage.getItem('sessionToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          sessionStorage.removeItem('entre-nous-token')
          // Redirect to home on auth error
          window.location.href = '/'
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  setToken(token: string): void {
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`
    sessionStorage.setItem('entre-nous-token', token)
  }

  clearToken(): void {
    delete this.client.defaults.headers.common.Authorization
    sessionStorage.removeItem('entre-nous-token')
  }
}

export const apiService = new ApiService()
