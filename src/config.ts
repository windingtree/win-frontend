import { VidereConfig } from "@windingtree/videre-sdk";
import { Settings } from "luxon";

// Configure the time zone
Settings.defaultZone = 'Etc/GMT0';

const checkEnvVariables = (vars: string[]): void =>
  vars.forEach(
    variable => {
      if (
        !process.env[variable] ||
        process.env[variable] === ''
      ) {
        throw new Error(`${variable} must be provided in the ENV`);
      }
    }
  );

checkEnvVariables([
  'REACT_APP_NETWORK_NAME',
  'REACT_APP_BLOCK_EXPLORER',
  'REACT_APP_NETWORK_PROVIDER',
  'REACT_APP_VERIFYING_CONTRACT',
  'REACT_APP_WEB3STORAGE_KEY',
  'REACT_APP_LINE',
  'REACT_APP_VERSION'
]);

export const chainId = Number(process.env.REACT_APP_NETWORK_ID);
export const name = process.env.REACT_APP_NETWORK_NAME as string;
export const blockExplorer = process.env.REACT_APP_BLOCK_EXPLORER as string;
export const address = process.env.REACT_APP_VERIFYING_CONTRACT as string;
export const rpc = process.env.REACT_APP_NETWORK_PROVIDER as string;
export const web3StorageKey = process.env.REACT_APP_WEB3STORAGE_KEY as string;

export const videreConfig: VidereConfig = {
  line: String(process.env.REACT_APP_LINE),
  version: Number(process.env.REACT_APP_VERSION)
}
