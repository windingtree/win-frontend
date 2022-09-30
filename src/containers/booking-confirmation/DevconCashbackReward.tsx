import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Client } from '@tokenscript/token-negotiator';
import '@tokenscript/token-negotiator/dist/theme/style.css';
import {
  Box,
  Button,
  Card,
  Container,
  Modal,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Image from '../../components/Image';
import { useAppState } from '../../store';
import { devconCashbackEnabled } from '../../config';
import Logger from '../../utils/logger';

const logger = Logger('DevconCashbackReward');

const ContainerStyle = styled(Container)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  padding: 4,
  borderRadius: theme.shape.borderRadius
}));

declare global {
  interface Window {
    negotiator: Client;
  }
}

enum ModalMode {
  NONE,
  ATTEST,
  SUCCESS,
  ERROR
}

const AUTH_ERROR_STR =
  'There was an error during Authentication. Please refer to the error message below for more details: ';

export const DevconCashbackReward = () => {
  const { provider } = useAppState();
  const location = useLocation();
  const [params] = useSearchParams();
  const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.NONE);
  const [ticket, setTicket] = useState<null | Record<string, unknown>>(null);
  const [error, setError] = useState<{ message: string; detail: string }>({
    message: '',
    detail: ''
  });

  const showError = (message: string, detail: string) => {
    const err = { message: message, detail: detail };
    setError(err);
    setModalMode(ModalMode.ERROR);
    logger.debug(err);
  };

  const sendCashbackRequest = useCallback(
    async (data: { proof: string }) => {
      try {
        const chainId = provider?.network.chainId.toString();
        const verifyRequest = {
          perkId: 'windingTree',
          useTicket: data.proof,
          chainId: chainId ?? '-1',
          requestData: {
            offerId: params.get('offerId'),
            transactionHash: params.get('tx')
          }
        };
        logger.debug('Attestation request', verifyRequest);

        const res = await fetch(
          'https://attestation-verify.tokenscript.org/attestation-verification',
          {
            method: 'POST',
            headers: [['Content-Type', 'application/json']],
            body: JSON.stringify(verifyRequest)
          }
        );
        logger.debug('Attestation response', res);

        if (res.status < 200 || res.status > 299) {
          const body = await res.text();

          throw new Error(
            'Attestation validation failed: ' + (body ? body : res.statusText)
          );
        }
      } catch (e) {
        showError(AUTH_ERROR_STR, e.message);
        return;
      }

      setModalMode(ModalMode.SUCCESS);
    },
    [params, provider]
  );

  useEffect(() => {
    if (window.negotiator instanceof Client) {
      // preventing of re-initialization
      return;
    }

    window.negotiator = new Client({
      type: 'active',
      uiOptions: {
        openingHeading: 'Validate your Devcon ticket ownership to apply for cashback',
        issuerHeading: 'Your tickets'
      },
      issuers: [
        {
          collectionID: 'devcon',
          onChain: false,
          title: 'Devcon Test Ticket',
          image: 'https://devconnect.smarttokenlabs.com/img/devconNFT.svg',
          tokenOrigin: 'https://stage-perks.smarttokenlabs.com/outlet.html',
          base64senderPublicKeys: {
            '6': 'MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////////////////////////////////////v///C8wRAQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBEEEeb5mfvncu6xVoGKVzocLBwKb/NstzijZWfKBWxb4F5hIOtp3JqPEZV2k+/wOEQio/Re0SKaFVBmcR9CP+xDUuAIhAP////////////////////66rtzmr0igO7/SXozQNkFBAgEBA0IABGMxHraqggr2keTXszIcchTjYjH5WXpDaBOYgXva82mKcGnKgGRORXSmcjWN2suUCMkLQj3UNlZCFWF10wIrrlw='
          },
          base64attestorPubKey:
            'MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////////////////////////////////////v///C8wRAQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBEEEeb5mfvncu6xVoGKVzocLBwKb/NstzijZWfKBWxb4F5hIOtp3JqPEZV2k+/wOEQio/Re0SKaFVBmcR9CP+xDUuAIhAP////////////////////66rtzmr0igO7/SXozQNkFBAgEBA0IABL+y43T1OJFScEep69/yTqpqnV/jzONz9Sp4TEHyAJ7IPN9+GHweCX1hT4OFxt152sBN3jJc1s0Ymzd8pNGZNoQ='
        }
      ]
    });
    logger.debug('Negotiator initialized', window.negotiator);

    window.negotiator.on(
      'tokens-selected',
      (tokens: { selectedTokens: { tokens: unknown[] } }) => {
        if (tokens.selectedTokens?.['devcon']?.tokens?.length > 0) {
          setModalMode(ModalMode.ATTEST);
          setTicket(tokens.selectedTokens['devcon']?.tokens[0]);
        } else {
          showError(
            "Looks like you don't have Devcon tickets, ensure you have opened your Devcon magic link in this browser.",
            ''
          );
        }
      }
    );

    window.negotiator.on(
      'token-proof',
      (proof: { error: string; data: { proof: string }; issuer: string }) => {
        if (proof.error) {
          showError(AUTH_ERROR_STR, proof.error);
          return;
        }
        sendCashbackRequest(proof.data);
      }
    );
  });

  if (!devconCashbackEnabled || location.hash !== '#devcon') {
    return null;
  }

  return (
    <>
      <Card
        elevation={5}
        sx={{
          p: 3,
          position: 'relative',
          marginBottom: '50px'
        }}
      >
        <Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }}>
            <Stack direction="column" mb={2} alignItems={{ xs: 'center', sm: 'left' }}>
              <Image
                src="/images/stl/stl-logo.png"
                sx={{ width: '150px', height: 'auto' }}
                padding="20px"
              />
            </Stack>
            <Stack direction="column" mb={2} alignItems="left">
              <Typography
                variant="h4"
                component="h3"
                mt={2}
                style={{ marginBottom: '20px' }}
              >
                Claim $50 Cashback using BrandConnector
              </Typography>
              <ul style={{ marginBottom: '10px' }}>
                <li>Limited to 100 users</li>
                <li>$50 USD max</li>
              </ul>
              <small>
                Read more about BrandConnector{' '}
                <a href="https://brandconnector.io/" target="_blank" rel="noreferrer">
                  here
                </a>
              </small>
            </Stack>
          </Stack>

          <Box>
            <LoadingButton
              variant="contained"
              size="large"
              fullWidth
              onClick={() => {
                window.negotiator.negotiate(undefined, true);
              }}
              sx={{
                mt: 1,
                marginTop: '50px',
                bottom: 3,
                marginLeft: 'auto',
                marginRight: 'auto',
                left: '0',
                right: '0'
              }}
            >
              Claim
            </LoadingButton>
          </Box>
        </Stack>
      </Card>
      <Modal open={modalMode > ModalMode.NONE}>
        <ContainerStyle maxWidth="xs" sx={{ textAlign: 'center' }}>
          {modalMode === ModalMode.ATTEST && (
            <>
              <Stack direction="column" mb={2} alignItems={{ xs: 'center', sm: 'left' }}>
                <Image
                  src="/images/stl/email-icon.png"
                  sx={{ width: '120px', height: 'auto' }}
                  padding="10px"
                />
              </Stack>
              <Typography sx={{ mt: 1 }}>
                In order to get Cashback, you need to get an email attestation to prove
                ticket ownership. Note, that your email address will be stored in your
                local storage only. This is fully decentralized.
              </Typography>

              <Stack direction="row" mt={1}>
                <Button
                  sx={{ mt: 2 }}
                  size="large"
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setModalMode(ModalMode.NONE);
                    window.negotiator.authenticate({
                      issuer: 'devcon',
                      unsignedToken: ticket
                    });
                  }}
                >
                  Prove Ticket Ownership
                </Button>
              </Stack>
            </>
          )}

          {modalMode === ModalMode.SUCCESS && (
            <>
              <Stack direction="column" mb={2} alignItems={{ xs: 'center', sm: 'left' }}>
                <Image
                  src="/images/stl/tick-icon.png"
                  sx={{ width: '120px', height: 'auto' }}
                  padding="10px"
                />
              </Stack>

              <Typography sx={{ mt: 1 }}>
                Request successful! After Devcon week you will receive $50 USD worth of
                Ethereum at your address.
              </Typography>

              <Stack direction="row" mt={1}>
                <Button
                  sx={{ mt: 2 }}
                  size="large"
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setModalMode(ModalMode.NONE);
                  }}
                >
                  Close
                </Button>
              </Stack>
            </>
          )}

          {modalMode === ModalMode.ERROR && (
            <>
              <Stack direction="column" mb={2} alignItems={{ xs: 'center', sm: 'left' }}>
                <Image
                  src="/images/stl/error-icon.png"
                  sx={{ width: '120px', height: 'auto' }}
                  padding="10px"
                />
              </Stack>

              <Typography sx={{ mt: 1 }}>
                {error.message}
                <br />
                <br />
                {error.detail}
              </Typography>

              <Stack direction="row" mt={1}>
                <Button
                  sx={{ mt: 2 }}
                  size="large"
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setModalMode(ModalMode.NONE);
                  }}
                >
                  Close
                </Button>
              </Stack>
            </>
          )}
        </ContainerStyle>
      </Modal>
      <div className="overlay-tn"></div>
    </>
  );
};
