import type { providers } from 'ethers';
import Logger from '../utils/logger';

const logger = Logger('useWeb3Modal');

export type Web3ModalProvider = providers.Web3Provider;

export type Web3ModalSignInFunction = () => Promise<void>;

export type Web3ModalSignOutFunction = () => void;
