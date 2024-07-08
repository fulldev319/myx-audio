import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import DiscussionCard from 'components/MusicDao/components/DiscussionCard';
import CreateNewDiscussion from 'components/MusicDao/modals/CreateNewDiscussion';
import CreateNewProposalModal from 'components/MusicDao/modals/CreateNewProposalModal';
import CreateNewVoteModal from 'components/MusicDao/modals/CreateNewVoteModal';
import VoteCard from 'components/MusicDao/components/Cards/VoteCard';
import ProposalCard from 'components/MusicDao/components/Cards/ProposalCard';

import URL from 'shared/functions/getURL';
import { Color, FontSize, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import Box from 'shared/ui-kit/Box';
import { Text } from '../../components/ui-kit';
import {
  ArrowLeftIcon,
  CheckIcon,
  DiscussionIcon,
  DropDownIcon,
  useGovernanceStyles
} from './styles';

const SortType = [
  { value: 'newest', name: 'Newest post' },
  { value: 'recent', name: 'Recent post' }
];

const PostType = [
  { value: 'crypto', name: 'Cryptocurrencyt' },
  { value: 'crypto1', name: 'Cryptocurrencyt1' }
];

export default function Home() {
  const commonClasses = useGovernanceStyles();
  const history = useHistory();

  const theme = useTheme();
  const isLgTablet = useMediaQuery('(min-width: 1400px)');
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery('(max-width: 700px)');

  const [sortType, setSortType] = useState(SortType[0].value);
  const [postType, setPostType] = useState(PostType[0].value);

  const [loading, setLoading] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);

  const [openCreateNewDiscussionModal, setOpenCreateNewDiscussionModal] =
    useState<boolean>(false);
  const [openCreateNewProposalModal, setOpenCreateNewProposalModal] =
    useState<boolean>(false);
  const [openCreateNewVoteModal, setOpenCreateNewVoteModal] =
    useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    Axios.get(`${URL()}/musicDao/governance/mainPage/getInfo`)
      .then((res) => {
        const data = res.data;
        if (data.success) {
          setDiscussions(data.data.discussions);
          setPolls(data.data.polls);
          setProposals(data.data.proposals);
          setLoading(false);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  const handleSortTypeChange = (e) => {
    setSortType(e.target.value);
  };

  const handlePostTypeChange = (e) => {
    setPostType(e.target.value);
  };

  return (
    <Box position="relative">
      <div className={commonClasses.headerImage}>
        <img
          src={require('assets/musicDAOImages/background.webp')}
          width="100%"
          height="100%"
        />
      </div>
      <div className={commonClasses.content}>
        <LoadingWrapper loading={loading}>
          <div className={commonClasses.headerTitle}>Governance</div>
          <div className={commonClasses.filterSection}>
            <div className={commonClasses.headerSubTitle}>Discussion</div>
            <Box display="flex" flexDirection="row" alignItems="center">
              {!isMobile && (
                <>
                  <div className={commonClasses.filterItem}>
                    <Box
                      className={commonClasses.header2}
                      color={Color.White}
                      mr={1}
                    >
                      Sort by
                    </Box>
                    <Select
                      className={commonClasses.select}
                      IconComponent={DropDownIcon}
                      value={sortType}
                      onChange={handleSortTypeChange}
                    >
                      {SortType.map((sort, index) => (
                        <MenuItem
                          key={`discussion-sort-${index}`}
                          value={sort.value}
                        >
                          <Box
                            className={commonClasses.header2}
                            color={Color.MusicDAODark}
                          >
                            {sort.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div className={commonClasses.filterItem}>
                    <Box
                      className={commonClasses.header2}
                      color={Color.White}
                      mr={1}
                    >
                      Post type
                    </Box>
                    <Select
                      className={commonClasses.select}
                      IconComponent={DropDownIcon}
                      value={postType}
                      onChange={handlePostTypeChange}
                    >
                      {PostType.map((post, index) => (
                        <MenuItem
                          key={`discussion-post-${index}`}
                          value={post.value}
                        >
                          <Box
                            className={commonClasses.header2}
                            color={Color.MusicDAODark}
                          >
                            {post.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </>
              )}
              <PrimaryButton
                size="medium"
                className={commonClasses.iconButton}
                onClick={() => setOpenCreateNewDiscussionModal(true)}
              >
                New discussion
                <DiscussionIcon />
              </PrimaryButton>
            </Box>
          </div>
          {isMobile && (
            <div className={commonClasses.filterSection}>
              <div className={commonClasses.filterItem}>
                <Box
                  className={commonClasses.header2}
                  color={Color.White}
                  mr={1}
                >
                  Sort by
                </Box>
                <Select
                  className={commonClasses.select}
                  IconComponent={DropDownIcon}
                  value={sortType}
                  onChange={handleSortTypeChange}
                >
                  {SortType.map((sort, index) => (
                    <MenuItem
                      key={`discussion-sort-${index}`}
                      value={sort.value}
                    >
                      <Box
                        className={commonClasses.header2}
                        color={Color.MusicDAODark}
                      >
                        {sort.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className={commonClasses.filterItem}>
                <Box
                  className={commonClasses.header2}
                  color={Color.White}
                  mr={1}
                >
                  Post type
                </Box>
                <Select
                  className={commonClasses.select}
                  IconComponent={DropDownIcon}
                  value={postType}
                  onChange={handlePostTypeChange}
                >
                  {PostType.map((post, index) => (
                    <MenuItem
                      key={`discussion-post-${index}`}
                      value={post.value}
                    >
                      <Box
                        className={commonClasses.header2}
                        color={Color.MusicDAODark}
                      >
                        {post.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
          )}
          <Box display="flex" flexDirection="column" mt={4}>
            {discussions.map((discussion, index) => (
              <DiscussionCard
                key={`discussion-card-${index}`}
                discussion={discussion}
              />
            ))}
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              mt={4}
            >
              <SecondaryButton
                className={commonClasses.showAll}
                size="medium"
                radius={29}
                onClick={() => history.push('/governance/all_discussions')}
              >
                Show All
                <Box
                  position="absolute"
                  flexDirection="row"
                  top={0}
                  right={0}
                  pr={2}
                >
                  <ArrowLeftIcon />
                </Box>
              </SecondaryButton>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            mt={7}
            mb={5}
          >
            <Text size={FontSize.XXL} bold>
              Polls
            </Text>
            <PrimaryButton
              size="medium"
              className={commonClasses.iconButton}
              onClick={() => setOpenCreateNewVoteModal(true)}
            >
              New vote
              <CheckIcon />
            </PrimaryButton>
          </Box>
          {polls && (
            <>
              <Grid container spacing={4} wrap="wrap">
                {polls
                  .filter((_, index) =>
                    isMobile
                      ? index < 1
                      : isTablet
                      ? index < 2
                      : !isLgTablet
                      ? index < 3
                      : index < 4
                  )
                  .map((poll, index) => (
                    <Grid
                      key={`poll-card-${index}`}
                      item
                      md={!isLgTablet ? 4 : 3}
                    >
                      <VoteCard item={poll} podId={''} />
                    </Grid>
                  ))}
              </Grid>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                mt={4}
              >
                <SecondaryButton
                  className={commonClasses.showAll}
                  size="medium"
                  radius={29}
                  onClick={() => history.push(`/governance/votes/${''}`)}
                >
                  Show All
                  <Box
                    position="absolute"
                    flexDirection="row"
                    top={0}
                    right={0}
                    pr={2}
                  >
                    <ArrowLeftIcon />
                  </Box>
                </SecondaryButton>
              </Box>
            </>
          )}
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            mt={7}
            mb={5}
          >
            <Text size={FontSize.XXL} bold>
              DAO proposals
            </Text>
            <PrimaryButton
              size="medium"
              className={commonClasses.iconButton}
              onClick={() => {
                setOpenCreateNewProposalModal(true);
              }}
            >
              New proposal
              <CheckIcon />
            </PrimaryButton>
          </Box>
          {proposals && (
            <>
              <Grid container spacing={4} wrap="wrap">
                {proposals
                  .filter((_, index) =>
                    isMobile
                      ? index < 1
                      : isTablet
                      ? index < 2
                      : !isLgTablet
                      ? index < 3
                      : index < 4
                  )
                  .map((proposal, index) => (
                    <Grid
                      key={`poll-card-${index}`}
                      item
                      md={!isLgTablet ? 4 : 3}
                    >
                      <ProposalCard item={proposal} />
                    </Grid>
                  ))}
              </Grid>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                mt={4}
              >
                <SecondaryButton
                  className={commonClasses.showAll}
                  size="medium"
                  radius={29}
                  onClick={() => history.push('/governance/proposals')}
                >
                  Show All
                  <Box
                    position="absolute"
                    flexDirection="row"
                    top={0}
                    right={0}
                    pr={2}
                  >
                    <ArrowLeftIcon />
                  </Box>
                </SecondaryButton>
              </Box>
            </>
          )}
        </LoadingWrapper>
      </div>
      {openCreateNewDiscussionModal && (
        <CreateNewDiscussion
          open={openCreateNewDiscussionModal}
          handleClose={() => setOpenCreateNewDiscussionModal(false)}
        />
      )}
      {openCreateNewVoteModal && (
        <CreateNewVoteModal
          open={openCreateNewVoteModal}
          handleClose={() => setOpenCreateNewVoteModal(false)}
          postCreated={(vote) => {
            setPolls((prev) => [vote, ...prev]);
          }}
        />
      )}
      {openCreateNewProposalModal && (
        <CreateNewProposalModal
          open={openCreateNewProposalModal}
          handleClose={() => setOpenCreateNewProposalModal(false)}
          postCreated={(proposal) => {
            setProposals((prev) => [proposal, ...(prev || [])]);
          }}
        />
      )}
    </Box>
  );
}
