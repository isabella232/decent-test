import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { useTranslation } from 'react-i18next'
import { Amount } from '@pooltogether/hooks'

import { CHAIN_ID } from 'lib/constants/constants'
import { BigNumber } from 'ethers'

const MINIMUM_AMOUNTS = {
  [CHAIN_ID.mainnet]: 5000,
  [CHAIN_ID.rinkeby]: 5000
}

export const DepositLowAmountWarning = (props: { chainId: number; amountToDeposit: Amount }) => {
  const { chainId, amountToDeposit } = props

  const { t } = useTranslation()

  const minimumAmount = MINIMUM_AMOUNTS[chainId]

  if (!minimumAmount || Number(amountToDeposit.amount) > minimumAmount) return null

  return (
    <div className='bg-pt-red bg-opacity-50 dark:bg-opacity-80 p-4 rounded flex space-x-4'>
      <div className='flex items-center px-2'>
        <FeatherIcon icon='alert-triangle' className='w-6 h-6' />
      </div>
      <span>
        {t(
          'smallDepositNotRecommendedTryADifferentChain',
          `A deposit of this size is not recommended due to the network's gas fees. Try a different blockchain for lower gas fees.`
        )}
      </span>
    </div>
  )
}
