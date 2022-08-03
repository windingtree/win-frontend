import { Image, Box, Footer as BaseFooter, Anchor, ResponsiveContext } from 'grommet';
import { Youtube } from 'grommet-icons';
import { useContext } from 'react';

export const Footer = () => {
  const color = 'black';
  const size = useContext(ResponsiveContext);

  return (
    <BaseFooter
      responsive={true}
      justify="between"
      margin={{ left: 'auto', right: 'auto' }}
      pad={{ horizontal: 'small' }}
      width={{ width: '90vw' }}
      direction="row"
    >
      <Box
        direction={size === 'small' ? 'column' : 'row'}
        align="between"
        gap="1rem"
        margin={{ bottom: 'small' }}
      >
        <Anchor weight="400" color={color} href="/about" label="About" />
        <Anchor weight="400" color={color} href="/security" label="Security info" />
        <Anchor weight="400" color={color} href="/legal" label="Legal info" />
        <Anchor weight="400" color={color} href="/contacts" label="Contacts" />
        <Anchor weight="400" color={color} href="/faq" label="FAQ" />
        <Anchor weight="400" color={color} href="/developers" label="Developers" />
      </Box>
      <Box color={color} align="center" direction={size === 'small' ? 'column' : 'row'}>
        <Anchor
          color={color}
          icon={
            <Image
              src="https://raw.githubusercontent.com/windingtree/branding/master/winding-tree/svg/winding-tree-symbol-dark.svg"
              height="32px"
            />
          }
          href="https://windingtree.com"
          title="Powered by Winding Tree"
          target="_blank"
        />
        <Anchor
          icon={<Image src="/discord-logo.svg" height="32px" />}
          href="https://discord.gg/RWqqzT3Gf8"
          target="_blank"
          title="Join our Discord to Learn More"
        />
        <Anchor
          icon={<Image src="/twitter.svg" height="32px" />}
          href="https://twitter.com/windingtree"
          target="_blank"
          title="Follow Winding Tree on Twitter"
        />
        <Anchor
          icon={<Youtube size="32px" color={color} />}
          href="https://youtube.com/windingtree"
          target="_blank"
          title="Follow Winding Tree on Youtube"
        />
      </Box>
    </BaseFooter>
  );
};
