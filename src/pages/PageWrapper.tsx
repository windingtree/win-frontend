import type { Breadcrumb } from '../components/Breadcrumbs';
import { useContext } from 'react';
import { Page, PageContent, Box, ResponsiveContext } from 'grommet';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MessageBox } from '../components/MessageBox';
import { useAppState } from '../store';

export interface PageWrapperProps {
  children?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  kind?: string;
}

export const PageWrapper = ({ children, breadcrumbs, kind }: PageWrapperProps) => {
  const size = useContext(ResponsiveContext);
  const { isConnecting } = useAppState();

  return (
    <Page height={{ min: '75vh' }} margin={{ bottom: '1rem' }} kind={kind ?? 'narrow'}>
      <PageContent
        width="100%"
        pad={{ horizontal: kind && kind === 'full' ? 'none' : 'large' }}
      >
        <Breadcrumbs breadcrumbs={breadcrumbs} size={size} />
        <Box fill="horizontal">
          <MessageBox loading type="info" show={isConnecting}>
            The Dapp is connecting
          </MessageBox>
        </Box>
        {children}
      </PageContent>
    </Page>
  );
};
