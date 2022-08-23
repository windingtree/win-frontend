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
      name: 'Winding Tree website',
      icon: 'iconoir:www',
      socialColor: '#7289da',
      path: 'https://windingtree.com/'
    },
    {
      name: 'Blog',
      icon: 'fluent:news-16-filled',
      socialColor: '#00AAEC',
      path: 'https://blog.windingtree.com/'
    },
    {
      name: 'Discord',
      icon: 'ic:outline-discord',
      socialColor: '#7289da',
      path: 'https://discord.gg/RWqqzT3Gf8'
    },
    {
      name: 'Twitter',
      icon: 'eva:twitter-fill',
      socialColor: '#00AAEC',
      path: 'https://twitter.com/windingtree'
    },
    {
      name: 'LinkedIn',
      icon: 'akar-icons:linkedin-box-fill',
      socialColor: '#00AAEC',
      path: 'https://www.linkedin.com/company/winding-tree/'
    },
    {
      name: 'Youtube',
      icon: 'mdi:youtube',
      socialColor: '#c4302b',
      path: 'https://youtube.com/windingtree'
    },
    {
      name: 'Github',
      icon: 'akar-icons:github-fill',
      socialColor: '#c4302b',
      path: 'https://github.com/windingtree/'
    }
  ];

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center">
      {SOCIALS.map((social) => {
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
