import { Dashboard } from '@/components/DashboardCustomer';
import { useAuthStore } from '@/store/authStore';
import { createFileRoute } from '@tanstack/react-router'



export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {data} = useAuthStore()
  return <Dashboard dashboardId={data?.userId ?? ''} />;
}
