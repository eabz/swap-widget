export interface IToken {
  address: string
  symbol: string
  decimals: number
  name?: string
  logoURI?: string
}

export interface IPair {
  tokenA: IToken
  tokenB: IToken
}

export interface IRouter {
  // This is a generic interface that the user's router adapter should implement
  getQuote: (
    amountIn: string,
    tokenIn: IToken,
    tokenOut: IToken
  ) => Promise<{ amountOut: string; priceImpact?: string }>

  swap: (
    amountIn: string,
    amountOutMin: string,
    tokenIn: IToken,
    tokenOut: IToken,
    recipient: string
  ) => Promise<{ txHash: string }>
}

export interface ISwapState {
  tokenIn: IToken | null
  tokenOut: IToken | null
  amountIn: string
  amountOut: string
  loading: boolean
  error: string | null
  txHash: string | null
}
