import { Card, Typography, Button, Modal, Stack, CardContent } from '@mui/material';
import { useMemo } from 'react';
import { Cookies, useAllowedCookies } from '../hooks/useAllowedCookies';

export const CookieBox = () => {
  const { allowedCookies, setAllowedCookies } = useAllowedCookies();
  const open = useMemo(() => allowedCookies === undefined, [allowedCookies]);

  return (
    <Modal open={open}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          m: 3,
          position: 'absolute',
          bottom: 0,
          right: 0
        }}
      >
        <CardContent>
          <Stack spacing={1} maxWidth={{ xs: '100vw', md: '70vw' }}>
            <Typography variant="subtitle1">
              This website uses cookies to ensure you get the best experience on our
              website.
            </Typography>
            <Typography variant="body2">
              We and selected partners use cookies or similar technologies to ensure you
              get the best experience on win.so. With respect to cookies that are not
              considered necessary (as specified in the Cookie Policy, we and our selected
              partners may use cookies for the following purposes: personalized website
              experience, develop and improve products and in some cases targeted
              advertisement that are based on your interests. You can manage or disable
              cookies by clicking on “Manage cookies” at the bottom of each website page.
            </Typography>
          </Stack>
        </CardContent>
        <CardContent>
          <Stack
            spacing={1}
            sx={{
              display: 'flex',
              direction: { xs: 'row', md: 'column' },
              justifyContent: 'center'
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setAllowedCookies(Cookies.all);
              }}
            >
              Accept all
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setAllowedCookies(Cookies.essential);
              }}
            >
              Accept only essential
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Modal>
  );
};
