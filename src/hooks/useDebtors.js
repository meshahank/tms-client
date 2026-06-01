import { useQuery } from '@tanstack/react-query'
import { studentsApi } from '../api/students'

export function useDebtors() {
  return useQuery({
    queryKey: ['debtors'],
    queryFn: async () => {
      const response = await studentsApi.getDebtors()
      return response.data
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
