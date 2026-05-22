import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2800,
          style: {
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.92)',
            color: '#171717',
            boxShadow: '0 16px 50px rgba(17,17,17,0.12)',
            backdropFilter: 'blur(18px)',
          },
        }}
      />
    </QueryClientProvider>
  )
}
