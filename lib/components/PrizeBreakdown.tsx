import React from 'react'
import classnames from 'classnames'
import { Token } from '@pooltogether/hooks'
import {
  calculateNumberOfPrizesForIndex,
  calculatePrizeForDistributionIndex,
  PrizeTier
} from '@pooltogether/v4-js-client'
import { useTranslation } from 'react-i18next'

import { roundPrizeAmount } from 'lib/utils/roundPrizeAmount'

interface PrizeBreakdownProps {
  prizeTier: PrizeTier
  ticket: Token
  className?: string
  isFetched?: boolean
}

// TODO: Convert values into nice ones
export const PrizeBreakdown = (props: PrizeBreakdownProps) => {
  const { prizeTier, className, ticket, isFetched } = props
  const { tiers } = prizeTier
  const { t } = useTranslation()

  return (
    <div className={classnames('flex flex-col max-w-md text-center', className)}>
      <div className='flex justify-between space-x-2 sm:space-x-4'>
        <PrizeTableHeader>{t('amount')}</PrizeTableHeader>
        <PrizeTableHeader>{t('projectedPrizes', 'Prizes (Projected)')}</PrizeTableHeader>
      </div>
      <div className='flex flex-col space-y-2'>
        {!isFetched ? (
          Array.from(Array(3)).map((_, i) => <LoadingPrizeRow key={`loading-row-${i}`} />)
        ) : (
          <>
            {tiers.map((_, i) => (
              <PrizeBreakdownTableRow
                key={`distribution_row_${i}`}
                index={i}
                prizeTier={prizeTier}
                ticket={ticket}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

PrizeBreakdown.defaultProps = {
  isFetched: true
}

const LoadingPrizeRow = () => <div className='h-8 rounded-lg w-full bg-body animate-pulse' />

const PrizeTableHeader = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => (
  <div
    {...props}
    className={classnames(
      'font-inter text-xxs uppercase font-semibold text-inverse mt-8 mb-2 opacity-60 w-full',
      props.className
    )}
  />
)

interface PrizeBreakdownTableRowProps {
  prizeTier: PrizeTier
  index: number
  ticket: Token
}

// Calculate prize w draw settings
const PrizeBreakdownTableRow = (props: PrizeBreakdownTableRowProps) => {
  const { index, prizeTier, ticket } = props

  const prizeForDistributionUnformatted = calculatePrizeForDistributionIndex(index, prizeTier)
  const numberOfWinners = calculateNumberOfPrizesForIndex(prizeTier.bitRangeSize, index)

  // Hide rows that don't have a prize
  if (prizeForDistributionUnformatted.isZero()) {
    return null
  }

  const amountPretty = roundPrizeAmount(
    prizeForDistributionUnformatted,
    ticket.decimals
  ).amountPretty

  return (
    <div className='flex flex-row justify-between space-x-2 sm:space-x-4'>
      <PrizeTableCell index={index}>${amountPretty}</PrizeTableCell>
      <PrizeTableCell index={index}>{numberOfWinners}</PrizeTableCell>
    </div>
  )
}

interface PrizeTableCellProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  index: number
}

const PrizeTableCell = (props: PrizeTableCellProps) => (
  <div
    {...props}
    className={classnames(props.className, 'font-inter text-sm xs:text-lg capitalize my-1 w-full', {
      'text-flashy font-bold': props.index === 0,
      'opacity-70 text-inverse font-semibold': props.index !== 0
    })}
  />
)
