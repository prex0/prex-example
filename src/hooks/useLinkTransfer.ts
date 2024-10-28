import { useQuery } from '@tanstack/react-query'
import { usePrex } from '@prex0/prex-react'

export function useLinkTransfer(id: string) {
  const { getLinkTransfer } = usePrex()

  const query = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      const linkTransfer = await getLinkTransfer(id)

      return linkTransfer
    },
    enabled: !!id
  })

  return query
}
