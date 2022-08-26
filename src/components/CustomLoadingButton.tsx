import { LoadingButton } from '@mui/lab'
import { useTheme } from '@mui/material';

export const CustomLoadingButton = ({children, loading, onClick, ...props}) => {
  const theme = useTheme();
  return (
    <LoadingButton
      disableElevation
      type="submit"
      loading={loading}
      variant="contained"
      size="large"
      sx={{
        whiteSpace: 'nowrap',
        ...theme.typography.body1
      }}
      {...props}
      onClick={onClick}
    >
      {children}
    </LoadingButton>
  )
}
