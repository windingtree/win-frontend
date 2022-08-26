import { useParams } from 'react-router-dom';
import { Container, Grid, Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainLayout from 'src/layouts/main';
import { ExternalLink } from '../components/ExternalLink';
import { useAppState } from '../store';

export const BigBox = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        padding: theme.spacing(3),
        backgroundColor: '#a05dff',
        color: 'white',
        height: '100%',
        cursor: 'pointer',
        textAlign: 'center'
      }}
      elevation={2}
      {...props}
    >{children}</Paper>
  );
};

export const BookingConfirmation = () => {
  const theme = useTheme();
  const { tx } = useParams();
  const { selectedNetwork } = useAppState();

  return (
    <MainLayout>
      <Container>
        <Box
          sx={{ marginBottom: theme.spacing(5) }}
        >
          <Box
            sx={{ marginBottom: theme.spacing(3) }}
          >
            <Typography variant='h4' marginBottom={theme.spacing(1)}>
              Your <ExternalLink href={`${selectedNetwork?.blockExplorer}/tx/${tx}`} target="_blank">
              transaction
              </ExternalLink> was successful 🥳
            </Typography>
            <Typography variant='h4'>
              Your booking confirmation will be sent by email
            </Typography>
          </Box>
          <Typography variant='body1'>
            Thank you for booking using win.so!
          </Typography>
          <Typography variant='body1'>
            We have reduced xx CO2 emissions so far and we are counting 💚
          </Typography>
          <Typography variant='body1'>
            Please redeem one of these Giveaways
          </Typography>
        </Box>
        <Grid
          container
          spacing={1}
          alignItems='stretch'
          maxWidth={500}
          marginBottom={theme.spacing(5)}
        >
          <Grid item xs={12} md={6}>
            <BigBox onClick={() => {/**/}}>
              Give back 10% of your booking value to offset CO2 emissions
            </BigBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <BigBox onClick={() => {/**/}}>
              Take 10% of your booking value back in crypto
            </BigBox>
          </Grid>
        </Grid>

        <Box marginBottom={theme.spacing(5)}>
          <Typography>
            You will be able to redeem this Giveaway after your hotel check out.
          </Typography>
          <Typography>
            win.so will notify you via email once the transaction is in your wallet!
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  );
};
