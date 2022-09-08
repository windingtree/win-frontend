import { Button, Container, Modal, Stack, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IconButtonAnimate } from 'src/components/animate';
import Iconify from 'src/components/Iconify';

const ContainerStyle = styled(Container)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius
}));

export const RewardModal = ({ isOpen, handleClose }) => {
  const navigate = useNavigate();

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <ContainerStyle maxWidth="xs" sx={{ textAlign: 'center' }}>
        <IconButtonAnimate
          color="primary"
          size="small"
          sx={{ position: 'absolute', right: 3, top: 3 }}
          onClick={handleClose}
        >
          <Iconify icon="eva:close-circle-outline" width={24} height={24} />
        </IconButtonAnimate>
        <Typography variant="h6" component="h3">
          Fren, you made it 🫂
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <br />
          The booking is paid ✅ <br />
          The reward is confirmed ✅ <br />
          <br />
          You know how early we are in Web 3.0. <br />
          Help us improve the experience by sharing your feedback and insights in the form
          below.
        </Typography>

        <Stack direction="row" mt={1}>
          <Button
            sx={{ mt: 2 }}
            size="large"
            fullWidth
            variant="contained"
            href="https://winwindao.typeform.com/win-feedback"
          >
            Leave feedback
          </Button>
          <Button
            sx={{ mt: 2, ml: 1 }}
            fullWidth
            size="large"
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Book next stay
          </Button>
        </Stack>
      </ContainerStyle>
    </Modal>
  );
};
