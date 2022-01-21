import { Token } from '@pooltogether/hooks'
import { NO_REFETCH } from 'lib/constants/query'
import { useQueries, UseQueryOptions } from 'react-query'
import { usePrizeDistributors } from './usePrizeDistributors'
import {
  getPrizeDistributorToken,
  PRIZE_DISTRIBUTOR_TOKEN_QUERY_KEY
} from './usePrizeDistributorToken'

export const useAllPrizeDistributorTokens = () => {
  const prizeDistributors = usePrizeDistributors()
  return useQueries<
    UseQueryOptions<{
      prizeDistributorId: string
      token: Token
    }>[]
  >(
    prizeDistributors.map((prizeDistributor) => ({
      ...NO_REFETCH,
      queryKey: [PRIZE_DISTRIBUTOR_TOKEN_QUERY_KEY, prizeDistributor?.id()],
      queryFn: async () => getPrizeDistributorToken(prizeDistributor)
    }))
  )
}
