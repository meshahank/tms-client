import { useQuery } from '@tanstack/react-query'
import { studentsApi } from '../api/students'

export function useClassStudents(classCode) {
  return useQuery({
    queryKey: ['class-students', classCode],
    queryFn: async () => {
      const response = await studentsApi.getByClass(classCode)
      return response.data
    },
    enabled: Boolean(classCode),
  })
}
