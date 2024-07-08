import React from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import Box from 'shared/ui-kit/Box';
import { createCollaborativeProposalModalStyle } from '../../index.styles';

const Intro = ({ pod }) => {
  const classes = createCollaborativeProposalModalStyle();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <Box className={classes.intro}>
      <h3 className={classes.heading}>Create Capsule Proposal</h3>
      <Box display={'flex'} alignItems={'center'} mb={2}>
        <Box className={classes.proposalTypeItem}>
          <img
            src={require('assets/musicDAOImages/pod_proposal_music_icon.webp')}
            style={{ width: 140, marginLeft: -20, marginTop: -11 }}
            alt={'music pod'}
          />
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          ml={isMobile ? 1.5 : 3}
          flex={1}
        >
          <Box className={classes.typo1}>Music</Box>
          <Box className={classes.typo2}>Add the music details</Box>
        </Box>
      </Box>
      {pod.WithFunding && (
        <Box display={'flex'} alignItems={'center'} my={4}>
          <Box className={classes.proposalTypeItem}>
            <img
              src={require('assets/musicDAOImages/pod_proposal_token_icon.webp')}
              style={{ width: 200, marginLeft: -34, marginTop: -18 }}
              alt={'music pod'}
            />
          </Box>
          <Box
            display={'flex'}
            flexDirection={'column'}
            ml={isMobile ? 1.5 : 3}
            flex={1}
          >
            <Box className={classes.typo1}>Tokenomics</Box>
            <Box className={classes.typo2}>
              Customize media fractions and fundraise details
            </Box>
          </Box>
        </Box>
      )}
      <Box display={'flex'} alignItems={'center'}>
        <Box className={classes.proposalTypeItem}>
          <img
            src={require('assets/musicDAOImages/pod_proposal_distribution_icon.webp')}
            style={{ width: 88, marginLeft: 19, marginTop: 14 }}
            alt={'music pod'}
          />
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          ml={isMobile ? 1.5 : 3}
          flex={1}
        >
          <Box className={classes.typo1}>Distribution</Box>
          <Box className={classes.typo2}>
            {pod.WithFunding
              ? 'Select what % each collaborator and investors receive'
              : 'Select what % each collaborator receive'}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Intro;
