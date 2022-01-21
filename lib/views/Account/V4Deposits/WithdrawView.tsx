import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Overrides } from 'ethers'
import { Amount, Transaction } from '@pooltogether/hooks'
import { useState } from 'react'

import { useIsWalletOnNetwork } from 'lib/hooks/useIsWalletOnNetwork'
import { ModalNetworkGate } from 'lib/components/Modal/ModalNetworkGate'
import { ModalTitle } from 'lib/components/Modal/ModalTitle'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useSelectedChainIdUser } from 'lib/hooks/v4/User/useSelectedChainIdUser'
import { ModalTransactionSubmitted } from 'lib/components/Modal/ModalTransactionSubmitted'
import { WithdrawStepContent } from './WithdrawStepContent'
import { DepositItemsProps } from '.'

export enum WithdrawalSteps {
  input,
  review,
  viewTxReceipt
}

interface WithdrawViewProps extends DepositItemsProps {
  withdrawTx: Transaction
  setWithdrawTxId: (txId: number) => void
  onDismiss: () => void
}

export const WithdrawView = (props: WithdrawViewProps) => {
  const { prizePool, balances, withdrawTx, setWithdrawTxId, onDismiss, refetchBalances } = props
  const { t } = useTranslation()
  const { token } = balances

  const [amountToWithdraw, setAmountToWithdraw] = useState<Amount>()
  const [currentStep, setCurrentStep] = useState<WithdrawalSteps>(WithdrawalSteps.input)
  const user = useSelectedChainIdUser()
  const sendTx = useSendTransaction()
  const isWalletOnProperNetwork = useIsWalletOnNetwork(prizePool.chainId)
  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange'
  })

  const sendWithdrawTx = async (e) => {
    e.preventDefault()

    const tokenSymbol = token.symbol
    const overrides: Overrides = { gasLimit: 750000 }

    const txId = await sendTx({
      name: `${t('withdraw')} ${amountToWithdraw?.amountPretty} ${tokenSymbol}`,
      method: 'withdrawInstantlyFrom',
      callTransaction: () => user.withdraw(amountToWithdraw?.amountUnformatted, overrides),
      callbacks: {
        onSent: () => setCurrentStep(WithdrawalSteps.viewTxReceipt),
        refetch: () => {
          refetchBalances()
        }
      }
    })
    setWithdrawTxId(txId)
  }

  if (!isWalletOnProperNetwork) {
    return (
      <>
        <ModalTitle chainId={prizePool.chainId} title={t('wrongNetwork', 'Wrong network')} />
        <ModalNetworkGate chainId={prizePool.chainId} className='mt-8' />
      </>
    )
  }

  if (currentStep === WithdrawalSteps.viewTxReceipt) {
    return (
      <>
        <ModalTitle
          chainId={prizePool.chainId}
          title={t('withdrawalSubmitted', 'Withdrawal submitted')}
        />
        <ModalTransactionSubmitted
          className='mt-8'
          chainId={prizePool.chainId}
          tx={withdrawTx}
          closeModal={onDismiss}
          hideCloseButton
        />
      </>
    )
  }

  return (
    <>
      <ModalTitle
        chainId={prizePool.chainId}
        title={t('withdrawTicker', { ticker: token.symbol })}
      />
      <WithdrawStepContent
        form={form}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        user={user}
        prizePool={prizePool}
        usersBalances={balances}
        refetchBalances={refetchBalances}
        amountToWithdraw={amountToWithdraw}
        setAmountToWithdraw={setAmountToWithdraw}
        withdrawTx={withdrawTx}
        setWithdrawTxId={setWithdrawTxId}
        sendWithdrawTx={sendWithdrawTx}
      />
    </>
  )
}
