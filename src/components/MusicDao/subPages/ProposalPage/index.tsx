import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';

import URL from 'shared/functions/getURL';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import Box from 'shared/ui-kit/Box';
import { PrimaryButton } from 'shared/ui-kit';
import CreateNewProposalModal from 'components/MusicDao/modals/CreateNewProposalModal';
import CustomPopup from '../../components/CustomPopup';
import ProposalCard from '../../components/Cards/ProposalCard';
import { ArrowIcon, DiscussionIcon } from '../../components/Icons/SvgIcons';
import { useGovernanceStyles } from '../GovernancePage/styles';
import { proposalSubPageStyles } from './index.styles';

import { ReactComponent as TopRigthArrowIcon } from 'assets/icons/top_right_arrow.svg';
import { ReactComponent as HotIcon } from 'assets/icons/whh_hot.svg';
import { ReactComponent as CircleCheckedIcon } from 'assets/icons/circle_checked.svg';
import { ReactComponent as ClockIcon } from 'assets/icons/clock.svg';

const filterOptions = ['New', 'Top', 'Hot', 'Closed'];
const sortByOptions = ['Newest', 'Most Voted', 'Popular'];
const sortByPageOptions = ['9 per page', '18 per page'];

const PAGE_SZIE = 10;

export default function ProposalPage() {
  const commonClasses = useGovernanceStyles();
  const classes = proposalSubPageStyles();
  const history = useHistory();

  const [proposals, setProposals] = useState<any[]>([]);
  const [loadingProposals, setLoadingProposals] = useState<boolean>(false);

  const theme = useTheme();
  const isLgTablet = useMediaQuery('(min-width: 1400px)');
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery('(max-width: 700px)');

  const [filterOptionsSelection, setFilterOptionsSelection] = useState<string>(
    filterOptions[0]
  );
  const [sortByOptionsSelection, setSortByOptionsSelection] = useState<string>(
    sortByOptions[0]
  );
  const [sortByPageOptionsSelection, setSortByPageOptionsSelection] =
    useState<string>(sortByPageOptions[0]);

  const [filter, setFilter] = useState<string>('newest');
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [openCreateNewProposalModal, setOpenCreateNewProposalModal] =
    useState<boolean>(false);

  useEffect(() => {
    setLoadingProposals(true);
    const body = {
      pagination: pageNumber,
      filter: filter
    };
    Axios.post(`${URL()}/musicDao/governance/getDaoProposals`, body)
      .then((res) => {
        const data = res.data;
        if (data.success) {
          setProposals(data.data.proposals);
          if (totalCount === 0) {
            setTotalCount(data.data.totalCount);
          }
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setLoadingProposals(false));
  }, [pageNumber, filter]);

  const filteredProposals = React.useMemo(() => {
    let filteredData = [...proposals];
    // set filter options on vote list
    return filteredData;
  }, [proposals]);

  return (
    <div className={classes.content}>
      <img
        src={require('assets/musicDAOImages/background.webp')}
        width="100%"
        height="100%"
        className={classes.gradient}
      />
      <div className={classes.headerTitle}>
        <div className={classes.headerBack} onClick={() => history.goBack()}>
          <Box color="#FFFFFF">
            <ArrowIcon />
          </Box>
          <Box color="#FFFFFF" fontSize={14} fontWeight={700} ml="5px" mb="4px">
            BACK
          </Box>
        </div>
        <div className={classes.headerMainTitle}>All Dao Proposals</div>
        <div className={classes.headerButtonSection}>
          <PrimaryButton
            size="medium"
            className={commonClasses.iconButton}
            onClick={() => setOpenCreateNewProposalModal(true)}
          >
            New discussion
            <DiscussionIcon />
          </PrimaryButton>
        </div>
      </div>
      <Box className={classes.filterSection}>
        <Box className={classes.flexBox}>
          {filterOptions.map((item, index) => (
            <Box
              key={index}
              className={
                item === filterOptionsSelection
                  ? classes.selectedButtonBox
                  : classes.buttonBox
              }
              mr={1}
              onClick={() => setFilterOptionsSelection(item)}
            >
              <Box className={classes.flexBox}>
                {index === 0 ? (
                  <ClockIcon style={{ width: '13px' }} />
                ) : index === 1 ? (
                  <TopRigthArrowIcon />
                ) : index === 2 ? (
                  <HotIcon />
                ) : (
                  <CircleCheckedIcon />
                )}
              </Box>
              <Box className={classes.header2} ml={1}>
                {item}
              </Box>
            </Box>
          ))}
        </Box>
        <div className={classes.filterPopMenu}>
          <CustomPopup
            items={sortByOptions}
            label={'Post type'}
            onSelect={setSortByOptionsSelection}
            value={sortByOptionsSelection}
          />
          {/* <div style={{ marginLeft: 80 }}>
            <CustomPopup
              items={sortByPageOptions}
              label={"Post type"}
              onSelect={setSortByPageOptionsSelection}
              value={sortByPageOptionsSelection}
            />
          </div> */}
        </div>
      </Box>
      <LoadingWrapper loading={loadingProposals}>
        <Grid container spacing={4} wrap="wrap">
          {filteredProposals
            .filter(
              (_, index) =>
                index >= (pageNumber - 1) * PAGE_SZIE &&
                index < pageNumber * PAGE_SZIE
            )
            .map((item, index) => (
              <Grid key={`poll-card-${index}`} item md={!isLgTablet ? 4 : 3}>
                <ProposalCard item={item} key={`item-${index}`} />
              </Grid>
            ))}
        </Grid>
        <div className={classes.pagination}>
          <Pagination
            count={
              (totalCount - (totalCount % PAGE_SZIE)) / PAGE_SZIE +
              (totalCount % PAGE_SZIE > 0 ? 1 : 0)
            }
            onChange={(_, page) => setPageNumber(page)}
          />
        </div>
      </LoadingWrapper>
      {openCreateNewProposalModal && (
        <CreateNewProposalModal
          open={openCreateNewProposalModal}
          handleClose={() => setOpenCreateNewProposalModal(false)}
          postCreated={(proposal) => {
            setProposals((prev) => [proposal, ...(prev || [])]);
          }}
        />
      )}
    </div>
  );
}
