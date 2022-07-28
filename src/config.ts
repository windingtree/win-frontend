import { Settings } from 'luxon';

// Configure the time zone
Settings.defaultZone = 'Etc/GMT0';
export enum AppMode {
  dev = 'development',
  prod = 'production',
  test = 'test'
}

export interface CryptoAsset {
  name: string;
  address: string;
  wrapped: boolean;
  permit: boolean;
}

export interface NetworkInfo {
  name: string;
  chainId: number;
  contracts: {
    ledger: string,
    winPay: string,
    assets: CryptoAsset[]
  };
  blockExplorer: string;
  currency: string;
  decimals: number;
  rpc: string;
}

export interface Api {
  key: string;
  url: string;
}

if (!process.env.REACT_APP_API_KEY || process.env.REACT_APP_API_KEY === '') {
  throw new Error('REACT_APP_API_KEY must be provided in the ENV');
}

if (!process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL === '') {
  throw new Error('REACT_APP_API_URL must be provided in the ENV');
}

export const allowedNetworks: readonly NetworkInfo[] = Object.freeze([
  {
    name: 'Localhost',
    chainId: 31337,
    rpc: 'http://127.0.0.1:8545',
    contracts: {
      ledger: '0x0062bCFd8ED3Ac59639Ae4A5D38B81491CCb83Bd',
      winPay: '0x3C00738B2eEe7663C273f9A0d945FED411483d45',
      assets: [
        {
          name: 'native XDAI',
          address: '0xFca9C0F6ecF47FE8923ba42F310ef0a11D2bFd1D',
          wrapped: true,
          permit: false
        },
        {
          name: 'wrapped XDAI',
          address: '0xFca9C0F6ecF47FE8923ba42F310ef0a11D2bFd1D',
          wrapped: true,
          permit: true
        },
        {
          name: 'USDC',
          address: '0x6C6E555AA2b879AEE6DFdbBd0cdf5435fd0fb5af',
          wrapped: true,
          permit: false
        }
      ]
    },
    blockExplorer: '',
    currency: 'XDAI',
    decimals: 18
  },
  {
    name: 'Sokol Testnet',
    chainId: 77,
    rpc: 'https://sokol.poa.network',
    contracts: {
      ledger: '0x3196f354b7a95413E30889D1C6cE5074b10c43f5',
      winPay: '0x6f2fBD652A99Db4b8143c8383Ae39b5459268685',
      assets: [
        {
          name: 'native XDAI',
          address: '0x25149dE5afe2043C61687AD136527d2167EFC241',
          wrapped: true,
          permit: false
        },
        {
          name: 'wrapped XDAI',
          address: '0x25149dE5afe2043C61687AD136527d2167EFC241',
          wrapped: true,
          permit: true
        },
        {
          name: 'USDC',
          address: '0x1C375919362730AC69c5ACffeC775F11c9b75cF2',
          wrapped: true,
          permit: false
        }
      ]
    },
    blockExplorer: 'https://blockscout.com/poa/sokol',
    currency: 'XDAI',
    decimals: 18
  },
]);

export const mode = process.env.NODE_ENV || AppMode.dev;

export const backend = Object.freeze({
  key: process.env.REACT_APP_API_KEY,
  url: process.env.REACT_APP_API_URL
});
