import { Settings } from "luxon";

// Configure the time zone
Settings.defaultZone = 'Etc/GMT0';
enum Mode {
  dev = "development",
  prod = "production",
  test = "test"
}

export interface NetworkInfo {
  name: string;
  chainId: number;
  address: string;
  blockExplorer: string;
  currency?: string;
  rpc?: string;
}

export interface ApiKeys {
  [name: string]: string;
}

export interface DappConfig {
  allowedNetworks: NetworkInfo[];
  apiKeys: ApiKeys;
  address: string;
  mode: "development" | "production" | "test";
}

if (
  !process.env.REACT_APP_CONTRACT_ADDRESS ||
  process.env.REACT_APP_CONTRACT_ADDRESS === ''
) {
  throw new Error('REACT_APP_CONTRACT_ADDRESS must be provided in the ENV');
}

if (
  !process.env.REACT_APP_API_KEY ||
  process.env.REACT_APP_API_KEY === ''
) {
  throw new Error('REACT_APP_API_KEY must be provided in the ENV');
}

const allowedNetworks: NetworkInfo[] = [
  {
    name: 'Ropsten Testnet',
    chainId: 3,
    address: '',
    blockExplorer: 'https://ropsten.etherscan.io',
  },
  {
    name: 'Rinkeby Testnet',
    chainId: 4,
    address: "",
    blockExplorer: 'https://rinkeby.etherscan.io',
  },
  {
    name: 'Arbitrum Rinkeby',
    chainId: 421611,
    address: '',
    blockExplorer: 'https://rinkeby-explorer.arbitrum.io',
  },
  {
    name: 'Sokol Testnet (xDai)',
    chainId: 77,
    address: '',
    blockExplorer: 'https://blockscout.com/poa/sokol',
    currency: 'SPOA'
  },
  {
    name: 'Gnosis Chain (xDai)',
    chainId: 100,
    address: '',
    blockExplorer: 'https://blockscout.com/xdai/mainnet',
    currency: 'XDAI'
  },
];

const config: DappConfig = {
  allowedNetworks,
  mode:process.env.NODE_ENV || Mode.dev,
  apiKeys: {
    backend: process.env.REACT_APP_API_KEY
  },
  address:process.env.REACT_APP_CONTRACT_ADDRESS as string
};

export default config;
