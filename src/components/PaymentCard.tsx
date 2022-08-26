import { Web3ModalProvider } from '../hooks/useWeb3Modal';
import {
  NetworkInfo,
  CryptoAsset,
  AssetCurrency
} from '@windingtree/win-commons/dist/types';
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
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createPermitSignature } from '@windingtree/win-pay';
import { MessageBox } from './MessageBox';
import { ExternalLink } from './ExternalLink';
import Iconify from '../components/Iconify';
import { usePoller } from '../hooks/usePoller';
import { useAsset } from '../hooks/useAsset';
import { useWalletRpcApi } from '../hooks/useWalletRpcApi';
import { useAllowance } from 'src/hooks/useAllowance';
import { useWinPay } from '../hooks/useWinPay';
import useResponsive from '../hooks/useResponsive';
import { centerEllipsis, formatCost } from '../utils/strings';
import { allowedNetworks, assetsCurrencies } from '../config';
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

export type PaymentSuccessCallback = (result: PaymentSuccess) => void;

export interface PaymentCardProps {
  provider?: Web3ModalProvider;
  network?: NetworkInfo;
  asset?: CryptoAsset;
  payment: Payment;
  onSuccess: PaymentSuccessCallback;
}

export const PaymentCard = ({
  provider,
  network,
  asset,
  payment,
  onSuccess
}: PaymentCardProps) => {
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');
  const { watchAsset } = useWalletRpcApi(provider, allowedNetworks);
  const [account, setAccount] = useState<string | undefined>();
  const { winPayContract } = useWinPay(provider, network);
  const { assetContract, tokenContract, tokenAddress } = useAsset(provider, asset);
  const tokenAllowance = useAllowance(tokenContract, account, asset);
  const [balance, setBalance] = useState<BigNumber>(BN.from(0));
  const [permitSignature, setPermitSignature] = useState<Signature | undefined>();
  const [isAccountContract, setIsAccountContract] = useState<boolean>(false);
  const [isTxStarted, setTxStarted] = useState<'approve' | 'pay' | undefined>();
  const [costError, setCostError] = useState<string | undefined>();
  const [permitError, setPermitError] = useState<string | undefined>();
  const [approvalError, setApprovalError] = useState<string | undefined>();
  const [paymentError, setPaymentError] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const paymentBlocked = useMemo(
    () =>
      !!costError ||
      isTxStarted !== undefined ||
      (asset &&
        !asset.native &&
        tokenAllowance.lt(payment.value) &&
        permitSignature === undefined),
    [costError, asset, tokenAllowance, permitSignature]
  );
  const permitBlocked = useMemo(
    () =>
      permitSignature !== undefined ||
      tokenAllowance.gte(payment.value) ||
      isAccountContract,
    [permitSignature, tokenAllowance, isAccountContract]
  );
  const allowanceBlocked = useMemo(
    () =>
      !permitBlocked ||
      (asset && !asset.native && tokenAllowance.gte(payment.value)) ||
      permitSignature !== undefined,
    [asset, tokenAllowance, permitSignature, permitBlocked]
  );

  const resetState = () => {
    setPermitSignature(undefined);
    setCostError(undefined);
    setPermitError(undefined);
    setApprovalError(undefined);
    setPaymentError(undefined);
    setTxHash(undefined);
    setTxStarted(undefined);
  };

  useEffect(() => resetState(), [provider, network, asset, payment]);

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
          value: payment.value,
          expiration: payment.expiration
        });
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
        const tx = await tokenContract.approve(asset.address, payment.value);
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
      setPaymentError(err.message ? err.message.split('[')[0] : 'Unknown payment error');
      setTxStarted(undefined);
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
      <Card
        sx={{
          marginBottom: theme.spacing(3)
        }}
      >
        <CardContent
          sx={{
            padding: theme.spacing(2)
          }}
        >
          <Box
            sx={{
              gap: theme.spacing(2),
              marginBottom: theme.spacing(2),
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
                    marginBottom: theme.spacing(1)
                  }}
                >
                  {`Add ${asset.symbol} to wallet`}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => openExplorer(asset.address)}
                  endIcon={
                    <Iconify
                      color="inherit"
                      icon="cil:external-link"
                      marginLeft={theme.spacing(1)}
                    />
                  }
                >
                  {`${asset.symbol} contract`}
                </Button>
              </Box>
            )}
          </Box>

          {account && balance && (
            <Typography marginBottom={theme.spacing(3)}>
              Your balance: {Number(utils.formatEther(balance)).toFixed(2)} {asset.symbol}
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing(2)
            }}
          >
            {!allowanceBlocked && !asset.native && (
              <Button
                variant="contained"
                onClick={approveTokens}
                disabled={allowanceBlocked}
              >
                Approve the tokens
                {isTxStarted === 'approve' ? (
                  <CircularProgress
                    size="16px"
                    color="inherit"
                    sx={{ ml: theme.spacing(1) }}
                  />
                ) : undefined}
              </Button>
            )}
            {!permitBlocked && asset.permit && (
              <Button variant="contained" onClick={createPermit} disabled={permitBlocked}>
                Permit the tokens
              </Button>
            )}
            <Button variant="contained" onClick={makePayment} disabled={paymentBlocked}>
              Pay {formatCost(payment, asset.symbol)}
              {isTxStarted === 'pay' ? (
                <CircularProgress
                  size="16px"
                  color="inherit"
                  sx={{ ml: theme.spacing(1) }}
                />
              ) : undefined}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <MessageBox type="info" show={!!txHash} loading={isTxStarted !== undefined}>
        <Typography>
          Transaction hash:&nbsp;
          <ExternalLink href={`${network?.blockExplorer}/tx/${txHash}`} target="_blank">
            {centerEllipsis(txHash || '')}
          </ExternalLink>
        </Typography>
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
