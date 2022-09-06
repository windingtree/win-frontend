import { Button, Container, Modal, styled, Typography } from '@mui/material';

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
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <ContainerStyle maxWidth="xs">
        <Typography variant="h6" component="h3">
          Reward claimed
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
        <Button sx={{ mt: 2 }} fullWidth variant="contained" onClick={handleClose}>
          Close modal
        </Button>
      </ContainerStyle>
    </Modal>
  );
};
