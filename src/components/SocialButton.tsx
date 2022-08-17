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

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
};

type IProps = IconButtonProps & ButtonProps;

interface Props extends IProps {
  simple?: boolean;
  initialColor?: boolean;
  links?: SocialLinks;
}

export default function SocialsButton({ initialColor = false, sx, ...other }: Props) {
  const SOCIALS = [
    {
      name: 'Discord',
      icon: 'ic:outline-discord',
      socialColor: '#7289da',
      path: 'https://discord.gg/RWqqzT3Gf8'
    },
    {
      name: 'Youtube',
      icon: 'mdi:youtube',
      socialColor: '#c4302b',
      path: 'https://youtube.com/windingtree'
    },
    {
      name: 'Twitter',
      icon: 'eva:twitter-fill',
      socialColor: '#00AAEC',
      path: 'https://twitter.com/windingtree'
    }
  ];

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center">
      {SOCIALS.map((social) => {
        const { name, icon, path, socialColor } = social;
        return (
          <Link key={name} href={path}>
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
