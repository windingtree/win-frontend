import { Settings } from 'luxon';
import { config } from '@windingtree/win-commons';

// Configure the time zone
Settings.defaultZone = config.defaultZone;

export enum AppMode {
  dev = 'dev',
  stage = 'stage',
  prod = 'prod'
}

// currency the asset is pegged to
export const assetsCurrencies = config.assetsCurrencies;

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

export const getNetworkInfo = config.getNetworkInfo;

export const backend = Object.freeze({
  key: process.env.REACT_APP_API_KEY,
  url: process.env.REACT_APP_API_URL
});
