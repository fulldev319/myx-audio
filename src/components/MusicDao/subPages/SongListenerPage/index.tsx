import React from 'react';
import Moment from 'react-moment';
import { useHistory, useParams } from 'react-router-dom';

import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import Pagination from '@material-ui/lab/Pagination';

import { useTypedSelector } from 'store/reducers/Reducer';
import { ArrowIcon } from '../../components/Icons/SvgIcons';

import {
  musicDaoGetSongFeed,
  musicDaoGetSongRanking,
  musicDaoGetSongListenDetail
} from 'shared/services/API';
import { Avatar /*, PrimaryButton */ } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import { numberWithCommas } from 'shared/helpers/number';
import { processImage } from 'shared/helpers';

import { songListenerPageStyles } from './index.styles';

const Tabs = ['Feed', 'Listeners Ranking' /* "Airdrop History" */];

const FEEDTABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: 'User account'
  },
  {
    headerName: 'Last time listened',
    headerAlign: 'center'
  },
  {
    headerName: 'Select All',
    headerAlign: 'right'
  }
];

const RANKINGTABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: 'User account'
  },
  // {
  //   headerName: "Listening time",
  //   headerAlign: "center",
  // },
  {
    headerName: 'Times listened',
    headerAlign: 'center'
  }
  // {
  //   headerName: "Select All",
  //   headerAlign: "right",
  // },
];

const FeedPageSize = 10;

const SongListenerPage = () => {
  const classes = songListenerPageStyles();
  const history = useHistory();

  const user = useTypedSelector((state) => state.user);

  const { id: songId } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = React.useState<typeof Tabs[number]>(
    Tabs[0]
  );

  const [tableHeader, setTableHeader] = React.useState<
    Array<CustomTableHeaderInfo>
  >([]);
  const [tableData, setTableData] = React.useState<
    Array<Array<CustomTableCellInfo>>
  >([]);

  const [isFeedLoading, setIsFeedLoading] = React.useState<boolean>(false);
  const [feedTotal, setFeedTotal] = React.useState<number>(0);
  const [currentFeedPage, setCurrentFeedPage] = React.useState<number>(1);
  const [feedDetail, setFeedDetail] = React.useState<any>({
    totalListener: 0,
    totalTime: 0,
    totalFruit: 0
  });

  const getFeedDetail = async () => {
    const response = await musicDaoGetSongListenDetail(songId);
    if (response.success) {
      setFeedDetail(response.data);
    }
  };

  const getFeeds = async (page = 1) => {
    setIsFeedLoading(true);
    const response = await musicDaoGetSongFeed(songId, {
      page: page - 1,
      size: FeedPageSize
    });
    setFeedTotal(response.total);
    setTableData(
      (response.data || []).map((feed) => [
        {
          cell: (
            <Box display="flex" alignItems="center">
              <Avatar size="small" url={processImage(feed.userInfo?.image)} />
              <Box className={classes.tableText} ml={1}>
                {feed.userInfo?.address}
              </Box>
            </Box>
          )
        },
        {
          cell: (
            <Box className={classes.tableText}>
              <Moment fromNow>{feed.timestamp}</Moment>
            </Box>
          ),
          cellAlign: 'center'
        },
        {
          cell: <Checkbox />,
          cellAlign: 'right'
        }
      ])
    );
    setIsFeedLoading(false);
  };

  const getRankings = async (page = 1) => {
    setIsFeedLoading(true);
    const response = await musicDaoGetSongRanking(songId, {
      page: page - 1,
      size: FeedPageSize
    });
    setFeedTotal(response.total);
    setTableData(
      (response.data || []).map((feed, index) => [
        {
          cell: (
            <Box display="flex" alignItems="center">
              <Box className={classes.tableText} mr={2}>
                # {index + 1}
              </Box>
              <Avatar size="small" url={processImage(feed.userInfo?.image)} />
              <Box className={classes.tableText} ml={1}>
                {feed.userInfo?.address}
              </Box>
            </Box>
          )
        },
        // {
        //   cell: <Box className={classes.tableText}>232h 20mins</Box>,
        //   cellAlign: "center",
        // },
        {
          cell: <Box className={classes.tableText}>{feed.reproductions}</Box>,
          cellAlign: 'right'
        }
        // {
        //   cell: <Checkbox />,
        //   cellAlign: "right",
        // },
      ])
    );
    setIsFeedLoading(false);
  };

  React.useEffect(() => {
    if (user.isArtist && user.id) {
      getFeedDetail();
    }
  }, [user.isArtist, user.id]);

  React.useEffect(() => {
    if (user.isArtist) {
      if (activeTab === Tabs[0]) {
        setTableHeader(FEEDTABLEHEADER);
        setFeedTotal(0);
        getFeeds();
      } else if (activeTab === Tabs[1]) {
        setTableHeader(RANKINGTABLEHEADER);
        setFeedTotal(0);
        getRankings();
      }
    }
  }, [activeTab, user]);

  React.useEffect(() => {
    if (user.isArtist) {
      if (activeTab === Tabs[0]) {
        getFeeds(currentFeedPage);
      } else if (activeTab === Tabs[1]) {
        getRankings(currentFeedPage);
      }
    }
  }, [currentFeedPage, user]);

  const handleFeedPaginationChange = (_, value: number) => {
    setCurrentFeedPage(value);
  };

  return (
    <Box className={classes.root}>
      {user.isArtist ? (
        <Box className={classes.infoContainer}>
          <Box display="flex" alignItems="center" position="relative">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              style={{ cursor: 'pointer' }}
              onClick={() => history.goBack()}
              zIndex={1}
            >
              <div>
                <ArrowIcon color={'#2D3047'} />
              </div>
              <Box
                color="#2D3047"
                fontSize={14}
                fontWeight={700}
                ml="5px"
                mb="4px"
              >
                BACK
              </Box>
            </Box>
            <Hidden xsDown>
              <Box
                className={classes.title}
                position="absolute"
                width={1}
                height={1}
                display="flex"
                justifyContent="center"
                top={1}
                left={0}
              >
                Bubble Dispersion Listeners
              </Box>
            </Hidden>
          </Box>
          <Hidden smUp>
            <Box className={classes.title} mt={2}>
              Bubble Dispersion Listeners
            </Box>
          </Hidden>
          <Box className={classes.reviewInfo} mt={3}>
            <div>
              <div>
                <span>Total listeners</span>
                <span>{numberWithCommas(feedDetail.totalListener)}</span>
              </div>
            </div>
            <div>
              <div>
                <span>Total times played</span>
                <span>{numberWithCommas(feedDetail.totalTime)}</span>
              </div>
            </div>
            <div>
              <div>
                <span>Fruits Total</span>
                <span>{numberWithCommas(feedDetail.totalFruit)}</span>
              </div>
            </div>
          </Box>
          {/* <Hidden lgUp>
            <Box className={classes.buttons} mt={4}>
              <PrimaryButton size="small">Aidrop to selected</PrimaryButton>
              <PrimaryButton size="small">Airdrop to All</PrimaryButton>
            </Box>
          </Hidden> */}
          <Box className={classes.tabContainer}>
            <Box className={classes.tableSection}>
              {Tabs.map((tab, index) => (
                <Box
                  key={`tab-${index}`}
                  className={`${classes.tabItem} ${
                    activeTab === tab ? classes.tabItemActive : ''
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Box>
              ))}
            </Box>
            {/* <Hidden mdDown>
              <Box className={classes.buttons}>
                <PrimaryButton size="small">Aidrop to selected</PrimaryButton>
                <PrimaryButton size="small">Airdrop to All</PrimaryButton>
              </Box>
            </Hidden> */}
          </Box>
          <Box mt={2}>
            <Box className={classes.table}>
              <LoadingWrapper loading={isFeedLoading}>
                <CustomTable
                  headers={tableHeader}
                  rows={tableData}
                  placeholderText="No Slot"
                  theme="transparent"
                  radius={20}
                />
              </LoadingWrapper>
              {Math.ceil(feedTotal / FeedPageSize) > 1 ? (
                <Box display="flex" justifyContent="center">
                  <Pagination
                    count={Math.ceil(feedTotal / FeedPageSize)}
                    page={currentFeedPage}
                    onChange={handleFeedPaginationChange}
                  />
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box className={classes.title} mt={10} px={4}>
          Sorry, only artists can access this page.
        </Box>
      )}
    </Box>
  );
};

export default SongListenerPage;
