import React from 'react';
import { useHistory } from 'react-router-dom';
import Box from 'shared/ui-kit/Box';
import { ChevronIconLeft } from 'shared/ui-kit/Icons';
import { headerStyles } from './index.styles';

const Header = ({ cardHidden }) => {
  const classes = headerStyles();
  const history = useHistory();

  return (
    <Box width={1}>
      <Box className={classes.headerBox} zIndex={1}>
        <img
          src={require('assets/logos/MYX_logo_3.svg')}
          className={classes.logo}
        />
      </Box>
    </Box>
  );
};

export default Header;
