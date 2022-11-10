import type { Chain } from '@web3modal/ethereum';
import type { ConfigOptions } from '@web3modal/core';
import { Settings } from 'luxon';
import { config } from '@windingtree/win-commons';
import { stringToNumber } from '../utils/strings';
import { CurrencyCode } from '../hooks/useCurrencies';

export enum AppMode {
  dev = 'dev',
  stage = 'stage',
  prod = 'prod'
}

export interface Api {
  key: string;
  url: string;
}

export const checkEnvVariables = (vars: string[]): void =>
  vars.forEach((variable) => {
    if (!process.env[variable] || process.env[variable] === '') {
      throw new Error(`${variable} must be provided in the ENV`);
    }
  });

checkEnvVariables([
  'REACT_APP_API_URL',
  'REACT_APP_EXPIRATION_GAP',
  'REACT_APP_MODE',
  'REACT_APP_DISABLE_FEATURES',
  'REACT_APP_LOG_LEVEL'
]);

// Configure the time zone
Settings.defaultZone = config.defaultZone;

// currency the asset is pegged to
export const assetsCurrencies = config.assetsCurrencies;

let mode: AppMode;

switch (process.env.REACT_APP_MODE) {
  case 'prod':
    mode = AppMode.prod;
    break;
  case 'dev':
    mode = AppMode.dev;
    break;
  case 'stage':
  default:
    mode = AppMode.stage;
}

export const allowedNetworks = config.getNetworksByMode(mode);
export const getNetworkInfo = config.getNetworkInfo

const chains: Chain[] = allowedNetworks.map((network) => ({
  id: network.chainId,
  name: network.name,
  network: network.name,
  nativeCurrency: {
    name: network.currency,
    symbol: network.currency,
    decimals: network.decimals
  },
  rpcUrls: {
    default: network.rpc
  },
  blockExplorers: {
    default: {
      name: 'string',
      url: network.blockExplorer
    }
  }
}));

export const web3ModalConfig: ConfigOptions = {
  projectId: String(process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID),
  theme: 'light',
  accentColor: 'default',
  ethereum: {
    appName: 'WIN',
    chains: chains
  }
};

export const backend = Object.freeze({
  url: process.env.REACT_APP_API_URL
});

export const PROXY_SERVER = process.env.REACT_APP_PROXY_SERVER || backend + '/proxy';

export const DISABLE_FEATURES =
  process.env.REACT_APP_DISABLE_FEATURES === 'true' ? true : false;

export const GROUP_MODE_ROOM_COUNT = stringToNumber(
  process.env.REACT_APP_GROUP_MODE_ROOM_COUNT || '10'
);

const availableLogLevels = ['none', 'error', 'debug', 'info'];
export const APP_LOG_LEVEL =
  typeof process.env.REACT_APP_LOG_LEVEL === 'string' &&
  process.env.REACT_APP_LOG_LEVEL.length &&
  availableLogLevels.includes(process.env.REACT_APP_LOG_LEVEL)
    ? process.env.REACT_APP_LOG_LEVEL
    : 'debug';

export const expirationGap = Number(process.env.REACT_APP_EXPIRATION_GAP);

// default distance used for accommodation API search
export const defaultSearchRadiusInMeters = 20000;

export const defaultCurrencyCode: CurrencyCode = 'USD';

export const devconCashbackEnabled = process.env.REACT_APP_STL_DEVCON ?? 0;
