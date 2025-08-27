// components/ThemeAwareToaster.tsx
import { Toaster } from 'sonner';
import { useTheme } from '@/utility/ThemeProvider';

export function ThemeAwareToaster() {
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'light';
  
  return (
    <Toaster
      theme={theme}
      position="top-right"
      richColors 
      closeButton
    />
  );
}