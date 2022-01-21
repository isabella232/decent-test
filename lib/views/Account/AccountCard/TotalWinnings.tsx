import { BottomSheet, snapTo90 } from 'lib/components/BottomSheet'
import FeatherIcon from 'feather-icons-react'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useUsersTotalClaimedAmount } from 'lib/hooks/v4/PrizeDistributor/useUsersTotalClaimedAmount'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { CountUp } from 'lib/components/CountUp'
import { ThemedClipSpinner, TokenIcon } from '@pooltogether/react-components'
import TrophyIcon from 'assets/images/pooltogether-trophy--detailed.svg'
import { Amount, Token } from '@pooltogether/hooks'
import { useAllUsersPositiveClaimedAmountsWithDraws } from 'lib/hooks/v4/PrizeDistributor/useAllUsersPositiveClaimedAmountsWithDraws'
import { Draw } from '@pooltogether/v4-js-client'
import { getTimestampString } from 'lib/utils/getTimestampString'

export const TotalWinnings = () => {
  const [isOpen, setIsOpen] = useState(false)
  const usersAddress = useUsersAddress()
  const { data: totalClaimedAmount, isFetched } = useUsersTotalClaimedAmount(usersAddress)
  const { t } = useTranslation()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='px-2 py-4 xs:px-4 bg-white bg-opacity-20 dark:bg-actually-black dark:bg-opacity-10 rounded-lg flex justify-between font-bold text-inverse'
      >
        <span>
          {'🎉 '}
          {t('totalClaimedWinningsExclamation', 'Total claimed winnings!')}
        </span>
        <div className='flex'>
          <span className='relative rounded-full bg-white bg-opacity-20 dark:bg-actually-black dark:bg-opacity-10 px-3'>
            {!isFetched ? (
              <ThemedClipSpinner sizeClassName='w-3 h-3' className='mx-auto' />
            ) : (
              <>
                $<CountUp countTo={isFetched ? Number(totalClaimedAmount.amount) : 0} />
              </>
            )}
          </span>
          <FeatherIcon icon='chevron-right' className='w-6 h-6 opacity-50 my-auto ml-1' />
        </div>
      </button>
      <TotalWinningsSheet
        totalClaimedAmount={totalClaimedAmount}
        open={isOpen}
        onDismiss={() => setIsOpen(false)}
      />
    </>
  )
}

interface TotalWinningsSheetProps {
  totalClaimedAmount: Amount
  open: boolean
  onDismiss: () => void
}

const TotalWinningsSheet = (props: TotalWinningsSheetProps) => {
  const { open, onDismiss, totalClaimedAmount } = props
  const { t } = useTranslation()

  return (
    <BottomSheet open={open} onDismiss={onDismiss} className='flex flex-col space-y-8'>
      <div className='flex items-center mx-auto'>
        <img src={TrophyIcon} className='mr-2' style={{ width: '38px' }} />
        <div className='flex flex-col leading-none'>
          <span className='font-bold text-xl mb-1'>
            ${totalClaimedAmount?.amountPretty || '--'}
          </span>
          <span className='uppercase opacity-50 font-semibold text-xxs'>{t('totalWinnings')}</span>
        </div>
      </div>
      <PrizesClaimedList />
      <NumberOfPrizesDisclaimer />
    </BottomSheet>
  )
}

interface PrizesClaimedListProps {}

const PrizesClaimedList = (props: PrizesClaimedListProps) => {
  const usersAddress = useUsersAddress()
  const { data, isFetched } = useAllUsersPositiveClaimedAmountsWithDraws(usersAddress)
  const { t } = useTranslation()

  let listItems: React.ReactNode = [
    <LoadingRow key={'loadingrow1'} />,
    <LoadingRow key={'loadingrow2'} />,
    <LoadingRow key={'loadingrow3'} />
  ]
  if (isFetched) {
    if (data.length === 0) {
      return <EmptyState />
    } else {
      listItems = data.map((data) => (
        <ClaimedPrizeItem key={`${data.prizeDistributorId}-${data.drawId}`} {...data} />
      ))
    }
  }

  return (
    <ul className='space-y-3 bg-actually-black bg-opacity-10 dark:bg-white dark:bg-opacity-5 p-4 rounded-lg max-h-80 overflow-y-auto'>
      <div className='grid grid-cols-3 xs:grid-cols-4 opacity-50 font-bold'>
        <div className='xs:col-span-2'>{t('prizeAmountString', 'Prize amount')}</div>
        <div className='text-right'>{t('draw')}</div>
        <div className='text-right'>{t('date', 'Date')}</div>
      </div>
      {listItems}
    </ul>
  )
}

const ClaimedPrizeItem = (props: {
  token: Token
  prizeDistributorId: string
  chainId: number
  drawId: number
  claimedAmount: Amount
  draw: Draw
}) => {
  const { token, prizeDistributorId, chainId, drawId, claimedAmount, draw } = props

  return (
    <li className='grid grid-cols-3 xs:grid-cols-4'>
      <div className='flex items-center xs:col-span-2'>
        <TokenIcon className=' mr-2' chainId={chainId} address={token.address} />
        <span className='font-bold mr-1'>{claimedAmount.amountPretty}</span>
        <span className='text-xxxxs opacity-50'>{token.symbol}</span>
      </div>
      <div className='text-right'>#{drawId}</div>
      <div className='text-right'>
        {getTimestampString(draw.beaconPeriodStartedAt.toNumber() + draw.beaconPeriodSeconds, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </div>
    </li>
  )
}

const LoadingRow = () => (
  <div className='rounded-lg bg-actually-black bg-opacity-20 dark:bg-white dark:bg-opacity-10 animate-pulse w-full h-10' />
)

const EmptyState = () => {
  const { t } = useTranslation()
  return (
    <div className='rounded-lg bg-actually-black bg-opacity-5 dark:bg-white dark:bg-opacity-5 p-4 flex flex-col text-center'>
      <span className='font-bold opacity-70'>{t('noPrizesYet', 'No prizes... Yet.')}</span>
      <span className='text-9xl'>🤞</span>
    </div>
  )
}

const NumberOfPrizesDisclaimer = () => {
  return (
    <span className='text-xxs text-center opacity-50 px-6'>
      <Trans
        i18nKey='claimedPrizesDisclaimer'
        components={{
          a: (
            <a
              className='underline text-xxs hover:opacity-100'
              href='https://v4.docs.pooltogether.com/protocol/reference/smart-contracts#draw-beacon--draw-buffer'
            ></a>
          )
        }}
      />
    </span>
  )
}
