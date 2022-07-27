import type { Breadcrumb } from '../components/Breadcrumbs';
import { useContext } from 'react';
import { Page, PageContent, Box, ResponsiveContext } from 'grommet';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MessageBox } from '../components/MessageBox';
import { useAppState } from '../store';
import config from '../config';

export interface PageWrapperProps {
  children?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  kind?: string;
}

export const PageWrapper = ({ children, breadcrumbs, kind }: PageWrapperProps) => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, isRightNetwork } = useAppState();

  return (
    <Page height={{ min: '75vh' }} margin={{ bottom: '1rem' }} kind={kind ?? 'narrow'}>
      <PageContent pad="none">
        <Breadcrumbs breadcrumbs={breadcrumbs} size={size} />
        <Box fill="horizontal">
          <MessageBox loading type="info" show={isConnecting}>
            The Dapp is connecting
          </MessageBox>
          <MessageBox type="warn" show={!isRightNetwork}>
            You are connected to a wrong network. Supported networks:{' '}
            {config.allowedNetworks.map((n, i) => n.name + (config.allowedNetworks.length - 1 !== i ? ', ' : ''))}
          </MessageBox>
        </Box>
        {children}
      </PageContent>
    </Page>
  );
};
