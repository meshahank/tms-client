import { useQuery } from '@tanstack/react-query'
import { studentsApi } from '../api/students'

export function useStudentLookup(admNo, enabled = true) {
  return useQuery({
    queryKey: ['student-lookup', admNo],
    queryFn: async () => {
      const response = await studentsApi.lookup(admNo)
      return response.data
    },
    enabled: Boolean(admNo?.trim()) && enabled,
  })
}
