import { useQuery } from '@tanstack/react-query'
import { menuApi } from '../api/menu'

export function useMenuItems(activeOnly = true) {
  return useQuery({
    queryKey: ['menu-items', activeOnly],
    queryFn: async () => {
      const response = await menuApi.getAll(activeOnly)
      return response.data
    },
  })
}
