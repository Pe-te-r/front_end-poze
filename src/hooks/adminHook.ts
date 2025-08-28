import { useQuery } from "@tanstack/react-query"

export const userAdminQuery = ()=>{
    return useQuery({
        queryKey: ['admin'],
        queryFn: async()=>{
            const {data, error} = await fetch<AdminUser[]>('/admin/users')
            if(error) throw new Error('Error fetching admin data')
            if(!data) throw new Error('No admin data received')
            return data
        }
    })
}