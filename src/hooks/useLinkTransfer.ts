import { useQuery } from '@tanstack/react-query'
import { usePrex } from '@prex0/prex-react'

export function useLinkTransfer(id: string, secret?: string) {
  const { getLinkTransfer } = usePrex()

  const query = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      const linkTransfer = await getLinkTransfer(id, secret)

      return linkTransfer
    },
    enabled: !!id && !!secret
  })

  return query
}
