import { Settings } from 'luxon';
import { config } from '@windingtree/win-commons';

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

checkEnvVariables(['REACT_APP_API_URL', 'REACT_APP_EXPIRATION_GAP', 'REACT_APP_MODE']);

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

export const getNetworkInfo = config.getNetworkInfo;

export const backend = Object.freeze({
  url: process.env.REACT_APP_API_URL
});

export const expirationGap = Number(process.env.REACT_APP_EXPIRATION_GAP);
