import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import Hidden from '@material-ui/core/Hidden';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Pagination from '@material-ui/lab/Pagination';

import { Text } from 'components/MusicDao/components/ui-kit';
import { Color, PrimaryButton } from 'shared/ui-kit';
import DiscussionCard from 'components/MusicDao/components/DiscussionCard';
import URL from 'shared/functions/getURL';
import Box from 'shared/ui-kit/Box';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import CreateNewDiscussion from 'components/MusicDao/modals/CreateNewDiscussion';
import {
  BackIcon,
  CloseIcon,
  DiscussionIcon,
  DropDownIcon,
  HistoryIcon,
  HotIcon,
  JumpIcon,
  useGovernanceStyles
} from './styles';

const useStyles = makeStyles((theme) => ({
  filterButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `rgba(240, 245, 248, 0.7) !important`,
    color: `${Color.MusicDAOLightBlue} !important`,
    fontSize: '12px !important',
    borderRadius: '100px !important',
    '& svg': {
      marginRight: 8,
      marginBottom: 2
    }
  },
  selected: {
    backgroundColor: `${Color.MusicDAODark} !important`,
    color: 'white !important'
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 56,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      marginTop: 24,
      alignItems: 'flex-end'
    }
  },
  filterItem_1: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      justifyContent: 'space-between'
    }
  },
  filterItem_2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: 12
    }
  }
}));

const Filters = [
  { name: 'New', Icon: HistoryIcon },
  { name: 'Top', Icon: JumpIcon },
  { name: 'Hot', Icon: HotIcon },
  { name: 'Closed', Icon: CloseIcon }
];

const PostType = [
  { value: 'crypto', name: 'Cryptocurrencyt' },
  { value: 'crypto1', name: 'Cryptocurrencyt1' }
];

export default function DiscussionAll() {
  const commonClasses = useGovernanceStyles();
  const classes = useStyles();

  const history = useHistory();

  const [selectedFilter, setSelectedFilter] = useState('New');
  const [postType, setPostType] = useState(PostType[0].value);

  const [discussions, setDiscussions] = useState<any[]>([]);
  const [openCreateNewDiscussionModal, setOpenCreateNewDiscussionModal] =
    useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [pagination, setPagination] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    axios
      .post(`${URL()}/musicDao/governance/getDiscussions`, {
        pagination,
        filter: 'asc'
      })
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          setTotal(resp.data.totalCount);
          setDiscussions(
            resp.data.discussions.map((discussion) => {
              return {
                ...discussion
              };
            })
          );
        }
      })
      .catch((err) => {
        console.log('error: ', err);
      })
      .finally(() => setLoading(false));
  }, [pagination]);

  const handlePostTypeChange = (e) => {
    setPostType(e.target.value);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination(value);
  };

  return (
    <Box position="relative">
      <div className={commonClasses.headerImage} />
      <div className={commonClasses.content}>
        <Hidden only="xs">
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              display="flex"
              flexDirection="row"
              className={commonClasses.back}
              onClick={() => history.goBack()}
            >
              <BackIcon />
              <Text ml={1} color={Color.White} bold>
                BACK
              </Text>
            </Box>
            <div className={commonClasses.headerTitle}>Discussions</div>
            <PrimaryButton
              size="medium"
              className={commonClasses.iconButton}
              onClick={() => setOpenCreateNewDiscussionModal(true)}
            >
              New discussion
              <DiscussionIcon />
            </PrimaryButton>
          </Box>
        </Hidden>
        <Hidden smUp>
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              flexDirection="row"
              className={commonClasses.back}
              onClick={() => history.goBack()}
            >
              <BackIcon />
              <Text ml={1} color={Color.White} bold>
                BACK
              </Text>
            </Box>
            <Box display="flex" justifyContent="center" mt={2}>
              <div className={commonClasses.headerTitle}>Discussions</div>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <PrimaryButton
                size="medium"
                className={commonClasses.iconButton}
                onClick={() => setOpenCreateNewDiscussionModal(true)}
              >
                New discussion
                <DiscussionIcon />
              </PrimaryButton>
            </Box>
          </Box>
        </Hidden>
        <div className={classes.filterSection}>
          <div className={classes.filterItem_1}>
            {Filters.map((filter, index) => (
              <PrimaryButton
                key={`discussion-filter-${index}`}
                size="small"
                className={`${classes.filterButton} ${
                  filter.name === selectedFilter && classes.selected
                }`}
                onClick={() => setSelectedFilter(filter.name)}
              >
                <filter.Icon
                  color={
                    filter.name === selectedFilter
                      ? 'white'
                      : Color.MusicDAOLightBlue
                  }
                />
                {filter.name}
              </PrimaryButton>
            ))}
          </div>
          <div className={classes.filterItem_2}>
            <Box className={commonClasses.header2} color={Color.White} mr={1}>
              Post type
            </Box>
            <Select
              className={commonClasses.select}
              IconComponent={DropDownIcon}
              value={postType}
              onChange={handlePostTypeChange}
            >
              {PostType.map((post, index) => (
                <MenuItem key={`discussion-post-${index}`} value={post.value}>
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
        <LoadingWrapper loading={loading}>
          <Box display="flex" flexDirection="column" mt={5}>
            {discussions.map((discussion, index) => (
              <DiscussionCard
                key={`discussion-card-${index}`}
                discussion={discussion}
              />
            ))}
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            mt={5}
          >
            <Pagination
              count={Math.floor((total - 1) / 10) + 1}
              page={pagination}
              onChange={handleChange}
            />
          </Box>
        </LoadingWrapper>
      </div>
      {openCreateNewDiscussionModal && (
        <CreateNewDiscussion
          open={openCreateNewDiscussionModal}
          handleClose={() => setOpenCreateNewDiscussionModal(false)}
        />
      )}
    </Box>
  );
}
