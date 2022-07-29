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
  symbol: string;
  address: string;
  decimals: number;
  image: string;
  native: boolean;
  permit: boolean;
}

export interface Network {
  name: string;
  chainId: number;
}

export interface NetworkInfo extends Network {
  currency: string;
  decimals: number;
  rpc: string;
  contracts: {
    ledger: string,
    winPay: string,
    assets: CryptoAsset[]
  };
  blockExplorer: string;
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
    blockExplorer: '',
    currency: 'xDAI',
    decimals: 18,
    contracts: {
      ledger: '0x0062bCFd8ED3Ac59639Ae4A5D38B81491CCb83Bd',
      winPay: '0x3C00738B2eEe7663C273f9A0d945FED411483d45',
      assets: [
        {
          name: 'Native xDAI',
          symbol: 'xDAI',
          address: '0xFca9C0F6ecF47FE8923ba42F310ef0a11D2bFd1D',
          decimals: 18,
          image: 'https://bafybeiesj7lzhl7gb3xnnazkozdh6cdsby2nmgphqc6ts6rnlf4mnczzbm.ipfs.dweb.link/8635.png',
          native: true,
          permit: false
        },
        {
          name: 'Wrapped xDAI',
          symbol: 'wxDAI',
          address: '0xFca9C0F6ecF47FE8923ba42F310ef0a11D2bFd1D',
          decimals: 18,
          image: 'https://bafybeicj27bao6jkip26yhvc32tcyror5asop6dfxk3db67yfkxc6me6ym.ipfs.dweb.link/9021.png',
          native: false,
          permit: true
        },
        {
          name: 'USDC',
          symbol: 'USDC',
          address: '0x6C6E555AA2b879AEE6DFdbBd0cdf5435fd0fb5af',
          decimals: 18,
          image: 'https://bafybeif5mtgb4mtvvqbhw2kdr4uruu5xm742vtwa3cwndpnsqdb2t4676m.ipfs.dweb.link/3408.png',
          native: false,
          permit: true
        }
      ]
    }
  },
  {
    name: 'Sokol Testnet',
    chainId: 77,
    rpc: 'https://sokol.poa.network',
    blockExplorer: 'https://blockscout.com/poa/sokol',
    currency: 'xDAI',
    decimals: 18,
    contracts: {
      ledger: '0x3196f354b7a95413E30889D1C6cE5074b10c43f5',
      winPay: '0x6f2fBD652A99Db4b8143c8383Ae39b5459268685',
      assets: [
        {
          name: 'Native xDAI',
          symbol: 'xDAI',
          address: '0x25149dE5afe2043C61687AD136527d2167EFC241',
          decimals: 18,
          image: 'https://bafybeiesj7lzhl7gb3xnnazkozdh6cdsby2nmgphqc6ts6rnlf4mnczzbm.ipfs.dweb.link/8635.png',
          native: true,
          permit: false
        },
        {
          name: 'Wrapped xDAI',
          symbol: 'wxDAI',
          address: '0x25149dE5afe2043C61687AD136527d2167EFC241',
          decimals: 18,
          image: 'https://bafybeicj27bao6jkip26yhvc32tcyror5asop6dfxk3db67yfkxc6me6ym.ipfs.dweb.link/9021.png',
          native: false,
          permit: true
        },
        {
          name: 'USDC',
          symbol: 'USDC',
          address: '0x1C375919362730AC69c5ACffeC775F11c9b75cF2',
          decimals: 18,
          image: 'https://bafybeif5mtgb4mtvvqbhw2kdr4uruu5xm742vtwa3cwndpnsqdb2t4676m.ipfs.dweb.link/3408.png',
          native: false,
          permit: true
        }
      ]
    }
  },
]);

export const getNetworkInfo = (chainId: number): NetworkInfo => {
  const chain = allowedNetworks.find(n => n.chainId === chainId);
  if (!chain) {
    throw new Error(`Unsupported chainId #${chainId}`);
  }
  return chain;
};

export const mode = process.env.NODE_ENV || AppMode.dev;

export const backend = Object.freeze({
  key: process.env.REACT_APP_API_KEY,
  url: process.env.REACT_APP_API_URL
});
