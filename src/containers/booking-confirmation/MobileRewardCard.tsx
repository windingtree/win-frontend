import { Card, Modal, Stack, Typography, Container, styled } from '@mui/material';
import { useState } from 'react';
import Image from 'src/components/Image';

const ContainerStyle = styled(Container)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '95vw',
  backgroundColor: theme.palette.background.paper,
  padding: 0,
  borderRadius: theme.shape.borderRadius
}));

export const MobileRewardCard = ({ iconUrl, title, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Card onClick={() => setIsModalOpen(true)}>
        <Stack direction="row" m={2} spacing={2} alignItems="center">
          <Image src={iconUrl} sx={{ width: '100px', height: '100px' }} />
          <Typography variant="h4" component="h3" mt={2}>
            {title}
          </Typography>
        </Stack>
      </Card>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ContainerStyle sx={{ textAlign: 'center' }}>{children}</ContainerStyle>
      </Modal>
    </>
  );
};
