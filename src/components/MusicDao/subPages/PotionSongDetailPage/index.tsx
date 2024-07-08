import React, { useState } from 'react';
import axios from 'axios';
import Carousel from 'react-spring-3d-carousel';
import Cookies from 'js-cookie';

import Pagination from '@material-ui/lab/Pagination';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import Box from 'shared/ui-kit/Box';
import { Avatar, Color, FontSize, StyledDivider, Variant } from 'shared/ui-kit';
import {
  BackIcon,
  DropShadowIcon,
  ThreeArrowIcon
} from 'components/MusicDao/components/Icons/SvgIcons';
import { Text } from 'components/MusicDao/components/ui-kit';
import { useHistory, useParams } from 'react-router-dom';
import PolygonCard from 'components/MusicDao/components/Cards/PolygonCard';
import { getRandomAvatar } from 'shared/services/user/getUserAvatar';
import StakingCard from 'components/MusicDao/components/Cards/StakingCard';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import PrintChart from 'shared/ui-kit/Chart/Chart';
import URLTraxMicroservice from 'shared/functions/getURLMusicMicroservice';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import { BopsCard } from 'components/MusicDao/components/Cards/BopsCard';

import BreedBopModal from '../../modals/BreedBopModal';
import FeedBopModal from '../../modals/FeedBopModal';
import BopLevelUpModal from '../../modals/BopLevelUpModal';
import CreateBopModal from 'components/MusicDao/modals/CreateBop';

import { ArrowLeftIcon } from '../GovernancePage/styles';
import { potionSongDetailPageStyle } from './index.styles';

const TABLEHEADERS: Array<CustomTableHeaderInfo> = [
  {
    headerName: 'User',
    headerAlign: 'left'
  },
  {
    headerName: 'Beats breeding',
    headerAlign: 'center'
  },
  {
    headerName: 'Staked ',
    headerAlign: 'center'
  },
  {
    headerName: 'Bop level',
    headerAlign: 'center'
  }
];

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: 'line',
          label: '',
          data: [] as any[],
          pointRadius: 0,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          borderRadius: Number.MAX_VALUE,
          borderWidth: 1,
          lineTension: 0.2
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: '#ffffff00'
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 5,
          hoverRadius: 5
        }
      },

      legend: {
        display: false
      },

      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 20,
          bottom: 0
        }
      },

      scales: {
        xAxes: [
          {
            offset: true,
            display: true,
            gridLines: {
              color: '#ffffff00',
              lineWidth: 50
            },
            ticks: {
              beginAtZero: true,
              fontColor: '#6B6B6B'
            }
          }
        ],
        yAxes: [
          {
            display: true,
            offset: true,
            position: 'right',
            gridLines: {
              color: '#ffffff00',
              drawBorder: false
            },
            ticks: {
              display: true,
              beginAtZero: true
            }
          }
        ]
      },

      tooltips: {
        mode: 'label',
        intersect: false,
        callbacks: {
          //This removes the tooltip title
          title: function () {},
          label: function (tooltipItem, data) {
            return `$${tooltipItem.yLabel.toFixed(4)}`;
          }
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: 'nearest',
        caretSize: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        bodyFontSize: 15,
        bodyFontColor: '#303030'
      },

      plugins: {
        datalabels: {
          display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0;
          }
        }
      }
    }
  }
};
const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, 200);
    if (typeof config.data.datasets[index].backgroundColor === 'string') {
      gradient.addColorStop(0, config.data.datasets[index].backgroundColor);
      gradient.addColorStop(
        1,
        `${config.data.datasets[index].backgroundColor}33`
      );
      config.data.datasets[index].backgroundColor = gradient;
    }
  }

  return config;
};

const GRAPHOPTIONS = ['Beats', 'Staking Revenue'];

export default function PotionSongDetailPage() {
  const classes = potionSongDetailPageStyle();
  const params: any = useParams();
  const commonClasses = musicDaoPageStyles();
  const history = useHistory();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentSlider, setCurrentSlider] = useState<number>(0);

  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [graphOption, setGraphOption] = React.useState<string>(GRAPHOPTIONS[0]);
  const [rewardConfig, setRewardConfig] = React.useState<any>();

  const [openBreedBopModal, setOpenBreedBopModal] =
    React.useState<boolean>(false);
  const [openFeedBopModal, setOpenFeedBopModal] = useState<boolean>(false);
  const [openBopLevelUpModal, setOpenBopLevelUpModal] =
    useState<boolean>(false);

  const [openCreateBopModal, setOpenCreateBopModal] =
    React.useState<boolean>(false);

  const [song, setSong] = useState<any>();

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

  React.useEffect(() => {
    if (params.id) {
      setLoadingData(true);
      const token: string = Cookies.get('accessToken') || '';
      axios
        .get(`${URLTraxMicroservice()}/songs/getSongDetails/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((resp) => {
          const data = resp.data;
          if (data.success) {
            setSong(data.data);
          }
          setLoadingData(false);
        })
        .catch((e) => {});
    }
  }, [params.id]);

  React.useEffect(() => {
    const newRewardConfig1 = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig1.configurer = configurer;
    newRewardConfig1.config.data.labels = getAllHours();
    newRewardConfig1.config.data.datasets[0].data = getAllValues();
    newRewardConfig1.config.data.datasets[0].backgroundColor = '#65CB63';
    newRewardConfig1.config.data.datasets[0].borderColor = '#65CB63';
    newRewardConfig1.config.data.datasets[0].pointBackgroundColor = '#65CB63';
    newRewardConfig1.config.data.datasets[0].hoverBackgroundColor = '#65CB63';

    setRewardConfig(newRewardConfig1);
  }, []);

  const graph = React.useMemo(() => {
    if (rewardConfig) return <PrintChart config={rewardConfig} />;
  }, [rewardConfig]);

  const getAllHours = React.useCallback(() => {
    const result: string[] = [];
    for (let index = 1; index <= 23; index++) {
      result.push(index < 10 ? `0${index}` : `${index}`);
    }

    return result;
  }, []);

  const getAllValues = React.useCallback(() => {
    const result: number[] = [];
    for (let index = 1; index <= 23; index++) {
      result.push(Math.floor(Math.random() * 10000));
    }

    return result;
  }, []);

  const renderTopCard = () => {
    return (
      <Box textAlign="center">
        <Box className={classes.podCard}>
          <Box className={classes.innerBox}>
            <Box className={classes.podImageContent}>
              <div
                className={classes.podImage}
                style={{
                  backgroundImage: `url("${
                    song.album_image ?? getRandomImageUrl()
                  }")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  overflow: 'hidden'
                }}
              ></div>
              <Box className={classes.bopAvatarBox}>
                {song.artists && song.artists.length > 0 ? (
                  song.artists.map((artist, index) => (
                    <Box
                      className={
                        index === 0 ? classes.bopAvatar : classes.bopAvatar1
                      }
                      key={index}
                      ml={index > 0 ? -1 : 0}
                      zIndex={song.artists.length - index}
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
                      src={song.artist_image}
                      width="100%"
                      height="100%"
                      style={{ borderRadius: '100%' }}
                      title={song.artist_name || ''}
                    />
                  </Box>
                )}
              </Box>
            </Box>
            <Box
              className={`${classes.podCard} ${classes.podCardContent}`}
              style={{
                background:
                  'linear-gradient(180deg, #FFA800 35.71%, rgba(255, 154, 81, 0) 102.86%)'
              }}
            >
              <Box
                className={classes.podCard}
                style={{
                  background:
                    'linear-gradient(180deg, #FFA800 35.71%, rgba(255, 154, 81, 0) 102.86%)'
                }}
              >
                <Box
                  display="flex"
                  alignItems="flex-end"
                  justifyContent="center"
                >
                  🌟
                  <Box mx={1} className={classes.header1}>
                    🌟
                  </Box>
                  🌟
                </Box>
                <Box className={classes.header4} mt={1} paddingBottom={5}>
                  Most Listened <br />
                  This Month
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className={classes.shadowBox} />
        </Box>
        <DropShadowIcon />
      </Box>
    );
  };

  const renderTopStaking = () => {
    return (
      <Box mt={-25}>
        <Box
          display="flex"
          alignItems="flex-end"
          justifyContent="center"
          width={1}
        >
          {topStakingUsers.map((user, index) => (
            <Box mx={index === 1 ? 3 : 0}>
              <StakingCard
                user={user}
                rank={index === 0 ? 2 : index === 2 ? 3 : 1}
                type={1}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    [1, 2, 3, 4, 5, 6, 6].map((item) => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Box className={classes.header2} mr={2}>
              {item + 2}
            </Box>
            <Box className={classes.imgBox}>
              <img
                src={require('assets/backgrounds/music_art.webp')}
                className={classes.img}
              />
              <Box className={classes.avatarBox}>
                <Avatar size="small" url={getRandomAvatar()} />
              </Box>
            </Box>
            <Box className={classes.tableHeader1} ml={2}>
              Sabrina Spellman
            </Box>
          </Box>
        ),
        cellAlign: 'left'
      });
      row.push({
        cell: (
          <Box className={classes.tableHeader2} ml={2}>
            0.053 USDT/Potion
          </Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <Box className={classes.tableHeader2} ml={2}>
            24255 TRAX
          </Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <Box className={classes.tableHeader3} ml={2}>
            224 TPR
          </Box>
        ),
        cellAlign: 'center'
      });

      tableData.push(row);
    });

    return tableData;
  };

  const renderTopStakingList = () => {
    return (
      <Box mx={8}>
        <CustomTable
          headers={TABLEHEADERS}
          rows={getTableData()}
          placeholderText="No Slot"
          theme="transCards"
          variant={Variant.Transparent}
          radius={20}
        />
      </Box>
    );
  };

  return (
    <LoadingWrapper loading={loadingData}>
      {song && (
        <Box className={classes.container}>
          <Box className={classes.backgroundBox} />
          <Box
            display="flex"
            flexDirection="row"
            onClick={() => history.goBack()}
            zIndex={1}
            position="absolute"
            top={50}
            left={50}
            style={{ cursor: 'pointer' }}
          >
            <BackIcon />
            <Box ml={1} color={Color.White}>
              BACK
            </Box>
          </Box>
          <Box className={classes.body}>
            <Box className={classes.cardBox}>{renderTopCard()}</Box>
            <Box className={classes.contentBox} mt={15}>
              <Box className={classes.whiteBox}>
                <Box className={classes.songInfoHeader}>
                  <Box className={classes.descriptionBox}>
                    <Box className={classes.header1}>{song.song_name}</Box>
                    <Box
                      className={classes.header2}
                      mt={1}
                      style={{ opacity: 0.8 }}
                    >
                      {song.artist_name}
                    </Box>
                    <Box
                      className={classes.header3}
                      mt={1}
                      style={{ opacity: 0.8 }}
                    >
                      {song.album_name}
                    </Box>
                    <Box display="flex" alignItems="center" mt={2}>
                      {song.tags?.map((tag, index) => (
                        <Box
                          className={classes.tagBox}
                          key={index}
                          ml={index > 0 ? 1 : 0}
                        >
                          {tag}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      className={classes.customButtonBox}
                      onClick={() => setOpenCreateBopModal(true)}
                    >
                      <ConfirmIcon color={Color.MusicDAODark} />
                      <Box
                        className={classes.header2}
                        style={{ color: 'white' }}
                        zIndex={1}
                        onClick={() => setOpenCreateBopModal(true)}
                        mx={isMobile ? 3 : 5}
                      >
                        Create a Bop!
                      </Box>
                      <ThreeArrowIcon />
                    </Box>
                    <Box className={classes.customButtonBox} mt={3}>
                      <ConfirmIcon />
                      <Box
                        className={classes.header2}
                        style={{ color: 'white' }}
                        mx={5}
                        onClick={() => setOpenBreedBopModal(true)}
                        zIndex={1}
                      >
                        Breed Bop
                      </Box>
                      <ThreeArrowIcon />
                    </Box>
                  </Box>
                </Box>
                <Box
                  pb={2}
                  style={{
                    background: 'white',
                    borderBottomLeftRadius: '32px',
                    borderBottomRightRadius: '32px'
                  }}
                >
                  {isMobile ? (
                    <>
                      <Box display="flex" justifyContent="center" pt={5}>
                        <PolygonCard
                          isStaking
                          type={0}
                          value={song.BopTraxStaked}
                          description={'TRAX Staked'}
                        />
                        <PolygonCard
                          isStaking
                          type={1}
                          value={`${song.BopUSDStaked || 0} USDT`}
                          description={'Total USD Staked'}
                        />
                      </Box>
                      <Box display="flex" justifyContent="center" pt={2}>
                        <PolygonCard
                          isStaking
                          type={3}
                          value={'2424'}
                          description={'Beats Awarded'}
                        />
                        <PolygonCard
                          isStaking
                          type={2}
                          value={'100000 USDT'}
                          description={'Accured for staking rewards'}
                        />
                      </Box>
                      <Box display="flex" justifyContent="center" pt={2}>
                        <PolygonCard
                          isStaking={false}
                          type={0}
                          value={'2434353'}
                          description={'Times Played in 7 days '}
                        />
                        <PolygonCard
                          isStaking={false}
                          type={1}
                          value="2424455"
                          description={'Shared times over last week'}
                        />
                      </Box>
                      <Box display="flex" justifyContent="center" mb={3}>
                        <PolygonCard
                          isStaking={false}
                          type={2}
                          value={'2424'}
                          description={'Total Fruits'}
                        />
                      </Box>
                    </>
                  ) : isTablet ? (
                    <>
                      <Box display="flex" justifyContent="center" pt={5}>
                        <PolygonCard
                          isStaking
                          type={0}
                          value={song.BopTraxStaked}
                          description={'TRAX Staked'}
                        />
                        <PolygonCard
                          isStaking
                          type={1}
                          value={`${song.BopUSDStaked || 0} USDT`}
                          description={'Total USD Staked'}
                        />
                        <PolygonCard
                          isStaking
                          type={3}
                          value={'2424'}
                          description={'Beats Awarded'}
                        />
                      </Box>
                      <Box display="flex" justifyContent="center">
                        <PolygonCard
                          isStaking
                          type={2}
                          value={'100000 USDT'}
                          description={'Accured for staking rewards'}
                        />
                      </Box>
                      <Box display="flex" justifyContent="center" mb={3}>
                        <PolygonCard
                          isStaking={false}
                          type={0}
                          value={'2434353'}
                          description={'Times Played in 7 days '}
                        />
                        <PolygonCard
                          isStaking={false}
                          type={1}
                          value="2424455"
                          description={'Shared times over last week'}
                        />
                        <PolygonCard
                          isStaking={false}
                          type={2}
                          value={'2424'}
                          description={'Total Fruits'}
                        />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box display="flex" justifyContent="center" pt={5}>
                        <PolygonCard
                          isStaking
                          type={0}
                          value={song.BopTraxStaked || 0}
                          description={'TRAX Staked'}
                        />
                        <PolygonCard
                          isStaking
                          type={1}
                          value={`${song.BopUSDStaked || 0} USDT`}
                          description={'Total USD Staked'}
                        />
                        <PolygonCard
                          isStaking
                          type={3}
                          value={'2424'}
                          description={'Beats Awarded'}
                        />
                        <PolygonCard
                          isStaking
                          type={2}
                          value={'100000 USDT'}
                          description={'Accured for staking rewards'}
                        />
                      </Box>
                      <Box display="flex" justifyContent="center" mb={3}>
                        <PolygonCard
                          isStaking={false}
                          type={0}
                          value={'2434353'}
                          description={'Times Played in 7 days '}
                        />
                        <PolygonCard
                          isStaking={false}
                          type={1}
                          value="2424455"
                          description={'Shared times over last week'}
                        />
                        <PolygonCard
                          isStaking={false}
                          type={2}
                          value={'2424'}
                          description={'Total Fruits'}
                        />
                      </Box>
                    </>
                  )}

                  <Box className={classes.header1} mt={2} textAlign="center">
                    Bops level overview
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width={1}
                    px={3}
                  >
                    <Box
                      className={classes.arrowBox}
                      mr={2}
                      onClick={() => setCurrentSlider((prev) => prev - 1)}
                    >
                      <Box
                        style={{ transform: 'rotate(180deg)' }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <ArrowLeftIcon />
                      </Box>
                    </Box>
                    <Box className={classes.carouselBox}>
                      <Carousel
                        slides={[1, 2, 3, 4, 5, 6, 7].map((data) => {
                          return {
                            key: `uuid_${data}_2`,
                            content: <BopsCard data={{ level: data }} />
                          };
                        })}
                        goToSlide={currentSlider}
                        showNavigation={false}
                        offsetRadius={isMobile ? 1 : 3}
                        animationConfig={{ tension: 170, friction: 26 }}
                      />
                    </Box>
                    <Box
                      className={classes.arrowBox}
                      ml={2}
                      onClick={() => setCurrentSlider((prev) => prev + 1)}
                    >
                      <ArrowLeftIcon />
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="center" mt={7}>
                    <Box className={classes.tabBarBox} mt={-3}>
                      <Box
                        className={`${classes.tabBarItem} ${
                          activeTab === 0 ? classes.tabBarItemActive : ''
                        }`}
                        onClick={() => setActiveTab(0)}
                      >
                        Track Stats
                      </Box>
                      <Box
                        className={`${classes.tabBarItem} ${
                          activeTab === 1 ? classes.tabBarItemActive2 : ''
                        }`}
                        onClick={() => setActiveTab(1)}
                      >
                        Leaderboard
                      </Box>
                    </Box>
                  </Box>
                  {activeTab === 1 && (
                    <>
                      <Box className={classes.headerTitle} mt={5}>
                        Leaderboard
                      </Box>
                      <Box className={classes.stakingBox} mx={10} mt={25}>
                        {renderTopStaking()}
                        <Box mt={4}>{renderTopStakingList()}</Box>
                      </Box>
                      <Box className={classes.pagination}>
                        <Pagination count={10} onChange={() => {}} />
                      </Box>
                    </>
                  )}
                  {activeTab === 0 && (
                    <Box className={classes.graphBox} mx={10} mt={2}>
                      <Box className={classes.controlParentBox}>
                        <Box className={classes.header1}>
                          Beats given over time1
                        </Box>
                        <Box className={classes.controlBox}>
                          <Box className={classes.liquidityBox}>
                            {GRAPHOPTIONS.map((item, index) => (
                              <button
                                key={`option-button-${index}`}
                                className={`${commonClasses.groupButton} ${
                                  item === graphOption &&
                                  commonClasses.selectedGroupButton
                                }`}
                                onClick={() => setGraphOption(item)}
                                style={{ marginLeft: index > 0 ? '8px' : 0 }}
                              >
                                {item}
                              </button>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                      <Box mt={4}>
                        <StyledDivider type="solid" />
                      </Box>
                      <Box
                        display="flex"
                        alignItems="flex-end"
                        justifyContent="flex-end"
                        width={1}
                        pr={1}
                      >
                        <Text size={FontSize.S} style={{ fontWeight: 600 }}>
                          USDT
                        </Text>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="flex-end"
                        justifyContent="space-between"
                        width={1}
                      >
                        <Text
                          size={FontSize.S}
                          style={{ fontWeight: 600, marginBottom: 4 }}
                        >
                          Hours
                        </Text>
                        <Box height="250px" width={1}>
                          {graph}
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {openBreedBopModal && (
        <BreedBopModal
          open={openBreedBopModal}
          onClose={() => setOpenBreedBopModal(false)}
          selectedBop={{}}
          onConfirm={() => {
            setOpenBreedBopModal(false);
            setOpenFeedBopModal(true);
          }}
        />
      )}
      {openFeedBopModal && (
        <FeedBopModal
          open={openFeedBopModal}
          onClose={() => setOpenFeedBopModal(false)}
          onConfirm={() => {
            setOpenFeedBopModal(false);
            setOpenBopLevelUpModal(true);
          }}
        />
      )}
      {openBopLevelUpModal && (
        <BopLevelUpModal
          open={openBopLevelUpModal}
          onClose={() => setOpenBopLevelUpModal(false)}
          onConfirm={() => {
            setOpenBopLevelUpModal(false);
          }}
        />
      )}
      {openCreateBopModal && (
        <CreateBopModal
          song={song}
          open={openCreateBopModal}
          handleClose={() => setOpenCreateBopModal(false)}
        />
      )}
    </LoadingWrapper>
  );
}

const getRandomImageUrl = () => {
  return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.webp`);
};

export const ConfirmIcon = ({ color = '#FF8E3C' }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 344 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 21.7229C0 14.7351 5.31938 8.91027 12.2842 8.34491C40.4709 6.05689 111.986 0.779785 172 0.779785C232.014 0.779785 303.529 6.05689 331.716 8.34491C338.681 8.91027 344 14.7352 344 21.7229V46.8983C344 53.8224 338.795 59.6138 331.901 60.2554C303.472 62.9014 230.408 69.1237 172 69.1237C113.592 69.1237 40.5281 62.9014 12.0989 60.2554C5.20458 59.6138 0 53.8224 0 46.8983V21.7229Z"
      fill={color}
    />
  </svg>
);
