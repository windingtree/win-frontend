import '@rainbow-me/rainbowkit/styles.css';
import { AppStateProvider } from './store';
import { AppRoutes } from './Routes';
import { GrommetProvider } from './theme/GrommetProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from './theme/index';
import NotistackProvider from './components/NotistackProvider';
import { GlobalErrorBoundary } from './components/ErrorBoundary';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  ledgerWallet,
  argentWallet,
  braveWallet,
  coinbaseWallet,
  metaMaskWallet,
  omniWallet,
  trustWallet
} from '@rainbow-me/rainbowkit/wallets';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { publicProvider } from 'wagmi/providers/public';
import { allowedNetworks } from './config';

const { chains, provider, webSocketProvider } = configureChains(
  allowedNetworks.map((c) => ({
    id: c.chainId,
    name: c.name,
    network: c.name,
    rpcUrls: {
      default: c.rpc
    }
  })),
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Choose your wallet',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains }),
      walletConnectWallet({ chains }),
      coinbaseWallet({ appName: 'WIN', chains }),
      ledgerWallet({ chains }),
      trustWallet({ chains }),
      rainbowWallet({ chains }),
      argentWallet({ chains }),
      braveWallet({ chains }),
      omniWallet({ chains })
    ]
  }
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
    mutations: {
      retry: 2
    }
  }
});

const App = () => (
  <GlobalErrorBoundary>
    <ThemeProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <NotistackProvider>
            <QueryClientProvider client={queryClient}>
              <AppStateProvider>
                <GrommetProvider>
                  <AppRoutes />
                </GrommetProvider>
              </AppStateProvider>
            </QueryClientProvider>
          </NotistackProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  </GlobalErrorBoundary>
);

export default App;
