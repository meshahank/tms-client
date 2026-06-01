import { useQuery } from '@tanstack/react-query'
import { salesApi } from '../api/sales'

export function useItemAnalytics(range = 'week') {
  return useQuery({
    queryKey: ['item-analytics', range],
    queryFn: async () => {
      const response = await salesApi.getItemAnalytics(range)
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
