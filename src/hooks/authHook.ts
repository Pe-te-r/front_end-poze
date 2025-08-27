// hooks/useAuthFetch.ts
import { fetchAPI } from '@/api/fetchApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
interface LoginData {
  phone: string;
  password: string;
}

interface RegisterData {
  first_name: string;
  phone: string;
  password: string;
  invitation_code?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    first_name: string;
    phone: string;
  };
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Login mutation using FetchAPI
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ErrorResponse, LoginData>({
    mutationFn: async (loginData: LoginData) => {
      // Clean phone number (remove spaces and + sign for API)
      const cleanedPhone = loginData.phone.replace(/\s+/g, '').replace('+', '');
      
      const { data, error, status } = await fetchAPI.post<AuthResponse>('/auth/login', {
        ...loginData,
        phone: cleanedPhone,
      });

      if (error) {
        throw new Error(error);
      }

      if (!data) {
        throw new Error('No data received');
      }

      return data;
    },
    onSuccess: (data) => {
        console.log('data from login',data)
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      
      // Update auth token in fetchAPI instance
      fetchAPI.setAuthToken(data.token);
      
      // Update auth state in query client
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

// Register mutation using FetchAPI
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ErrorResponse, RegisterData>({
    mutationFn: async (registerData: RegisterData) => {
      // Clean phone number (remove spaces and + sign for API)
      const cleanedPhone = registerData.phone.replace(/\s+/g, '').replace('+', '');
      
      const { data, error, status } = await fetchAPI.post<AuthResponse>('/auth/register', {
        ...registerData,
        phone: cleanedPhone,
      });

      if (error) {
        throw new Error(error);
      }

      if (!data) {
        throw new Error('No data received');
      }

      return data;
    },
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      
      // Update auth token in fetchAPI instance
      fetchAPI.setAuthToken(data.token);
      
      // Update auth state in query client
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

// Get current user using FetchAPI
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const { data, error } = await fetchAPI.get('/auth/me');
      
      if (error) {
        throw new Error(error);
      }

      return data;
    },
    retry: false,
    enabled: !!localStorage.getItem('authToken'),
  });
};

// Logout function
export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('authToken');
    fetchAPI.setAuthToken(null);
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.clear();
  };
};