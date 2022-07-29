import type { Web3ModalProvider } from '../hooks/useWeb3Modal';
import { useCallback, useMemo, useState } from 'react';
import { utils } from 'ethers';
import Blockies from 'react-blockies';
import styled from 'styled-components';
import { Box, Text, Notification } from 'grommet';
import { getNetworkInfo } from '../config';
import { centerEllipsis, copyToClipboard } from '../utils/strings';
import { usePoller } from '../hooks/usePoller';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('Account');

export interface AccountProps {
  account?: string;
  provider?: Web3ModalProvider;
}

const AccountIcon = styled(Blockies)`
  border-radius: 50%;
`;

const AccountHash = styled(Text)`
  margin: 0 8px;
  cursor: pointer;
`;

export const Account = ({ account, provider }: AccountProps) => {
  const [balance, setBalance] = useState<string>('');
  const [notification, setNotification] = useState<boolean>(false);

  const shortAccount = useMemo(() => centerEllipsis(account || ''), [account]);

  const getBalance = useCallback(async () => {
    try {
      if (provider && account) {
        const network = await provider.getNetwork();
        const chain = getNetworkInfo(network.chainId);
        provider
          .getBalance(account)
          .then((balance) =>
            setBalance(
              `(${Number(utils.formatEther(balance)).toFixed(2)} ${chain.currency})`
            )
          )
          .catch(console.error);
      } else {
        setBalance('');
      }
    } catch (err) {
      logger.error(err);
      setBalance('');
    }
  }, [provider, account]);

  usePoller(getBalance, !!provider, 2000, 'Account balance');

  if (!provider || !account) {
    return null;
  }

  return (
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
        {shortAccount}&nbsp;{balance}
      </AccountHash>
      {notification && <Notification toast title="Copied to clipboard" status="normal" />}
    </Box>
  );
};
