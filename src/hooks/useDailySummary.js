import { useQuery } from '@tanstack/react-query'
import { salesApi } from '../api/sales'

export function useDailySummary() {
  return useQuery({
    queryKey: ['daily-summary'],
    queryFn: async () => {
      const response = await salesApi.getDailySummary()
      return response.data
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  })
}
