import { alpha } from '@mui/material/styles';
import {
  Link,
  Stack,
  Tooltip,
  IconButton,
  ButtonProps,
  IconButtonProps
} from '@mui/material';

import Iconify from './Iconify';

export type Socials = {
  name: string;
  icon: string;
  socialColor: string;
  path: string;
};

type IProps = IconButtonProps & ButtonProps;

interface Props extends IProps {
  simple?: boolean;
  initialColor?: boolean;
  socials: Socials[];
}

export function SocialsButton({ socials, initialColor = false, sx, ...other }: Props) {
  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center">
      {socials.map((social) => {
        const { name, icon, path, socialColor } = social;
        return (
          <Link key={name} href={path} target="_blank" rel="noopener">
            <Tooltip title={name} placement="top">
              <IconButton
                color="inherit"
                sx={{
                  ...(initialColor && {
                    color: socialColor,
                    '&:hover': {
                      bgcolor: alpha(socialColor, 0.08)
                    }
                  }),
                  ...sx
                }}
                {...other}
              >
                <Iconify icon={icon} sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Tooltip>
          </Link>
        );
      })}
    </Stack>
  );
}
