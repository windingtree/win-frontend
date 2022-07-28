import { Box } from 'grommet';
import { BigNumber } from 'ethers';
import { useAppState, State } from '../store';
import { Account } from './Account';
import { SignInButton, SignOutButton } from './Web3Modal';
import { NetworkSelector } from './NetworkSelector';

export const allowedCurrencies = [
  'EUR',
  'USD'
];

export type AllowedCurrency = typeof allowedCurrencies[number];

export interface PaymentCost {
  currency: AllowedCurrency;
  value: BigNumber;
}

export interface WinPayProps {
  cost?: PaymentCost
}

export const WinPay = ({ cost }: WinPayProps) => {
  const { provider, account } = useAppState();

  return (
    <Box direction="column" gap="small" fill>
      <Box direction="row" align="right" gap="small">
        <Account account={account} provider={provider} />
        {account ? <SignOutButton /> : <SignInButton />}
      </Box>
      {account &&
        <NetworkSelector/>
      }
    </Box>
  );
};
