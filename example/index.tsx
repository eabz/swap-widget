import { createRoot } from 'react-dom/client';
import { SwapWidget, IToken, IRouter } from '../src';

// Mock Data
const ETH: IToken = { address: '0x...', symbol: 'ETH', decimals: 18, name: 'Ether' };
const USDC: IToken = { address: '0x...', symbol: 'USDC', decimals: 6, name: 'USD Coin' };

const mockRouter: IRouter = {
    getQuote: async (amountIn, tokenIn, tokenOut) => {
        console.log(`Getting quote for ${amountIn} ${tokenIn.symbol} to ${tokenOut.symbol}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
        return {
            amountOut: (parseFloat(amountIn) * 1800).toString(), // Mock price
            priceImpact: '0.1%',
        };
    },
    swap: async (amountIn, amountOutMin, tokenIn, tokenOut, recipient) => {
        console.log(`Swapping ${amountIn} ${tokenIn.symbol} for ${tokenOut.symbol}`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate tx delay
        return { txHash: '0x1234567890abcdef' };
    },
};

const App = () => {
    return (
        <div style={{ padding: 50, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h1>Swap Widget Demo</h1>

            {/* Default Theme */}
            <SwapWidget
                router={mockRouter}
                defaultTokenIn={ETH}
                defaultTokenOut={USDC}
                title="Default Theme"
            />

            {/* Dark Theme */}
            <SwapWidget
                router={mockRouter}
                defaultTokenIn={ETH}
                defaultTokenOut={USDC}
                title="Dark Theme"
                theme={{
                    primaryColor: '#bb86fc',
                    backgroundColor: '#121212',
                    textColor: '#ffffff',
                    borderRadius: '20px',
                }}
            />
        </div>
    );
};

// Mount the app
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
