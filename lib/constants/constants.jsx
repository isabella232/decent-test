import { NETWORK } from '@pooltogether/utilities'

export const SECONDS_PER_BLOCK = 13

export const SECONDS_PER_WEEK = 604800
export const SECONDS_PER_DAY = 86400
export const SECONDS_PER_HOUR = 3600

export const MAX_SAFE_INTEGER = 9007199254740991

export const CHAIN_ID = NETWORK

// cookie names
export const TRANSACTIONS_KEY = 'txs'
export const SHOW_MANAGE_LINKS = 'showManageLinks'
export const MAGIC_EMAIL = 'magicEmail'
export const SELECTED_WALLET_COOKIE_KEY = 'selectedWallet'

const domain = process.env.NEXT_JS_DOMAIN_NAME && `.${process.env.NEXT_JS_DOMAIN_NAME}`
export const COOKIE_OPTIONS = {
  sameSite: 'strict',
  secure: process.env.NEXT_JS_DOMAIN_NAME === 'pooltogether.com',
  domain
}

export const POOLPOOL_SNAPSHOT_URL = 'https://snapshot.org/#/poolpool.pooltogether.eth'
export const POOLTOGETHER_SNAPSHOT_URL = 'https://snapshot.org/#/pooltogether.eth'
export const POOLTOGETHER_GOV_FORUM_URL = 'https://gov.pooltogether.com'
export const DISCORD_INVITE_URL = 'https://pooltogether.com/discord'

export const MAINNET_POOL_ADDRESS = '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e'
export const POLYGON_POOL_ADDRESS = '0x25788a1a171ec66da6502f9975a15b609ff54cf6'

export const BUTTON_MIN_WIDTH = 100
