import { useEffect, useState } from 'react'
import type { IRouter, ISwapState, IToken } from './types'

export interface IUseSwapProps {
  router: IRouter
  defaultTokenIn?: IToken
  defaultTokenOut?: IToken
}

export function useSwap({ router, defaultTokenIn, defaultTokenOut }: IUseSwapProps) {
  const [state, setState] = useState<ISwapState>({
    amountIn: '',
    amountOut: '',
    error: null,
    loading: false,
    tokenIn: defaultTokenIn || null,
    tokenOut: defaultTokenOut || null,
    txHash: null
  })

  const setTokenIn = (token: IToken) => {
    setState((prev) => ({ ...prev, amountOut: '', tokenIn: token }))
  }

  const setTokenOut = (token: IToken) => {
    setState((prev) => ({ ...prev, amountOut: '', tokenOut: token }))
  }

  const setAmountIn = (amount: string) => {
    setState((prev) => ({ ...prev, amountIn: amount }))
  }

  // Debounce quote fetching
  useEffect(() => {
    const fetchQuote = async () => {
      if (!state.tokenIn || !state.tokenOut || !state.amountIn || Number.parseFloat(state.amountIn) === 0) {
        setState((prev) => ({ ...prev, amountOut: '' }))
        return
      }

      setState((prev) => ({ ...prev, error: null, loading: true }))

      try {
        const quote = await router.getQuote(state.amountIn, state.tokenIn, state.tokenOut)
        setState((prev) => ({ ...prev, amountOut: quote.amountOut, loading: false }))
      } catch (err) {
        setState((prev) => ({ ...prev, amountOut: '', error: (err as Error).message, loading: false }))
      }
    }

    const timeoutId = setTimeout(fetchQuote, 500)
    return () => clearTimeout(timeoutId)
  }, [state.amountIn, state.tokenIn, state.tokenOut, router])

  const executeSwap = async (recipient: string) => {
    if (!state.tokenIn || !state.tokenOut || !state.amountIn) return

    setState((prev) => ({ ...prev, error: null, loading: true, txHash: null }))

    try {
      // In a real app, you'd calculate slippage here
      const amountOutMin = state.amountOut
      const result = await router.swap(state.amountIn, amountOutMin, state.tokenIn, state.tokenOut, recipient)
      setState((prev) => ({ ...prev, amountIn: '', amountOut: '', loading: false, txHash: result.txHash }))
    } catch (err) {
      setState((prev) => ({ ...prev, error: (err as Error).message, loading: false }))
    }
  }

  return {
    executeSwap,
    setAmountIn,
    setTokenIn,
    setTokenOut,
    state
  }
}
