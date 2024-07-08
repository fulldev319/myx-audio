import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce/lib';

import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';

import Box from 'shared/ui-kit/Box';
import {
  Avatar,
  Color,
  PrimaryButton,
  SecondaryButton,
  Variant
} from 'shared/ui-kit';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import URL from 'shared/functions/getURL';
import {
  MusicCircleIcon,
  PotionBarIcon,
  TopRigthArrowIcon,
  FireIcon,
  UnionIcon,
  DetailIcon,
  SearchIcon,
  // TriangleUp,
  // TriangleDown,
  // SmallCraneIcon,
  MarketplaceColorIcon,
  BopsMarketPlaceIcon
} from 'components/MusicDao/components/Icons/SvgIcons';
import CustomPopup from 'components/MusicDao/components/CustomPopup';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import PotionsCard from 'components/MusicDao/components/Cards/PotionsCard';
import { getRandomAvatar } from 'shared/services/user/getUserAvatar';
// import StakingCard from "components/MusicDao/components/Cards/StakingCard";
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import CreateClaimablePodModal from '../../modals/Claimable/CreateClaimablePodModal';
import { potionsPageStyle } from './index.styles';
import MarketplaceCard from 'components/MusicDao/components/Cards/MarketplaceCard';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';

const SORTBYOPTIONS = ['Top Performers 24h', 'Top Potion Gainers'];
const MOREOPTONS = ['Newest', 'Oldest'];
const TIMEOPTIONS = ['All time', 'Last week', 'Last month'];
const SALEOPTIONS = ['For Sale'];
const MARKETOPTIONS = ['Top level', 'Revenue generation', 'Lowest price'];

// const TABLEHEADERS: Array<CustomTableHeaderInfo> = [
//   {
//     headerName: "Position",
//     headerAlign: "left",
//   },
//   {
//     headerName: "User",
//     headerAlign: "center",
//   },
//   {
//     headerName: "Status",
//     headerAlign: "center",
//   },
//   {
//     headerName: "Efficiency",
//     headerAlign: "center",
//   },
//   {
//     headerName: "TRAX Staked",
//     headerAlign: "center",
//   },
//   {
//     headerName: "Potions Collected",
//     headerAlign: "center",
//   },
// ];

const CARDSTABLEHEADERS: Array<CustomTableHeaderInfo> = [
  {
    headerName: '',
    headerAlign: 'left'
  },
  {
    headerName: '',
    headerAlign: 'left'
  },
  {
    headerName: 'Genre',
    headerAlign: 'center'
  },
  {
    headerName: 'Bops Generated',
    headerAlign: 'center'
  },
  {
    headerName: 'Levels',
    headerAlign: 'center'
  },
  {
    headerName: 'Beats Awarded',
    headerAlign: 'center'
  }
];

export default function PotionsPage() {
  const classes = potionsPageStyle();
  const commonClasses = musicDaoPageStyles();
  const history = useHistory();

  const [activeTab, setActiveTab] = useState<number>(2);
  const [sortByOptionsSelection, setSortByOptionsSelection] = useState<string>(
    SORTBYOPTIONS[0]
  );
  const [selectedMoreOption, setSelectedMoreOption] = useState<string>(
    MOREOPTONS[0]
  );
  const [selectedTimeOption, setSelectedTimeOption] = useState<string>(
    TIMEOPTIONS[0]
  );
  const [selectedSaleOption, setSelectedSaleOption] = useState<string>(
    SALEOPTIONS[0]
  );

  const [isListView, setIsListView] = React.useState<boolean>(false);
  const [topStakingUsers, setTopStakingUsers] = useState<any[]>([
    {
      name: 'Mark Usualis',
      url: getRandomAvatar(),
      trax: 2456
    },
    {
      name: 'Mark Usualis',
      url: getRandomAvatar(),
      trax: 2456
    },
    {
      name: 'Mark Usualis',
      url: getRandomAvatar(),
      trax: 2456
    }
  ]);
  const [stakingUsers, setStakingUsers] = useState<any[]>([
    {
      name: 'Mark Usualis',
      url: getRandomAvatar(),
      status: 'Staking Godess',
      effiency: 0.053,
      trax: 2456,
      potionsCollected: 224,
      rankingOffset: 1
    },
    {
      name: 'Mark Usualis',
      url: getRandomAvatar(),
      status: 'Staking master',
      effiency: 0.053,
      trax: 2456,
      potionsCollected: 224,
      rankingOffset: 3
    },
    {
      name: 'Mark Usualis',
      url: getRandomAvatar(),
      status: 'top optimiser',
      effiency: 0.053,
      trax: 2456,
      potionsCollected: 224,
      rankingOffset: -1
    },
    {
      name: 'Mark Usualis',
      url: getRandomAvatar(),
      effiency: 0.053,
      trax: 2456,
      potionsCollected: 224,
      rankingOffset: 2
    },
    {
      name: 'Mark Usualis',
      url: getRandomAvatar(),
      effiency: 0.053,
      trax: 2456,
      potionsCollected: 224,
      rankingOffset: -3
    }
  ]);

  const [searchValue, setSearchValue] = React.useState<string>('');

  const [songs, setSongs] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState<number>(1);
  const [songsLoader, setSongsLoader] = React.useState<boolean>(false);

  const [openCreateClaimableSongModal, setOpenCreateClaimableSongModal] =
    React.useState<boolean>(false);
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);

  React.useEffect(() => {
    getClaimablePods();
  }, [pagination]);

  const getClaimablePods = async () => {
    const config = {
      searchValue,
      pagination
    };
    setSongsLoader(true);
    try {
      const response = await axios.post(
        `${URL()}/musicDao/claimable/getClaimableSongs`,
        config
      );
      const resp = response.data;
      if (resp.success) {
        setSongs(resp.data.songs);
      }
      setSongsLoader(false);
    } catch (e) {
      setSongsLoader(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination(value);
  };

  const [onSearch] = useDebouncedCallback(() => {
    setPagination(1);
    getClaimablePods();
  }, 1000);

  const renderCardsGrid = () => {
    return (
      <LoadingWrapper theme="dark" loading={songsLoader}>
        <Grid container spacing={3}>
          {songs.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={`${item.PodAddress}-${index}-DNFTtrending-card`}
            >
              <PotionsCard pod={item} />
            </Grid>
          ))}
        </Grid>
      </LoadingWrapper>
    );
  };

  const renderCardsTable = () => (
    <LoadingWrapper theme="dark" loading={songsLoader}>
      <>
        <CustomTable
          headers={CARDSTABLEHEADERS}
          rows={getCardsTableData()}
          placeholderText="No Slot"
          theme="transparent"
          variant={Variant.Transparent}
          radius={20}
        />
        <Box className={classes.pagination}>
          <Pagination count={10} onChange={() => {}} />
        </Box>
      </>
    </LoadingWrapper>
  );

  const getCardsTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    songs.map((item) => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box display="flex" alignItems="center">
            <Box className={classes.bopImageBox}>
              <div
                className={classes.bopBackImage}
                style={{
                  backgroundImage: `url("${
                    item.album_image ?? getRandomImageUrl()
                  }")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  overflow: 'hidden'
                }}
              />
              <Box className={classes.bopAvatarBox}>
                {item.artists && item.artists.length > 0 ? (
                  item.artists.map((artist, index) => (
                    <Box
                      className={
                        index === 0 ? classes.bopAvatar : classes.bopAvatar1
                      }
                      key={index}
                      ml={index > 0 ? -1 : 0}
                      zIndex={item.artists.length - index}
                    >
                      <img
                        src={artist.avatar ?? getRandomAvatar()}
                        width="100%"
                        height="100%"
                        style={{ borderRadius: '100%' }}
                        title={artist.name || ''}
                      />
                    </Box>
                  ))
                ) : (
                  <Box className={classes.bopAvatar}>
                    <img
                      src={item.artist_image}
                      width="100%"
                      height="100%"
                      style={{ borderRadius: '100%' }}
                      title={item.artist_name || ''}
                    />
                  </Box>
                )}
              </Box>
            </Box>
            <Box className={classes.tableHeader2} ml={3}>
              {item.artist_name || ''}
            </Box>
          </Box>
        ),
        cellAlign: 'left'
      });
      row.push({
        cell: (
          <Box
            className={classes.tableHeader2}
            ml={2}
            onClick={() => history.push(`/potions/${item.song_name}`)}
            style={{ cursor: 'pointer' }}
          >
            {item.song_name || ''}
          </Box>
        ),
        cellAlign: 'left'
      });
      row.push({
        cell: (
          <Box className={classes.tableHeader2} ml={2}>
            Pop
          </Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: <Box className={classes.tableHeader2}>3234</Box>,
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <Box className={classes.tableHeader2}>{item.totalReproductions}</Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box className={classes.tableHeader2}>2244</Box>
          </Box>
        ),
        cellAlign: 'center'
      });

      tableData.push(row);
    });

    return tableData;
  };

  // const getTableData = () => {
  //   const tableData: Array<Array<CustomTableCellInfo>> = [];
  //   stakingUsers.map((item, index) => {
  //     const row: Array<CustomTableCellInfo> = [];
  //     row.push({
  //       cell: (
  //         <Box display="flex" alignItems="center" justifyContent="center">
  //           <Box
  //             className={classes.rankBox}
  //             style={{
  //               backgroundColor: "linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
  //               border: "1px solid #F2F5F2",
  //               transform: "none",
  //             }}
  //           >
  //             <Box className={classes.tableHeader1}>{index + 4}</Box>
  //           </Box>
  //           <Box ml={2}>
  //             {item.rankingOffset > 0 ? <TriangleUp /> : <TriangleDown />}
  //             <Box className={classes.tableHeader2}>{Math.abs(item.rankingOffset)}</Box>
  //           </Box>
  //         </Box>
  //       ),
  //       cellAlign: "center",
  //     });
  //     row.push({
  //       cell: (
  //         <Box display="flex" alignItems="center" justifyContent="center">
  //           <Avatar size="small" url={item.url} />
  //           <Box className={classes.tableHeader2} ml={2}>
  //             {item.name}
  //           </Box>
  //         </Box>
  //       ),
  //       cellAlign: "center",
  //     });
  //     row.push({
  //       cell: item.status ? (
  //         <Box
  //           display="flex"
  //           alignItems="center"
  //           justifyContent="center"
  //           px={1}
  //           py={0.5}
  //           borderRadius="16px"
  //           style={{
  //             background:
  //               item.status === "Staking Godess"
  //                 ? "#7358E4"
  //                 : item.status === "Staking master"
  //                   ? "#FF6E41"
  //                   : "#00B934",
  //           }}
  //         >
  //           <SmallCraneIcon />
  //           <Box ml={1} style={{ textTransform: "uppercase" }} className={classes.tableHeader2} color="white">
  //             {item.status}
  //           </Box>
  //         </Box>
  //       ) : (
  //         <Box></Box>
  //       ),
  //       cellAlign: "center",
  //     });
  //     row.push({
  //       cell: <Box className={classes.tableHeader4}>{item.effiency} USDT/Potion</Box>,
  //       cellAlign: "center",
  //     });
  //     row.push({
  //       cell: <Box className={classes.tableHeader4}>{item.trax} TRAX</Box>,
  //       cellAlign: "center",
  //     });
  //     row.push({
  //       cell: (
  //         <Box display="flex" alignItems="center" justifyContent="center">
  //           <Box className={classes.tableHeader4}>{item.potionsCollected} TPR</Box>
  //         </Box>
  //       ),
  //       cellAlign: "center",
  //     });

  //     tableData.push(row);
  //   });

  //   return tableData;
  // };

  const renderTopStaking = () => {
    return (
      <Box mt={2}>
        {/* <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <MarketplaceCard key={`market-place-card-${index}`} />
          ))}
        </Box> */}
        <Grid container spacing={3} wrap="wrap">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <Grid
              key={`market-place-card-${index}`}
              item
              lg={4}
              md={6}
              sm={12}
              xs={12}
            >
              <MarketplaceCard />
            </Grid>
          ))}
        </Grid>

        {/* <Box display="flex" alignItems="center">
          <img src={require("assets/musicDAOImages/cup.webp")} />
          <Box className={classes.header4}>
            Top 50 at <span style={{ fontWeight: 400 }}>Staking</span>
          </Box>
        </Box>
        <Box display="flex" alignItems="flex-end" justifyContent="center" width={1}>
          {topStakingUsers.map((user, index) => (
            <Box mx={index === 1 ? 3 : 0}>
              <StakingCard user={user} rank={index === 0 ? 2 : index === 2 ? 3 : 1} />
            </Box>
          ))}
        </Box>
        <Box mt={2}>
          <CustomTable
            headers={TABLEHEADERS}
            rows={getTableData()}
            placeholderText="No Slot"
            theme="transparent"
            variant={Variant.Transparent}
            radius={20}
          />
        </Box> */}
        <Box className={classes.pagination}>
          <Pagination count={10} onChange={() => {}} />
        </Box>
      </Box>
    );
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.backgroundBox} />
      <Box className={classes.topBox}>
        <Box className={classes.whiteBox}>
          <Box className={classes.tabBox}>
            <Box
              className={`${classes.tabBarItem} ${
                activeTab === 0 && classes.tabBarItemActive
              }`}
              onClick={() => setActiveTab(0)}
            >
              <MusicCircleIcon />
              <Box ml={2} my={2.5}>
                Get Bops
              </Box>
            </Box>
            <Box
              className={`${classes.tabBarItem} ${
                activeTab === 1 && classes.tabBarItemActive
              }`}
              onClick={() => setActiveTab(1)}
            >
              <PotionBarIcon />
              <Box ml={2} my={2.5}>
                Bops Leaderboard
              </Box>
            </Box>
            <Box
              className={`${classes.tabBarItem} ${
                activeTab === 2 && classes.tabBarItemActive
              }`}
              onClick={() => setActiveTab(2)}
            >
              <BopsMarketPlaceIcon />
              <Box ml={2} my={2.5}>
                Bops Marketplce
              </Box>
            </Box>
          </Box>
          <Box
            style={{ cursor: 'pointer' }}
            onClick={() => history.push('/potions/manageBops')}
            display="flex"
          >
            <ExcludeIcon />
            <Box className={classes.tableHeader2} ml={1}>
              Manage Bops
            </Box>
          </Box>
        </Box>
      </Box>
      <div className={classes.body}>
        {activeTab < 2 && (
          <>
            <img
              className="left-logo"
              src={require('assets/musicDAOImages/potions_1.webp')}
            />
            <img
              className="right-logo"
              src={require('assets/musicDAOImages/potions_2.webp')}
            />
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              zIndex="1"
            >
              <Box className={classes.header}>Choose your track</Box>
              <Box
                className={classes.header}
                style={{ fontWeight: 400, textAlign: 'center' }}
              >
                earn with your favourite artists
              </Box>
              <span className={classes.headerTitle}>
                Stake TRAX on your favourite tracks to generate your Bops, earn
                revenue <br />
                and Beats from them and level them up to maximise your profit.
              </span>
              <Box className={classes.buttons} display="flex" mt={4} mb={4}>
                <PrimaryButton
                  size="medium"
                  onClick={() => setOpenCreateClaimableSongModal(true)}
                >
                  <BeatsIcon />
                  Get Beats
                </PrimaryButton>
                <PrimaryButton
                  size="medium"
                  onClick={() => setOpenCreateClaimableSongModal(true)}
                >
                  <img
                    src={require('assets/musicDAOImages/music_logo.webp')}
                    style={{ marginRight: 10 }}
                  />
                  Get Myx
                </PrimaryButton>
              </Box>
            </Box>
          </>
        )}
        <Box className={classes.contentBox} width={1} minHeight="1000px">
          {activeTab < 2 ? (
            <Box className={classes.filterContainer}>
              <Box className={classes.optionSection}>
                {SORTBYOPTIONS.map((item, index) => (
                  <Box
                    key={index}
                    className={
                      item === sortByOptionsSelection
                        ? classes.selectedButtonBox
                        : classes.buttonBox
                    }
                    mr={1}
                    onClick={() => setSortByOptionsSelection(item)}
                    height="37px"
                  >
                    <Box display="flex" alignItems="center">
                      {index === 0 ? (
                        <TopRigthArrowIcon
                          color={
                            item === sortByOptionsSelection
                              ? 'white'
                              : Color.MusicDAODark
                          }
                        />
                      ) : (
                        <FireIcon
                          color={
                            item === sortByOptionsSelection
                              ? 'white'
                              : Color.MusicDAODark
                          }
                        />
                      )}
                    </Box>
                    <Box className={classes.header3} ml={1}>
                      {item}
                    </Box>
                  </Box>
                ))}
                <Box className={classes.buttonBox}>
                  <CustomPopup
                    items={MOREOPTONS}
                    value={selectedMoreOption}
                    onSelect={(value) => setSelectedMoreOption(value)}
                    theme="dark"
                  />
                </Box>
              </Box>
              <Box className={classes.optionSection}>
                <Box className={classes.buttonBox} style={{ padding: 0 }}>
                  <SecondaryButton
                    className={`${commonClasses.showButton} ${
                      isListView ? commonClasses.showButtonSelected : ''
                    }`}
                    size="small"
                    onClick={() => setIsListView(true)}
                    isRounded
                  >
                    <UnionIcon />
                  </SecondaryButton>
                  <PrimaryButton
                    className={`${commonClasses.showButton} ${
                      !isListView ? commonClasses.showButtonSelected : ''
                    }`}
                    size="small"
                    onClick={() => setIsListView(false)}
                    isRounded
                    style={{ marginLeft: 0 }}
                  >
                    <DetailIcon />
                  </PrimaryButton>
                </Box>
                <Box
                  className={classes.buttonBox}
                  ml={1}
                  style={{ cursor: 'auto' }}
                >
                  {showSearchBox && (
                    <InputWithLabelAndTooltip
                      type="text"
                      inputValue={searchValue}
                      placeHolder="Search"
                      onInputValueChange={(e) => {
                        setSearchValue(e.target.value);
                        onSearch();
                      }}
                      style={{
                        background: 'transparent',
                        margin: 0,
                        marginRight: 8,
                        padding: 0,
                        border: 'none',
                        height: 'auto'
                      }}
                      theme="music dao"
                    />
                  )}
                  <Box
                    onClick={() => setShowSearchBox((prev) => !prev)}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{ cursor: 'pointer' }}
                  >
                    <SearchIcon color={Color.MusicDAODark} />
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                pb={'28px'}
                borderBottom="1px solid rgba(0, 0, 0, 0.1)"
              >
                <Box className={classes.header}>Trade your Bops</Box>
                <PrimaryButton size="medium" className={classes.sellBop}>
                  <MarketplaceColorIcon />
                  Sell Bop
                </PrimaryButton>
              </Box>
              <Box className={classes.filterContainer}>
                <Box className={classes.optionSection}>
                  <Box className={classes.buttonBox} mr={1}>
                    <CustomPopup
                      items={SALEOPTIONS}
                      value={selectedSaleOption}
                      onSelect={(value) => setSelectedSaleOption(value)}
                      theme="dark"
                    />
                  </Box>
                  {MARKETOPTIONS.map((item, index) => (
                    <Box
                      key={index}
                      className={
                        item === selectedTimeOption
                          ? classes.selectedButtonBox
                          : classes.buttonBox
                      }
                      mr={1}
                      onClick={() => setSelectedTimeOption(item)}
                      height="37px"
                    >
                      <Box display="flex" alignItems="center">
                        {index === 0 ? (
                          <TopRigthArrowIcon
                            color={
                              item === selectedTimeOption
                                ? 'white'
                                : Color.MusicDAODark
                            }
                          />
                        ) : index === 1 ? (
                          <FireIcon
                            color={
                              item === selectedTimeOption
                                ? 'white'
                                : Color.MusicDAODark
                            }
                          />
                        ) : null}
                      </Box>
                      <Box className={classes.header3} ml={1}>
                        {item}
                      </Box>
                    </Box>
                  ))}
                  <Box className={classes.buttonBox}>
                    <CustomPopup
                      items={MOREOPTONS}
                      value={selectedMoreOption}
                      onSelect={(value) => setSelectedMoreOption(value)}
                      theme="dark"
                    />
                  </Box>
                </Box>
                <Box
                  className={classes.buttonBox}
                  ml={1}
                  style={{ cursor: 'auto' }}
                >
                  {showSearchBox && (
                    <InputWithLabelAndTooltip
                      type="text"
                      inputValue={searchValue}
                      placeHolder="Search"
                      onInputValueChange={(e) => {
                        setSearchValue(e.target.value);
                        // onSearch();
                      }}
                      style={{
                        background: 'transparent',
                        margin: 0,
                        marginRight: 8,
                        padding: 0,
                        border: 'none',
                        height: 'auto'
                      }}
                      theme="music dao"
                    />
                  )}
                  <Box
                    onClick={() => setShowSearchBox((prev) => !prev)}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{ cursor: 'pointer' }}
                  >
                    <SearchIcon color={Color.MusicDAODark} />
                  </Box>
                </Box>
              </Box>
            </>
          )}
          {activeTab < 2
            ? isListView
              ? renderCardsTable()
              : renderCardsGrid()
            : renderTopStaking()}
        </Box>
      </div>
      {openCreateClaimableSongModal && (
        <CreateClaimablePodModal
          open={openCreateClaimableSongModal}
          handleClose={() => setOpenCreateClaimableSongModal(false)}
        />
      )}
    </Box>
  );
}

const ExcludeIcon = () => (
  <svg
    width="17"
    height="14"
    viewBox="0 0 17 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.0164 2.46209C15.8369 2.76564 16.2559 3.67681 15.9523 4.49723L13.0411 12.3656C12.7375 13.186 11.8264 13.605 11.0059 13.3015L9.13645 12.6098C9.04843 12.6417 8.95633 12.6663 8.86076 12.6826L4.23664 13.4727C3.37435 13.62 2.55589 13.0404 2.40856 12.1781L0.995598 3.90834C0.84827 3.04606 1.42786 2.2276 2.29015 2.08027L6.91427 1.2902C7.55344 1.18099 8.16852 1.47118 8.50404 1.97986L8.58164 1.77013C8.88519 0.9497 9.79636 0.53069 10.6168 0.834244L15.0164 2.46209ZM8.50404 1.97986C8.62117 2.15743 8.70423 2.36162 8.74235 2.58475L10.1553 10.8545C10.2863 11.6213 9.8426 12.3533 9.13645 12.6098L6.60629 11.6736C5.78586 11.3701 5.36685 10.4589 5.6704 9.63847L8.50404 1.97986Z"
      fill="url(#exlude_linear)"
    />
    <defs>
      <linearGradient
        id="exlude_linear"
        x1="13.2038"
        y1="8.77493"
        x2="0.589781"
        y2="5.95819"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stop-color="#A0D800" />
        <stop offset="0.852705" stop-color="#0DCC9E" />
      </linearGradient>
    </defs>
  </svg>
);

const BeatsIcon = () => (
  <svg
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M2.05492 5.69336C1.35883 5.69336 0.794922 6.25726 0.794922 6.95336V11.0484C0.794922 11.7445 1.35883 12.3084 2.05492 12.3084C2.75102 12.3084 3.31492 11.7445 3.31492 11.0484V6.95336C3.31492 6.25726 2.75102 5.69336 2.05492 5.69336Z"
        fill="#45FFDE"
      />
      <path
        d="M5.68383 3.375C4.98773 3.375 4.42383 3.9389 4.42383 4.635V13.365C4.42383 14.0611 4.98773 14.625 5.68383 14.625C6.37992 14.625 6.94383 14.0611 6.94383 13.365V4.635C6.94383 3.9389 6.37992 3.375 5.68383 3.375Z"
        fill="#45FFDE"
      />
      <path
        d="M9.31273 0.541016C8.61664 0.541016 8.05273 1.10492 8.05273 1.80102V16.201C8.05273 16.8971 8.61664 17.461 9.31273 17.461C10.0088 17.461 10.5727 16.8971 10.5727 16.201V1.80102C10.5727 1.10492 10.0088 0.541016 9.31273 0.541016Z"
        fill="#45FFDE"
      />
      <path
        d="M16.5701 5.69336C15.874 5.69336 15.3101 6.25726 15.3101 6.95336V11.0484C15.3101 11.7445 15.874 12.3084 16.5701 12.3084C17.2662 12.3084 17.8301 11.7445 17.8301 11.0484V6.95336C17.8301 6.25726 17.2662 5.69336 16.5701 5.69336Z"
        fill="#45FFDE"
      />
      <path
        d="M12.9412 3.375C12.2451 3.375 11.6812 3.9389 11.6812 4.635V13.365C11.6812 14.0611 12.2451 14.625 12.9412 14.625C13.6372 14.625 14.2012 14.0611 14.2012 13.365V4.635C14.2012 3.9389 13.6372 3.375 12.9412 3.375Z"
        fill="#45FFDE"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect
          width="18"
          height="18"
          fill="white"
          transform="translate(0.3125)"
        />
      </clipPath>
    </defs>
  </svg>
);

const getRandomImageUrl = () => {
  return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.webp`);
};
