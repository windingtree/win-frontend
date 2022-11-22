import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useResponsive } from 'src/hooks/useResponsive';
import React from 'react';
import Iconify from './Iconify';

const CloseIcon = () => (
  <Iconify icon="material-symbols:expand-more-rounded" width={30} height={30} />
);

export const AccordionBox: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children
}) => {
  const isDesktop = useResponsive('up', 'md');

  if (isDesktop) {
    return <>{children}</>;
  }

  return (
    <Accordion style={{ margin: 0, boxShadow: 'none' }}>
      <AccordionSummary
        style={{ borderBottom: '1px solid #000' }}
        expandIcon={<CloseIcon />}
      >
        <Typography variant="subtitle1">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ borderBottom: '1px solid #000' }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
