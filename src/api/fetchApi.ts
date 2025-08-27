// utils/FetchAPI.ts
class FetchAPI {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string = '', defaultHeaders: HeadersInit = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  // Set authentication token
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders = {
        ...this.defaultHeaders,
        'Authorization': `Bearer ${token}`,
      };
    } else {
      // Remove authorization header if token is null
      const { Authorization, ...headers } = this.defaultHeaders as any;
      this.defaultHeaders = headers;
    }
  }

  // Set base URL
  setBaseURL(url: string) {
    this.baseURL = url;
  }

  // Add or update default headers
  setDefaultHeaders(headers: HeadersInit) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };
  }

  // Main request method
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null; status: number }> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const status = response.status;
      let data = null;

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else if (response.status !== 204) { // 204 is No Content
        data = await response.text();
      }

      if (!response.ok) {
        // Handle different error statuses
        let errorMessage = 'Request failed';

        if (data && typeof data === 'object' && 'message' in data) {
          errorMessage = (data as any).message;
        } else if (data && typeof data === 'string') {
          errorMessage = data;
        } else {
          switch (status) {
            case 400:
              errorMessage = 'Bad Request';
              break;
            case 401:
              errorMessage = 'Unauthorized';
              // Clear token if unauthorized
              this.setAuthToken(null);
              localStorage.removeItem('authToken');
              break;
            case 403:
              errorMessage = 'Forbidden';
              break;
            case 404:
              errorMessage = 'Not Found';
              break;
            case 500:
              errorMessage = 'Internal Server Error';
              break;
            default:
              errorMessage = `HTTP Error: ${status}`;
          }
        }

        return { data: null, error: errorMessage, status };
      }

      return { data, error: null, status };
    } catch (error) {
      console.error('Fetch API error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // HTTP method shortcuts
  async get<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, body: any, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: any, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  // File upload method
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ) {
    // Remove Content-Type header for FormData (let browser set it)
    const { 'Content-Type': _, ...headers } = this.defaultHeaders as any;

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers,
    });
  }
}

// Create a singleton instance
export const fetchAPI = new FetchAPI(
  process.env.REACT_APP_API_URL || 'http://localhost:3000'
);

// Initialize with token from localStorage if available
const token = localStorage.getItem('authToken');
if (token) {
  fetchAPI.setAuthToken(token);
}

export default FetchAPI;