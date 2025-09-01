import { fetchAPI } from "@/api/fetchApi";
import { useMutation, useQuery } from "@tanstack/react-query"
import { ErrorResponse } from "./authHook";
import { toast } from "sonner";

interface DepositHookResponse {
    message: string;
    data: null;
}
interface DepositHookVariables {
    reference: string;
    userId: string;
}

export const depositHook = () => {
    return useMutation<DepositHookResponse, ErrorResponse, DepositHookVariables>({
        mutationFn: async (variables: DepositHookVariables) => {
            const { data, error, status } = await fetchAPI.post<DepositHookResponse>(
                '/transactions/deposit', 
                variables
            );

            console.log('data from deposit', data, error, status);

            if (error) {
                toast.error(error);
                return Promise.reject(new Error(error));
            }

            if (!data) {
                const noDataError = 'No data received from deposit';
                toast.error(noDataError);
                return Promise.reject(new Error(noDataError));
            }

            return data;
        },
        onSuccess: (data) => {
            console.log('deposit success data', data);
            toast.success(data.message);
            // Add any success navigation or other logic here
        },
        onError: (error) => {
            console.error('Deposit failed:', error);
            toast.error(error.message || 'Deposit failed');
        }
    });
}

export const useDepositQuery = (options?: { status?: string }) => {
    // Set default status to 'pending' if not provided
    const status = options?.status || 'pending';
    
    return useQuery({
        queryKey: ['deposit', status], // Include status in query key for proper caching
        queryFn: async () => {
            const url = status ? `/transactions/deposit?status=${status}` : '/transactions/deposit';

            const { data, error } = await fetchAPI.get<DepositHookResponse>(url);

            if (error) {
                return Promise.reject(new Error(error));
            }

            if (!data) {
                return Promise.reject(new Error('No data received from deposit query'));
            }

            return data;
        },
        enabled: false, // Keep it disabled by default if that's your requirement
    });
};