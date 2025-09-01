import { fetchAPI } from "@/api/fetchApi";
import { useMutation } from "@tanstack/react-query"
import { ErrorResponse } from "./authHook";
import { toast } from "sonner";

interface DepositHookResponse {
    message: string;
    data: null;
}
interface DepositHookVariables {
    transaction_id: string;
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