import type { Web3ModalProvider } from '../hooks/useWeb3Modal';
import type { NetworkInfo, CryptoAsset } from '../config';
import type { BigNumber } from 'ethers';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { utils, BigNumber as BN } from 'ethers';
import Blockies from 'react-blockies';
import styled from 'styled-components';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Box,
  Notification,
  Spinner,
  Button,
  Image
} from 'grommet';
import { Share as ShareIcon } from 'grommet-icons';
import { usePoller } from '../hooks/usePoller';
import { useAsset } from '../hooks/useAsset';
import { useWalletRpcApi } from '../hooks/useWalletRpcApi';
import { centerEllipsis, copyToClipboard } from '../utils/strings';
import { allowedNetworks } from '../config';
import Logger from '../utils/logger';

const logger = Logger('AssetCard');

export interface AssetCardProps {
  provider?: Web3ModalProvider;
  network: NetworkInfo | undefined;
  asset?: CryptoAsset;
}

const AccountIcon = styled(Blockies)`
  border-radius: 50%;
`;

const AccountHash = styled(Text)`
  margin: 0 8px;
  cursor: pointer;
`;

export const AssetCard = ({ provider, network, asset }: AssetCardProps) => {
  const { watchAsset } = useWalletRpcApi(provider, allowedNetworks);
  const [account, setAccount] = useState<string | undefined>();
  const shortAccount = useMemo(() => centerEllipsis(account || ''), [account]);
  const [notification, setNotification] = useState<boolean>(false);
  const {
    assetContract,
    tokenContract,
    tokenAddress
  } = useAsset(provider, asset);
  const [balance, setBalance] = useState<BigNumber>(BN.from(0));

  useEffect(() => {
    const getAccount = async () => {
      try {
        if (provider) {
          setAccount(await provider.getSigner().getAddress());
        } else {
          setAccount(undefined);
        }
      } catch (err) {
        logger.error(err);
      }
    };
    getAccount();
  }, [provider]);

  const addTokenToWallet = useCallback(
    async () => {
      try {
        if (tokenAddress && asset) {
          await watchAsset('ERC20', {
            address: tokenAddress,
            symbol: asset.symbol,
            decimals: asset.decimals,
            image: asset.image
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [tokenAddress, asset]
  );

  const getBalance = useCallback(
    async () => {
      try {
        if (provider && asset && assetContract && tokenContract && account) {
          let currentBalance: BigNumber;
          if (asset.native) {
            currentBalance = await provider.getBalance(account);
            logger.debug('Account balance (native):', currentBalance.toString());
            setBalance(currentBalance);
          } else {
            currentBalance = await tokenContract.balanceOf(account);
            logger.debug('Account balance (token):', currentBalance.toString());
            setBalance(currentBalance);
          }
        } else {
          setBalance(BN.from(0));
        }
      } catch (err) {
        logger.error(err);
        setBalance(BN.from(0));
      }
    },
    [provider, asset, assetContract, tokenContract, account]
  );

  const openExplorer = useCallback(
    (address: string) => {
      if (network) {
        window.open(`${network.blockExplorer}/address/${address}`, '_blank');
      }
    },
    [network]
  );

  usePoller(
    getBalance,
    provider && asset && !!account,
    2000,
    'Account balance'
  );

  if (!provider || !asset) {
    return null;
  }

  return (
    <Card background="light-1" fill>
      <CardHeader pad="small">
        <Box width="xsmall" height="xsmall">
          <Image
            fit="cover"
            src={asset.image}
          />
        </Box>
        {!asset.native &&
          <Box direction='column'>
            <Button
              primary
              size="small"
              label={`Add ${asset.symbol} to wallet`}
              onClick={addTokenToWallet}
              margin={{ bottom: 'small' }}
            />
            <Button
              secondary
              size="small"
              label={`${asset.symbol} contract`}
              onClick={() => openExplorer(asset.address)}
              icon={<ShareIcon />}
              reverse
            />
          </Box>
        }
      </CardHeader>
      <CardBody pad="small">
        {!account &&
          <Spinner />
        }
        {account &&
          <Box
            direction="row"
            align="center"
            style={{ boxShadow: 'none' }}
            onClick={() => {
              copyToClipboard(account);
              setNotification(true);
              setTimeout(() => setNotification(false), 1500);
            }}
          >
            <AccountIcon seed={account} size={7} scale={4} />
            <AccountHash size="small">
              {shortAccount} ({Number(utils.formatEther(balance)).toFixed(2)} {asset.symbol})
            </AccountHash>
            {notification && <Notification toast title="Copied to clipboard" status="normal" />}
          </Box>
        }
      </CardBody>
      <CardFooter pad="small">

      </CardFooter>
    </Card>
  );
};
