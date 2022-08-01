import type { Web3ModalProvider } from '../hooks/useWeb3Modal';
import type { NetworkInfo, CryptoAsset, AssetCurrency } from '../config';
import type {
  BigNumber,
  Wallet,
  Signature,
  ContractReceipt,
  ContractTransaction
} from 'ethers';
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
import { createPermitSignature } from '@windingtree/win-pay';
import { usePoller } from '../hooks/usePoller';
import { useAsset } from '../hooks/useAsset';
import { useWalletRpcApi } from '../hooks/useWalletRpcApi';
import { useAllowance } from 'src/hooks/useAllowance';
import { useWinPay } from '../hooks/useWinPay';
import { centerEllipsis, copyToClipboard, formatCost } from '../utils/strings';
import { allowedNetworks, assetsCurrencies } from '../config';
import { MessageBox } from './MessageBox';
import { ExternalLink } from './ExternalLink';
import Logger from '../utils/logger';

const logger = Logger('PaymentCard');

export interface Payment {
  currency: AssetCurrency;
  value: BigNumber;
  expiration: number;
  providerId: string;
  serviceId: string;
}

export interface PaymentSuccess {
  payment: Payment;
  tx: ContractTransaction;
  receipt: ContractReceipt;
}

export interface PaymentCardProps {
  provider?: Web3ModalProvider;
  network?: NetworkInfo;
  asset?: CryptoAsset;
  payment: Payment;
  onSuccess: (result: PaymentSuccess) => void;
}

const AccountIcon = styled(Blockies)`
  border-radius: 50%;
`;

const AccountHash = styled(Text)`
  margin: 0 8px;
  cursor: pointer;
`;

export const PaymentCard = ({
  provider,
  network,
  asset,
  payment,
  onSuccess
}: PaymentCardProps) => {
  const { watchAsset } = useWalletRpcApi(provider, allowedNetworks);
  const [account, setAccount] = useState<string | undefined>();
  const shortAccount = useMemo(() => centerEllipsis(account || ''), [account]);
  const [notification, setNotification] = useState<boolean>(false);
  const { winPayContract } = useWinPay(provider, network);
  const { assetContract, tokenContract, tokenAddress } = useAsset(provider, asset);
  const tokenAllowance = useAllowance(tokenContract, account, asset);
  const [balance, setBalance] = useState<BigNumber>(BN.from(0));
  const [permitSignature, setPermitSignature] = useState<Signature | undefined>();
  const [costError, setCostError] = useState<string | undefined>();
  const [permitError, setPermitError] = useState<string | undefined>();
  const [approvalError, setApprovalError] = useState<string | undefined>();
  const [paymentError, setPaymentError] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const paymentBlocked = useMemo(
    () =>
      !!costError ||
      (asset &&
        !asset.native &&
        tokenAllowance.lt(payment.value) &&
        permitSignature === undefined),
    [costError, asset, tokenAllowance, permitSignature]
  );
  const allowanceBlocked = useMemo(
    () =>
      (asset && !asset.native && tokenAllowance.gte(payment.value)) ||
      permitSignature !== undefined,
    [asset, tokenAllowance, permitSignature]
  );
  const permitBlocked = useMemo(
    () => permitSignature !== undefined || tokenAllowance.gte(payment.value),
    [permitSignature, tokenAllowance]
  );

  const resetState = () => {
    setPermitSignature(undefined);
    setCostError(undefined);
    setPermitError(undefined);
    setApprovalError(undefined);
    setPaymentError(undefined);
    setTxHash(undefined);
  };

  useEffect(() => {
    if (!assetsCurrencies.includes(payment.currency)) {
      throw new Error(`Unsupported currency ${payment.currency}`);
    }
  }, [payment]);

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

  useEffect(() => {
    setCostError(undefined);

    if (payment && balance && balance.lt(payment.value)) {
      setCostError('Balance not enough for payment');
    }
  }, [payment, balance]);

  const addTokenToWallet = useCallback(async () => {
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
  }, [tokenAddress, asset]);

  const getBalance = useCallback(async () => {
    try {
      if (provider && asset && assetContract && tokenContract && account) {
        let currentBalance: BigNumber;
        if (asset.native) {
          currentBalance = await provider.getBalance(account);
          // logger.debug('Account balance (native):', currentBalance.toString());
          setBalance(currentBalance);
        } else {
          currentBalance = await tokenContract.balanceOf(account);
          // logger.debug('Account balance (token):', currentBalance.toString());
          setBalance(currentBalance);
        }
      } else {
        setBalance(BN.from(0));
      }
    } catch (err) {
      logger.error(err);
      setBalance(BN.from(0));
    }
  }, [provider, asset, assetContract, tokenContract, account]);

  const createPermit = useCallback(async () => {
    try {
      setPermitError(undefined);

      if (provider && asset && tokenContract && account) {
        const signature = await createPermitSignature(
          provider.getSigner() as unknown as Wallet,
          tokenContract,
          account,
          asset.address,
          payment.value,
          payment.expiration
        );
        logger.debug('Permit signature', signature);
        setPermitSignature(signature);
      } else {
        throw new Error('You cannot create permit signature. The component is not ready');
      }
    } catch (err) {
      logger.error(err);
      setPermitError((err as Error).message || 'Unknown permit signature error');
      setPermitSignature(undefined);
    }
  }, [provider, asset, tokenContract, account]);

  const approveTokens = useCallback(async () => {
    try {
      setApprovalError(undefined);
      setTxHash(undefined);

      if (tokenContract && asset) {
        const tx = await tokenContract.approve(asset.address, payment.value);
        logger.debug('Approval tx', tx);
        setTxHash(tx.hash);
        const receipt = await tx.wait();
        logger.debug('Approval receipt', receipt);
      }
    } catch (err) {
      logger.error(err);
      setApprovalError(
        err.message ? err.message.split('[')[0] : 'Unknown tokens approval error'
      );
    }
  }, [tokenContract, asset, payment]);

  const makePayment = useCallback(async () => {
    try {
      setPaymentError(undefined);
      setTxHash(undefined);

      if (winPayContract && asset && account) {
        let tx: ContractTransaction;
        let receipt: ContractReceipt;

        if (permitSignature !== undefined) {
          // Make payment with permitted tokens
          tx = await winPayContract[
            'deal(bytes32,bytes32,uint256,address,uint256,(address,uint256,uint8,bytes32,bytes32))'
          ](
            payment.providerId,
            payment.serviceId,
            payment.expiration,
            asset.address,
            payment.value,
            {
              owner: account,
              deadline: payment.expiration,
              v: permitSignature.v,
              r: permitSignature.r,
              s: permitSignature.s
            }
          );
          logger.debug('Payment (permitted) tx', tx);
          setTxHash(tx.hash);
          receipt = await tx.wait();
          logger.debug('Payment (permitted) deal receipt', receipt);
        } else if (asset.native) {
          // Make payment with native tokens
          tx = await winPayContract['deal(bytes32,bytes32,uint256,address,uint256)'](
            payment.providerId,
            payment.serviceId,
            payment.expiration,
            asset.address,
            payment.value,
            {
              value: payment.value
            }
          );
          logger.debug('Payment (native) tx', tx);
          setTxHash(tx.hash);
          receipt = await tx.wait();
          logger.debug('Payment (native) deal receipt', receipt);
        } else {
          // Make payment with approved tokens
          tx = await winPayContract['deal(bytes32,bytes32,uint256,address,uint256)'](
            payment.providerId,
            payment.serviceId,
            payment.expiration,
            asset.address,
            payment.value
          );
          logger.debug('Payment (approved) tx', tx);
          setTxHash(tx.hash);
          receipt = await tx.wait();
          logger.debug('Payment (approved) deal receipt', receipt);
        }
        resetState();
        onSuccess({
          payment,
          tx,
          receipt
        });
      } else {
        throw new Error('You cannot make payment. The component is not ready');
      }
    } catch (err) {
      logger.error(err);
      setPaymentError(
        err.message ? err.message.split('[')[0] : 'Unknown payment signature error'
      );
    }
  }, [winPayContract, asset, account, permitSignature]);

  const openExplorer = useCallback(
    (address: string) => {
      if (network) {
        window.open(`${network.blockExplorer}/address/${address}`, '_blank');
      }
    },
    [network]
  );

  usePoller(getBalance, provider && asset && !!account, 2000, 'Account balance');

  if (!provider || !asset) {
    return null;
  }

  return (
    <>
      <Card background="light-1" margin={{ bottom: 'small' }} fill>
        <CardHeader pad="small">
          <Box width="xsmall" height="xsmall">
            <Image fit="cover" src={asset.image} />
          </Box>
          {!asset.native && (
            <Box direction="column">
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
          )}
        </CardHeader>
        <CardBody pad="small">
          {!account && <Spinner />}
          {account && (
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
                {shortAccount} ({Number(utils.formatEther(balance)).toFixed(2)}{' '}
                {asset.symbol})
              </AccountHash>
              {notification && (
                <Notification toast title="Copied to clipboard" status="normal" />
              )}
            </Box>
          )}
        </CardBody>
        <CardFooter pad="small">
          <Box>
            <Text size="large" weight="bold">
              {formatCost(payment, asset.symbol)}
            </Text>
          </Box>
          <Box direction="row" gap="small">
            {!asset.native && (
              <Button
                secondary
                size="small"
                label="Approve tokens"
                onClick={approveTokens}
                disabled={allowanceBlocked}
              />
            )}
            {asset.permit && (
              <Button
                secondary
                size="small"
                label="Permit"
                onClick={createPermit}
                disabled={permitBlocked}
              />
            )}
            <Button
              primary
              size="small"
              label="Pay"
              onClick={makePayment}
              disabled={paymentBlocked}
            />
          </Box>
        </CardFooter>
      </Card>
      <MessageBox type="info" show={!!txHash}>
        <Text>
          Transaction hash:&nbsp;
          <ExternalLink href={`${network?.blockExplorer}/tx/${txHash}`} target="_blank">
            {centerEllipsis(txHash || '')}
          </ExternalLink>
        </Text>
      </MessageBox>
      <MessageBox type="warn" show={!!costError}>
        {costError}
      </MessageBox>
      <MessageBox type="warn" show={!!permitError}>
        {permitError}
      </MessageBox>
      <MessageBox type="warn" show={!!approvalError}>
        {approvalError}
      </MessageBox>
      <MessageBox type="warn" show={!!paymentError}>
        {paymentError}
      </MessageBox>
    </>
  );
};
