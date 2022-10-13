import type { BigNumber } from 'ethers';
import type {
  MockERC20Dec18Permit,
  MockWrappedERC20Dec18
} from '@windingtree/win-pay/dist/typechain';
import type { CryptoAsset } from '@windingtree/win-commons/dist/types';
import { useCallback, useState } from 'react';
import { BigNumber as BN } from 'ethers';
import { usePoller } from './usePoller';
import Logger from '../utils/logger';

const logger = Logger('useAllowance');

export const useAllowance = (
  tokenContract: MockERC20Dec18Permit | MockWrappedERC20Dec18 | undefined,
  owner: string | undefined,
  asset: CryptoAsset | undefined
): BigNumber => {
  const [allowance, setAllowance] = useState<BigNumber>(BN.from(0));

  const checkAllowance = useCallback(async () => {
    try {
      if (tokenContract && owner && asset && !asset.native) {
        const tokenAllowance = await tokenContract.allowance(owner, asset.address);
        logger.debug(
          `Allowance from ${owner} to ${asset.address}`,
          tokenAllowance.toString()
        );
        setAllowance(tokenAllowance);
      } else {
        setAllowance(BN.from(0));
      }
    } catch (err) {
      logger.error(err);
      setAllowance(BN.from(0));
    }
  }, [tokenContract, owner, asset]);

  usePoller(
    checkAllowance,
    tokenContract && !!owner && !!asset && !asset.native,
    2000,
    'Tokens allowance'
  );

  return allowance;
};
