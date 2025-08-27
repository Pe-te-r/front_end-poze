// hooks/useAuthFetch.ts
import { fetchAPI } from '@/api/fetchApi';
import {toast} from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';

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

interface ApiMessage{
  message:string;
  data:null;
}

interface AuthResponseLogin {
  status: 'success' | 'error';
  message: string;
  data?: {
   role: string;
   userId:string;
    tokens: {
      access: string;
      refresh: string;
    };
  }
}


interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Login mutation using FetchAPI
export const useLogin = () => {
  const navigate = useNavigate()
  const {loginUserState} = useAuthStore()

  return useMutation<AuthResponseLogin, ErrorResponse, LoginData>({
    mutationFn: async (loginData: LoginData) => {
      // Clean phone number (remove spaces and + sign for API)
      const cleanedPhone = loginData.phone.replace(/\s+/g, '').replace('+', '');
      
      const { data, error } = await fetchAPI.post<AuthResponseLogin>('/auth/login', {
        ...loginData,
        phone: cleanedPhone,
      });

      if (error) {
        toast.error(error);
        return Promise.reject(new Error(error));
      }

      if (!data) {
        const noDataError = 'No data received';
        toast.error(noDataError);
        return Promise.reject(new Error(noDataError));
      }

      return data;
    },
    onSuccess: (data) => {
        console.log('data from login',data.data?.role)
      // Store token in localStorage
      if(data.data)loginUserState({role: data.data.role,userId:data.data.userId,tokens:data.data?.tokens})
      toast.success(data.message);
      navigate({to:'/dashboard'});

      // Update auth token in fetchAPI instance
      fetchAPI.setAuthToken(data.data?.tokens?.access || '');
      
    },
  });
};

// Register mutation using FetchAPI
export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation<ApiMessage, ErrorResponse, RegisterData>({
    mutationFn: async (registerData: RegisterData) => {
      // Clean phone number (remove spaces and + sign for API)
      const cleanedPhone = registerData.phone.replace(/\s+/g, '').replace('+', '');
      
      const { data, error, status } = await fetchAPI.post<ApiMessage>('/auth/register', {
        ...registerData,
        phone: cleanedPhone,
      });
      console.log('data from register',data,error,status)

      if (error) {
        toast.error(error);
        return Promise.reject(new Error(error));
      }

      if (!data) {
        const noDataError = 'No data received';
        toast.error(noDataError);
        return Promise.reject(new Error(noDataError));
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('data',data)
      toast.success(data.message)
      navigate({to:'/Login'})
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