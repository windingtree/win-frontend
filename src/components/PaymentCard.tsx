import { Web3ModalProvider } from '../hooks/useWeb3Modal';
import {
  NetworkInfo,
  CryptoAsset,
  AssetCurrency
} from '@windingtree/win-commons/dist/types';
import { Quote } from '@windingtree/glider-types/dist/simard';
import {
  BigNumber,
  Wallet,
  Signature,
  ContractReceipt,
  ContractTransaction
} from 'ethers';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { utils, BigNumber as BN } from 'ethers';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import { createPermitSignature } from '@windingtree/win-pay';
import { DateTime } from 'luxon';
import { MessageBox } from './MessageBox';
import { ExternalLink } from './ExternalLink';
import Iconify from '../components/Iconify';
import { usePoller } from '../hooks/usePoller';
import { useAsset } from '../hooks/useAsset';
import { useWalletRpcApi } from '../hooks/useWalletRpcApi';
import { useAllowance } from 'src/hooks/useAllowance';
import { useWinPay } from '../hooks/useWinPay';
import { useResponsive } from '../hooks/useResponsive';
import { centerEllipsis, formatPrice } from '../utils/strings';
import { allowedNetworks } from '../config';
import Logger from '../utils/logger';

const logger = Logger('PaymentCard');

export interface Payment {
  currency: AssetCurrency;
  value: string;
  expiration: number;
  providerId: string;
  serviceId: string;
  quote?: Quote;
}

export interface PaymentSuccess {
  payment: Payment;
  tx: ContractTransaction;
  receipt: ContractReceipt;
}

export type PaymentSuccessCallback = (result: PaymentSuccess) => void;

export interface PaymentCardProps {
  provider?: Web3ModalProvider;
  network?: NetworkInfo;
  asset?: CryptoAsset;
  payment: Payment;
  withQuote: boolean;
  onSuccess: PaymentSuccessCallback;
}

export interface MetamaskError extends Error {
  action: string;
  code: number;
  reason: string;
  message: string;
  stack: string;
}

const parseMetamaskError = (err: MetamaskError): string | undefined => {
  return err?.reason && `${err.reason.charAt(0).toUpperCase()}${err.reason.slice(1)}`;
};

export const PaymentCard = ({
  provider,
  network,
  asset,
  payment,
  withQuote,
  onSuccess
}: PaymentCardProps) => {
  const isDesktop = useResponsive('up', 'md');
  const { watchAsset } = useWalletRpcApi(provider, allowedNetworks);
  const [account, setAccount] = useState<string | undefined>();
  const { winPayContract } = useWinPay(provider, network);
  const { assetContract, tokenContract, tokenAddress } = useAsset(provider, asset);
  const tokenAllowance = useAllowance(
    tokenContract,
    account,
    asset,
    asset && asset.permit
  );
  const [balance, setBalance] = useState<BigNumber>(BN.from(0));
  const [permitSignature, setPermitSignature] = useState<Signature | undefined>();
  const [isAccountContract, setIsAccountContract] = useState<boolean>(false);
  const [isTxStarted, setTxStarted] = useState<'approve' | 'pay' | undefined>();
  const [costError, setCostError] = useState<string | undefined>();
  const [permitError, setPermitError] = useState<string | undefined>();
  const [approvalError, setApprovalError] = useState<string | undefined>();
  const [paymentError, setPaymentError] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const [paymentExpired, setPaymentExpired] = useState<boolean>(false);

  const formattedBalance = useMemo(() => {
    if (!asset || balance.isZero()) {
      return '0.00';
    }
    const value = utils.formatUnits(balance, asset.decimals);
    return value.length > 21 ? value : Number(value).toFixed(2);
  }, [balance, asset]);

  const paymentValue = useMemo(() => {
    if (!asset) {
      return BN.from(0);
    }
    return BN.from(
      utils.parseUnits(
        withQuote && payment.quote ? payment.quote.sourceAmount : payment.value,
        asset.decimals
      )
    );
  }, [asset, payment, withQuote]);

  const paymentBlocked = useMemo(
    () =>
      paymentValue.isZero() ||
      balance.isZero() ||
      paymentExpired ||
      !!costError ||
      isTxStarted !== undefined ||
      (asset &&
        !asset.native &&
        tokenAllowance.lt(paymentValue) &&
        permitSignature === undefined),
    [costError, asset, paymentValue, balance, tokenAllowance, permitSignature]
  );

  const permitBlocked = useMemo(
    () =>
      (asset && (!asset.permit || asset.native)) ||
      paymentValue.isZero() ||
      balance.lt(paymentValue) ||
      paymentExpired ||
      permitSignature !== undefined ||
      tokenAllowance.gte(paymentValue) ||
      isAccountContract,
    [asset, paymentValue, balance, permitSignature, tokenAllowance, isAccountContract]
  );

  const allowanceBlocked = useMemo(
    () =>
      (asset && (asset.permit || asset.native)) ||
      paymentValue.isZero() ||
      balance.lt(paymentValue) ||
      paymentExpired ||
      !permitBlocked ||
      tokenAllowance.gte(paymentValue) ||
      permitSignature !== undefined,
    [asset, paymentValue, balance, tokenAllowance, permitSignature, permitBlocked]
  );

  const resetState = useCallback(() => {
    setPermitSignature(undefined);
    setCostError(undefined);
    setPermitError(undefined);
    setApprovalError(undefined);
    setPaymentError(undefined);
    setTxHash(undefined);
    setTxStarted(undefined);
  }, [payment]);

  useEffect(() => resetState(), [provider, network, asset, payment, resetState]);

  useEffect(() => {
    const checkIsAccount = async () => {
      try {
        if (provider && account) {
          const code = await provider.getCode(account);
          const isContract = code !== '0x';
          logger.debug('isAccountContract', isContract);
          setIsAccountContract(isContract);
        } else {
          setIsAccountContract(false);
        }
      } catch (err) {
        logger.error(err);
        setIsAccountContract(false);
      }
    };
    checkIsAccount();
  }, [provider, account]);

  // useEffect(() => {
  //   if (!assetsCurrencies.includes(payment.currency)) {
  //     throw new Error(`Unsupported currency ${payment.currency}`);
  //   }
  // }, [payment]);

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

    if (payment && balance && balance.lt(paymentValue)) {
      setCostError('Balance not enough for payment');
    }
  }, [payment, balance, paymentValue]);

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
          setBalance(currentBalance);
        } else {
          currentBalance = await tokenContract.balanceOf(account);
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
        logger.debug('Payment params:', {
          tokenContract,
          account,
          asset: asset.address,
          value: paymentValue,
          expiration: payment.expiration
        });
        const signature = await createPermitSignature(
          provider.getSigner() as unknown as Wallet,
          tokenContract,
          account,
          asset.address,
          paymentValue,
          payment.expiration
        );
        logger.debug('Permit signature', signature);
        setPermitSignature(signature);
      } else {
        throw new Error(
          'You cannot create permit signature. The component is not ready. Please be sure what you wallet is connected'
        );
      }
    } catch (err) {
      logger.error([err]);
      if (err.reason) {
        setPermitError(`Error: ${err.reason}`);
      } else {
        setPermitError((err as Error).message || 'Unknown permit signature error');
      }
      setPermitSignature(undefined);
    }
  }, [provider, asset, tokenContract, account]);

  const approveTokens = useCallback(async () => {
    try {
      setApprovalError(undefined);
      setTxHash(undefined);
      setTxStarted('approve');

      if (tokenContract && asset) {
        const tx = await tokenContract.approve(asset.address, paymentValue);
        logger.debug('Approval tx', tx);
        setTxHash(tx.hash);
        const receipt = await tx.wait();
        logger.debug('Approval receipt', receipt);
      }
      setTxStarted(undefined);
    } catch (err) {
      logger.error(err);
      setApprovalError(
        err.message ? err.message.split('[')[0] : 'Unknown tokens approval error'
      );
      setTxStarted(undefined);
    }
  }, [tokenContract, asset, payment]);

  const makePayment = useCallback(async () => {
    try {
      setPaymentError(undefined);
      setTxHash(undefined);
      setTxStarted('pay');

      if (winPayContract && asset && account) {
        let tx: ContractTransaction;
        let receipt: ContractReceipt;

        if (permitSignature !== undefined) {
          // Make payment with permitted tokens
          logger.debug(
            'Deal params (permit):',
            payment.providerId,
            payment.serviceId,
            payment.expiration,
            asset.address,
            paymentValue,
            {
              owner: account,
              deadline: payment.expiration,
              v: permitSignature.v,
              r: permitSignature.r,
              s: permitSignature.s
            }
          );
          tx = await winPayContract[
            'deal(bytes32,bytes32,uint256,address,uint256,(address,uint256,uint8,bytes32,bytes32))'
          ](
            payment.providerId,
            payment.serviceId,
            payment.expiration,
            asset.address,
            paymentValue,
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
          logger.debug(
            'Deal params (native):',
            payment.providerId,
            payment.serviceId,
            payment.expiration,
            asset.address,
            paymentValue,
            {
              value: paymentValue
            }
          );
          tx = await winPayContract['deal(bytes32,bytes32,uint256,address,uint256)'](
            payment.providerId,
            payment.serviceId,
            payment.expiration,
            asset.address,
            paymentValue,
            {
              value: paymentValue
            }
          );
          logger.debug('Payment (native) tx', tx);
          setTxHash(tx.hash);
          receipt = await tx.wait();
          logger.debug('Payment (native) deal receipt', receipt);
        } else {
          // Make payment with approved tokens
          logger.debug(
            'Deal params:',
            payment.providerId,
            payment.serviceId,
            payment.expiration,
            asset.address,
            paymentValue
          );
          tx = await winPayContract['deal(bytes32,bytes32,uint256,address,uint256)'](
            payment.providerId,
            payment.serviceId,
            payment.expiration,
            asset.address,
            paymentValue
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
      setPaymentError(parseMetamaskError(err) ?? 'Unknown payment error');
      setTxStarted(undefined);
    }
  }, [winPayContract, asset, account, permitSignature, resetState]);

  const openExplorer = useCallback(
    (address: string | undefined) => {
      if (network && address) {
        window.open(`${network.blockExplorer}/address/${address}`, '_blank');
      }
    },
    [network]
  );

  usePoller(getBalance, provider && asset && !!account, 2000, 'Account balance');

  const checkExpiration = useCallback(() => {
    if (DateTime.fromSeconds(payment.expiration) < DateTime.now()) {
      setPaymentExpired(true);
    }
  }, [payment]);

  usePoller(checkExpiration, payment && !paymentExpired, 1000, 'Expiration check');

  if (!provider || !asset) {
    return null;
  }

  return (
    <>
      <Card
        sx={{
          mb: 3
        }}
      >
        <CardContent
          sx={{
            padding: 2
          }}
        >
          <Box
            sx={{
              gap: 2,
              mb: 2,
              display: 'flex',
              flexDirection: 'row',
              alignItems: isDesktop ? 'flex-start' : 'center',
              justifyContent: isDesktop ? '' : 'space-between'
            }}
          >
            <Box
              sx={{
                flexShrink: 0
              }}
            >
              <img width="70" height="70" src={asset.image} alt={asset.name} />
            </Box>
            {!asset.native && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={addTokenToWallet}
                  sx={{
                    mb: 1
                  }}
                >
                  {`Add ${asset.symbol} to wallet`}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => openExplorer(tokenAddress)}
                  endIcon={<Iconify color="inherit" icon="cil:external-link" ml={1} />}
                >
                  {`${asset.symbol} contract`}
                </Button>
              </Box>
            )}
          </Box>

          {account && balance && (
            <Typography mb={3}>
              Your balance: {formattedBalance} {asset.symbol}
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2
            }}
          >
            {!asset.native && !asset.permit && tokenAllowance.lt(paymentValue) && (
              <Button
                variant="contained"
                onClick={approveTokens}
                disabled={allowanceBlocked}
              >
                Approve the tokens
                {isTxStarted === 'approve' ? (
                  <CircularProgress size="16px" color="inherit" sx={{ ml: 1 }} />
                ) : undefined}
              </Button>
            )}
            {!asset.native && asset.permit && permitSignature === undefined && (
              <Button variant="contained" onClick={createPermit} disabled={permitBlocked}>
                Permit the tokens
              </Button>
            )}
            <Button variant="contained" onClick={makePayment} disabled={paymentBlocked}>
              Pay {formatPrice(paymentValue, asset.symbol, asset.decimals)}
              {isTxStarted === 'pay' ? (
                <CircularProgress size="16px" color="inherit" sx={{ ml: 1 }} />
              ) : undefined}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <MessageBox type="info" show={!!txHash} loading={isTxStarted !== undefined}>
        <Typography variant="body1">
          Transaction hash:&nbsp;
          <ExternalLink href={`${network?.blockExplorer}/tx/${txHash}`} target="_blank">
            {centerEllipsis(txHash || '')}
          </ExternalLink>
        </Typography>
      </MessageBox>

      <MessageBox type="warn" show={!!costError}>
        <Typography variant="body1">
          {costError}. Get some {asset.symbol}{' '}
          {asset.ramp !== undefined && (
            <ExternalLink href={`${asset.ramp}${account}`} target="_blank">
              on ramp
            </ExternalLink>
          )}
        </Typography>
      </MessageBox>

      <MessageBox type="warn" show={!!permitError}>
        <Typography variant="body1">
          {permitError}
          <br />
          Please try to create permit signature again.
        </Typography>
      </MessageBox>

      <MessageBox type="warn" show={!!approvalError}>
        <Typography variant="body1">
          {approvalError}
          <br />
          Please try to send approval transaction again.
        </Typography>
      </MessageBox>

      <MessageBox type="error" show={paymentExpired}>
        <Typography variant="body1">
          Your booking offer is expired.{' '}
          <Link to="/">Please try to search for accommodation again</Link>
        </Typography>
      </MessageBox>

      <MessageBox type="warn" show={!!paymentError}>
        <Typography variant="body1">{paymentError}</Typography>
        <Typography variant="body1">
          Please check your account transactions history on the block explorer:&nbsp;
          <ExternalLink
            href={`${network?.blockExplorer}/address/${account}`}
            target="_blank"
          >
            {centerEllipsis(account || '')}
          </ExternalLink>
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Iconify color="inherit" icon="bi:dot" />
            </ListItemIcon>
            <ListItemText>
              If the payment transaction not been sent please try to send it again.
              <br />
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify color="inherit" icon="bi:dot" />
            </ListItemIcon>
            <ListItemText>
              If the payment transaction is sent despite of error please wait for the
              booking confirmation in your mailbox.
            </ListItemText>
          </ListItem>
        </List>
      </MessageBox>
    </>
  );
};
