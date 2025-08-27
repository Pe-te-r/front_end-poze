// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserData {
  role: string;
  userId: string;
  tokens: {
    access: string;
    refresh: string;
  };
}

interface AuthState {
  data: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginUserState: (loginData: UserData) => void;
  logoutUserState: () => void;
  refreshAccessToken: (newAccessToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set: any, get: any) => ({
      data: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login method
      loginUserState: (loginData: UserData) => {
        set({
          data: loginData,
          isAuthenticated: true,
          error: null,
        });
        
        // Also store tokens in localStorage for easy access
        localStorage.setItem('access_token', loginData.tokens.access);
        localStorage.setItem('refresh_token', loginData.tokens.refresh);
      },

      // Logout method
      logoutUserState: () => {
        set({
          data: null,
          isAuthenticated: false,
          error: null,
        });
        
        // Clear localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      },

      // Refresh access token method
      refreshAccessToken: (newAccessToken: string) => {
        const currentData = get().data;
        if (currentData) {
          set({
            data: {
              ...currentData,
              tokens: {
                ...currentData.tokens,
                access: newAccessToken,
              },
            },
          });
          
          // Update localStorage
          localStorage.setItem('access_token', newAccessToken);
        }
      },

      // Set loading state
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Set error state
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'auth-storage',
      // Only persist the data and authentication state
      partialize: (state: any) => ({
        data: state.data,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);