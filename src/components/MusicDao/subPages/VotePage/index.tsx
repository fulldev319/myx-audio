import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Axios from 'axios';

import Pagination from '@material-ui/lab/Pagination';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import Box from 'shared/ui-kit/Box';
import URL from 'shared/functions/getURL';
import CreateNewVoteModal from 'components/MusicDao/modals/CreateNewVoteModal';
import { PrimaryButton } from 'shared/ui-kit';
import VoteCard from '../../components/Cards/VoteCard';
import { ArrowIcon, DiscussionIcon } from '../../components/Icons/SvgIcons';
import { voteSubPageStyles } from './index.styles';
import { useGovernanceStyles } from '../GovernancePage/styles';
import CustomPopup from '../../components/CustomPopup';

import { ReactComponent as TopRigthArrowIcon } from 'assets/icons/top_right_arrow.svg';
import { ReactComponent as HotIcon } from 'assets/icons/whh_hot.svg';
import { ReactComponent as CircleCheckedIcon } from 'assets/icons/circle_checked.svg';
import { ReactComponent as ClockIcon } from 'assets/icons/clock.svg';

const sortByOptions = ['New', 'Top', 'Hot', 'Closed'];
const sortByCurrencyOptions = ['Cryptocurrency', 'Currency'];

const PAGE_SZIE = 10;

export default function VotePage() {
  const params: any = useParams();

  const commonClasses = useGovernanceStyles();
  const classes = voteSubPageStyles();
  const history = useHistory();

  const theme = useTheme();
  const isLgTablet = useMediaQuery('(min-width: 1400px)');
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery('(max-width: 700px)');

  const [votes, setVotes] = useState<any[]>([]);
  const [loadingVotes, setLoadingVotings] = useState<boolean>(false);

  const [filter, setFilter] = useState<string>('newest');
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [sortByOptionsSelection, setSortByOptionsSelection] = useState<string>(
    sortByOptions[0]
  );
  const [sortByCurrencyOptionsSelection, setSortByCurrencyOptionsSelection] =
    useState<string>(sortByCurrencyOptions[0]);

  const [openCreateNewVoteModal, setOpenCreateNewVoteModal] =
    useState<boolean>(false);

  useEffect(() => {
    setLoadingVotings(true);
    const body = {
      pagination: pageNumber,
      filter: filter
    };
    Axios.post(`${URL()}/musicDao/governance/getPolls`, body)
      .then((res) => {
        const data = res.data;
        if (data.success) {
          setVotes((prev) => [...prev, ...data.data.polls]);
          if (totalCount === 0) {
            setTotalCount(data.data.totalCount);
          }
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setLoadingVotings(false));
  }, [pageNumber, filter]);

  const filteredVotes = React.useMemo(() => {
    let filteredData = [...votes];
    // set filter options on vote list
    return filteredData;
  }, [votes]);

  return (
    <div className={classes.content}>
      <Box width="100%" height="100%" className={classes.gradient} />
      <div className={classes.headerTitle}>
        <div className={classes.headerBack} onClick={() => history.goBack()}>
          <Box color="#FFFFFF">
            <ArrowIcon />
          </Box>
          <Box color="#FFFFFF" fontSize={14} fontWeight={700} ml="5px" mb="4px">
            BACK
          </Box>
        </div>
        <div className={classes.headerMainTitle}>All Polls</div>
        <div className={classes.headerButtonSection}>
          <PrimaryButton
            size="medium"
            className={commonClasses.iconButton}
            onClick={() => setOpenCreateNewVoteModal(true)}
          >
            New discussion
            <DiscussionIcon />
          </PrimaryButton>
        </div>
      </div>
      <div className={classes.filterSection}>
        <Box className={classes.optionSection}>
          {sortByOptions.map((item, index) => (
            <Box
              key={index}
              className={
                item === sortByOptionsSelection
                  ? classes.selectedButtonBox
                  : classes.buttonBox
              }
              mr={1}
              onClick={() => setSortByOptionsSelection(item)}
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
            items={sortByCurrencyOptions}
            label={'Post type'}
            onSelect={setSortByCurrencyOptionsSelection}
            value={sortByCurrencyOptionsSelection}
            theme="dark"
          />
        </div>
      </div>
      <LoadingWrapper loading={loadingVotes}>
        <Grid
          container
          spacing={4}
          wrap="wrap"
          style={{ justifyContent: 'center' }}
        >
          {filteredVotes
            .filter(
              (_, index) =>
                index >= (pageNumber - 1) * PAGE_SZIE &&
                index < pageNumber * PAGE_SZIE
            )
            .map((item, index) => (
              <Grid
                key={`poll-card-${index}`}
                item
                md={isMobile ? 12 : isTablet ? 6 : !isLgTablet ? 4 : 3}
              >
                <VoteCard
                  item={item}
                  podId={params.podId}
                  key={`item-${index}`}
                />
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
      {openCreateNewVoteModal && (
        <CreateNewVoteModal
          open={openCreateNewVoteModal}
          handleClose={() => setOpenCreateNewVoteModal(false)}
          postCreated={(vote) => {
            setVotes((prev) => [vote, ...prev]);
          }}
        />
      )}
    </div>
  );
}
