import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import Header from '../components/Header'
import { Toaster } from 'sonner'


import appCss from '../styles.css?url'
import { ThemeProvider, useTheme } from '@/utility/ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const {isDark} = useTheme();
  const theme = isDark ? 'dark' : 'light';
  const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider> 

    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
    <Toaster
              theme={theme}
              position="top-right"
              richColors 
              closeButton
            />
        <Header />
        {children}
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
    </ThemeProvider>
    </QueryClientProvider>
  )
}
