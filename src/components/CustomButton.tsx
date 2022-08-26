import { Button, useTheme } from '@mui/material';

export const CustomButton = ({children, ...props}) => {
  const theme = useTheme();
  return (
    <Button
      disableElevation
      type="submit"
      variant="contained"
      size="large"
      sx={{
        whiteSpace: 'nowrap',
        ...theme.typography.body1
      }}
      {...props}
    >
      {children}
    </Button>
  )
}