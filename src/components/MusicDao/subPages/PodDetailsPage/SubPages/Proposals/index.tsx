import React, { useState, useEffect, useMemo } from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import SellProposalCard from 'components/MusicDao/components/Cards/SellProposalCard';
import { SellingProposalModal } from 'components/MusicDao/modals/SellingProposalModal';
import { musicDaoGetSellingProposals } from 'shared/services/API';
import { Color, Gradient, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { ProposalsStyle } from './index.styles';

const PROPOSAL_FILTERS = ['Ongoing', 'Approved', 'Failed'];

const Proposals = ({
  pod,
  podInfo,
  totalStaked,
  handleRefresh
}: {
  pod: any;
  podInfo: any;
  totalStaked: any;
  handleRefresh: any;
}) => {
  const classes = ProposalsStyle();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [isLoadingProposals, setIsLoadingProposals] =
    React.useState<boolean>(false);
  const [proposals, setProposals] = React.useState<any[]>([]);
  const [filter, setFilter] = React.useState<string>('Ongoing');

  const [openSellProposalModal, setOpenSellProposalModal] =
    useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const filteredProposals = useMemo(() => {
    return proposals.filter((item) =>
      filter === 'Approved'
        ? item.status === 'success'
        : filter === 'Failed'
        ? item.status === 'failed'
        : item.status !== 'success' && item.status !== 'failed'
    );
  }, [filter, proposals]);

  const loadData = async () => {
    const response = await musicDaoGetSellingProposals(pod.Id);
    if (response.success) {
      setProposals(response.data);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems={isMobile ? 'start' : 'center'}
        justifyContent="space-between"
        flexDirection={isMobile ? 'column' : 'row'}
        mb={2}
      >
        <Box className={classes.title} mb={isMobile ? 2 : 0}>
          Selling Proposals
        </Box>
        <PrimaryButton
          size="medium"
          onClick={() => setOpenSellProposalModal(true)}
          style={{ minWidth: '220px', background: Gradient.Green1 }}
          isRounded
        >
          Create Sell Proposal
        </PrimaryButton>
      </Box>
      <Box mb={2}>
        {PROPOSAL_FILTERS.map((item) => (
          <PrimaryButton
            size="small"
            onClick={() => setFilter(item)}
            isRounded
            style={{
              background: item === filter ? Color.White : Color.GrayLight,
              color: Color.Black
            }}
            key={`proposal-filter-${item}`}
          >
            {item}
          </PrimaryButton>
        ))}
      </Box>
      <Grid container spacing={2}>
        {filteredProposals.map((item) => (
          <Grid item xs={12} sm={6}>
            <SellProposalCard
              proposal={item}
              pod={pod}
              podInfo={podInfo}
              handleRefresh={loadData}
              totalStaked={totalStaked}
            />
          </Grid>
        ))}
      </Grid>

      <SellingProposalModal
        pod={pod}
        podInfo={podInfo}
        open={openSellProposalModal}
        handleRefresh={loadData}
        handleClose={() => setOpenSellProposalModal(false)}
      />
    </Box>
  );
};

export default Proposals;
