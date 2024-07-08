import React from 'react';
import { useHistory } from 'react-router-dom';

import { Gradient, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';

import { profileNotFoundPageStyles } from './index.styles';

export default function ProfileNotFound() {
  const classes = profileNotFoundPageStyles();
  const history = useHistory();

  return (
    <Box className={classes.content}>
      <Box className={classes.background}>
        <Box className={classes.title} mt={6}>
          oops... <span>user not found</span>
        </Box>
        <Box className={classes.description} mt={2} mb={6}>
          Looks like the user you are looking for does not exist
        </Box>
        <PrimaryButton
          onClick={() => history.push('/')}
          size="medium"
          isRounded
          style={{
            background: Gradient.Green1,
            textTransform: 'uppercase',
            paddingLeft: 48,
            paddingRight: 48
          }}
        >
          go to homepage
        </PrimaryButton>
      </Box>
      {/* <Footer /> */}
    </Box>
  );
}
