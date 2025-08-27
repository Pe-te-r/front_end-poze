import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import Header from '../components/Header'


import appCss from '../styles.css?url'
import { ThemeProvider } from '@/utility/ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeAwareToaster } from '@/components/ThemeToaster'

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
    <ThemeAwareToaster/>
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
