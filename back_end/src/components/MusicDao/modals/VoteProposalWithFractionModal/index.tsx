import React from 'react';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import styled from 'styled-components';
import { useVoteProposalWithFractionModalStyles } from './index.styles';

const VoteProposalWithFractionModal = (props) => {
  const classes = useVoteProposalWithFractionModalStyles();

  const { open, onClose } = props;

  return (
    <Modal
      size="daoMedium"
      isOpen={open}
      onClose={onClose}
      className={classes.root}
      showCloseIcon
    >
      <Box className={classes.title} textAlign="center">
        Voting with Media Fractions
      </Box>
      <Box className={classes.text1} textAlign="center">
        Each media fractions give you oportunity to vote
      </Box>
      <Box className={classes.divider} mt={7} mb={5} />
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Box className={classes.text2} textAlign="center">
            Quorum Required
          </Box>
          <Box className={classes.title} textAlign="center">
            400.00 TKN
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.secondGrid}>
          <Box className={classes.text2} textAlign="center">
            Quorum Reached
          </Box>
          <Box className={classes.title} textAlign="center">
            44%
          </Box>
        </Grid>
      </Grid>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={4}
      >
        <ProgressBar
          percentage={80}
          containerColor="#DAE6E5"
          barColor="#65CB63"
        >
          <Box className={classes.progressTitle} pl={3}>
            <Box fontSize={14} fontWeight={600} color="white">
              Yes
            </Box>
          </Box>
        </ProgressBar>
        <Box className={classes.text2} ml={1.5}>
          40%
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={4}
      >
        <ProgressBar
          percentage={30}
          containerColor="#DAE6E5"
          barColor="#F74484"
        >
          <Box className={classes.progressTitle} pl={3}>
            <Box fontSize={14} fontWeight={600} color="white">
              No
            </Box>
          </Box>
        </ProgressBar>
        <Box className={classes.text2} ml={1.5}>
          10%
        </Box>
      </Box>
      <Box className={classes.divider} mt={7} mb={3} />
      <Box className={classes.box} mb={3}>
        <Box className={classes.text3} mb={1}>
          Available MEDIA FRACTIONS
        </Box>
        <Box className={classes.text3} style={{ color: '#1ABB00' }}>
          2255
        </Box>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Box className={classes.token}>
            <img
              src={require('assets/tokenImages/MUSIC1.webp')}
              alt="trax"
              width={29}
              height={29}
            />
            <input />
            <span>5% Vote</span>
          </Box>
          <Box
            fontSize={14}
            color="#65CB63"
            fontWeight={600}
            textAlign="end"
            pr={1}
            mt={1}
          >
            USE MAX
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select className={classes.select}>
            <MenuItem value={1}>Yes</MenuItem>
            <MenuItem value={0}>No</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="space-between" mt={7}>
        <SecondaryButton className={classes.button} size="medium">
          Cancel
        </SecondaryButton>
        <PrimaryButton
          className={classes.button}
          size="medium"
          style={{ backgroundColor: '#65CB63' }}
        >
          Place a vote
        </PrimaryButton>
      </Box>
    </Modal>
  );
};

export default VoteProposalWithFractionModal;

export type ProgressBarProps = React.PropsWithChildren<{
  percentage: number;
  containerColor?: string;
  barColor?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}>;

const ProgressBar = styled.div<ProgressBarProps>`
  position: relative;
  background: ${(props) => props.containerColor || 'transparent'};
  border-radius: ${(props) => props.borderRadius || 32}px;
  width: ${(props) =>
    props.width
      ? typeof props.width === 'string'
        ? props.width
        : `${props.width}px`
      : '100%'};
  height: ${(props) =>
    props.height
      ? typeof props.height === 'string'
        ? props.height
        : `${props.height}px`
      : '40px'};
  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: ${(props) => props.percentage || 0}%;
    background: ${(props) => props.barColor || 'transparent'};
    border-radius: inherit;
  }
`;
