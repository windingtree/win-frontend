import { Button, SxProps } from '@mui/material';

export const ctaButtonStyle: SxProps = {
  padding: '15px 30px',
  backgroundColor: 'purple',
  color: 'white'
};

export const CtaButton = ({ children, ...props }) => {
  return (
    <Button sx={ctaButtonStyle} {...props}>
      {children}
    </Button>
  );
};
