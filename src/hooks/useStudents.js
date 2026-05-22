import { useQuery } from '@tanstack/react-query'
import { studentsApi } from '../api/students'

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await studentsApi.getAll()
      return response.data
    },
  })
}
