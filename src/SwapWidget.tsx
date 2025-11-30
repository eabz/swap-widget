import type React from 'react'
import { useSwap, type IUseSwapProps } from './useSwap'
import './styles.css'

export interface SwapWidgetProps extends IUseSwapProps {
  title?: string
  width?: string | number
  className?: string
  style?: React.CSSProperties
  onSuccess?: (txHash: string) => void
  // Allow overriding styles via props for flexibility
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
    borderRadius?: string
  }
}

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  title = 'Swap',
  width,
  className = '',
  style = {},
  onSuccess,
  theme,
  ...useSwapProps
}) => {
  const { state, setAmountIn, executeSwap } = useSwap(useSwapProps)

  // Apply theme overrides if provided
  const containerStyle: React.CSSProperties = {
    width,
    ...style,
    ...(theme?.primaryColor ? ({ '--sw-primary-color': theme.primaryColor } as any) : {}),
    ...(theme?.backgroundColor ? ({ '--sw-background-color': theme.backgroundColor } as any) : {}),
    ...(theme?.textColor ? ({ '--sw-text-color': theme.textColor } as any) : {}),
    ...(theme?.borderRadius ? ({ '--sw-border-radius': theme.borderRadius } as any) : {})
  }

  const handleSwap = async () => {
    // For demo purposes, we'll use a dummy recipient
    await executeSwap('0xRecipientAddress')
    if (state.txHash && onSuccess) {
      onSuccess(state.txHash)
    }
  }

  return (
    <div className={`sw-container ${className}`} style={containerStyle}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <div className="sw-input-group">
        <label className="sw-label">From ({state.tokenIn?.symbol || 'Select Token'})</label>
        <input
          type="number"
          className="sw-input"
          placeholder="0.0"
          value={state.amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
        />
      </div>

      <div className="sw-input-group">
        <label className="sw-label">To ({state.tokenOut?.symbol || 'Select Token'})</label>
        <input type="text" className="sw-input" placeholder="0.0" value={state.amountOut} readOnly />
      </div>

      {state.error && <div className="sw-error">{state.error}</div>}

      <div className="sw-info">{state.loading && <span>Fetching quote...</span>}</div>

      <button className="sw-button" onClick={handleSwap} disabled={!state.amountIn || state.loading}>
        {state.loading ? 'Swapping...' : 'Swap'}
      </button>

      {state.txHash && (
        <div style={{ marginTop: 10, color: 'green', fontSize: '0.9em' }}>
          Swap Successful! Tx: {state.txHash.slice(0, 10)}...
        </div>
      )}
    </div>
  )
}
