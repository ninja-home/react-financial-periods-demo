import Box from '@mui/material/Box';
import React, { PropsWithChildren } from 'react';
import Header from '../components/Header';

/**
 * MainLayout is using on the all pages
 */
const MainLayout: React.FC<PropsWithChildren<{}>> = ({children}) => {
  return (
    <Box component={'div'}>
      <Header />
      <Box m={10}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;