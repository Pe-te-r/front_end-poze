import { fetchAPI } from "@/api/fetchApi"
import { UsersResponse } from "@/types/adminTypes"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const userAdminQuery = ()=>{
    return useQuery({
        queryKey: ['admin-users'],
        queryFn: async()=>{
            const {data, error} = await fetchAPI.get<UsersResponse>('/admin/users')
            if(error) throw new Error('Error fetching admin data')
            if(!data) throw new Error('No admin data received')
            return data
        },
        retry: 2,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}

export const changeUserStatusMutation = () => {
    return useMutation<{
        message: string
    }, Error, { userId: string, newStatus: "active" | "suspended" }>({
        mutationKey: ['change-user-status'],
        mutationFn: async({ userId, newStatus })=>{
            const {data, error} = await fetchAPI.patch<{message: string}>(`/admin/users/${userId}/status`, {status: newStatus})
            if(error){
                toast.error(error)
                throw new Error(error)
            }
            if(!data) {
                toast.error('No data received')
                throw new Error('No data received')
            }
            return data
        },
        onSuccess: (data)=>{
            toast.success(data.message)
        },
        onError: (error: Error)=>{
            toast.error(error.message)
        },
        // Invalidate and refetch
        onSettled: ()=>{
            userAdminQuery().refetch()
        }
    })
}