import { Amount } from '@pooltogether/hooks'
import { numberWithCommas } from '@pooltogether/utilities'
import { ethers } from 'ethers'

const EMPTY_AMOUNT: Amount = {
  amount: '',
  amountUnformatted: undefined,
  amountPretty: ''
}

/**
 *
 * @param amount formatted amount
 * @param decimals
 * @returns
 */
export const getAmountFromString = (amount: string, decimals: string): Amount => {
  try {
    if (!amount || amount === undefined) {
      return EMPTY_AMOUNT
    }

    return {
      amount,
      amountUnformatted: ethers.utils.parseUnits(amount, decimals),
      amountPretty: numberWithCommas(amount) as string
    }
  } catch (e) {
    return EMPTY_AMOUNT
  }
}
