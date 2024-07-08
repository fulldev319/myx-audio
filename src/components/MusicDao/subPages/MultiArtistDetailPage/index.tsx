import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import withStyles from '@material-ui/core/styles/withStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import MenuItem from '@material-ui/core/MenuItem';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import UserCard from 'components/MusicDao/components/Cards/UserCard';
import { ArrowIcon } from '../../components/Icons/SvgIcons';

import {
  Avatar,
  PrimaryButton,
  SecondaryButton,
  StyledDivider,
  Variant
} from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { useShareMedia } from 'shared/contexts/ShareMediaContext';
// import { FruitSelect } from 'shared/ui-kit/Select/FruitSelect';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import PrintChart from 'shared/ui-kit/Chart/Chart';
import { getRandomAvatar } from 'shared/services/user/getUserAvatar';
import MessageWidget from 'shared/ui-kit/Chat/MessageWidget';
import { processImage } from 'shared/helpers';

import { ReactComponent as ShareIcon } from 'assets/icons/share_filled.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as MinusIcon } from 'assets/icons/minus.svg';
import { multiArtistPageStyles } from './index.styles';

// mock data
const mockArtistData = {
  name: 'Drake',
  followers: 1450,
  fruits: [23, 34, 123],
  songs: [
    {
      name: 'Nothings Into Somethings',
      album: 'Jazz',
      genre: 'Hip Hop',
      chain: 'Music Chain',
      fundsClaimed: '2445'
    },
    {
      name: 'Nothings Into Somethings',
      album: 'Jazz',
      genre: 'Hip Hop',
      chain: 'Music Chain',
      fundsClaimed: '2445'
    },
    {
      name: 'Nothings Into Somethings',
      album: 'Jazz',
      genre: 'Hip Hop',
      chain: 'Music Chain',
      fundsClaimed: '2445'
    },
    {
      name: 'Nothings Into Somethings',
      album: 'Jazz',
      genre: 'Hip Hop',
      chain: 'Music Chain',
      fundsClaimed: '2445'
    },
    {
      name: 'Nothings Into Somethings',
      album: 'Jazz',
      genre: 'Hip Hop',
      chain: 'Music Chain',
      fundsClaimed: '2445'
    },
    {
      name: 'Nothings Into Somethings',
      album: 'Jazz',
      genre: 'Hip Hop',
      chain: 'Music Chain',
      fundsClaimed: '2445'
    }
  ],
  isClaimed: false
};

const CustomMenuItem = withStyles({
  root: {
    fontSize: '14px'
  }
})(MenuItem);

const tableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: 'User'
  },
  {
    headerName: 'Address',
    headerAlign: 'center'
  },
  {
    headerName: 'Date',
    headerAlign: 'center'
  },
  {
    headerName: 'Time',
    headerAlign: 'center'
  },
  {
    headerName: 'Played Time',
    headerAlign: 'center'
  },
  {
    headerName: 'Revenue',
    headerAlign: 'center'
  },
  {
    headerName: 'MusicScan',
    headerAlign: 'center'
  }
];

const TABS = ['Stats', 'Chat', 'Distribution Proposals'];

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
          borderWidth: 0,
          lineTension: 0.2,
          barPercentage: 0.3
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: '#F7F9FECC'
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
            display: false,
            gridLines: {
              color: '#ffffff',
              lineWidth: 50,
              drawOnChartArea: false
            },
            ticks: {
              beginAtZero: false,
              fontColor: '#6B6B6B'
            }
          }
        ],
        yAxes: [
          {
            display: false,
            position: 'right',
            gridLines: {
              color: '#EFF2F8',
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
    gradient.addColorStop(0, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(0.6, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(
      1,
      `${config.data.datasets[index].backgroundColor}33`
    );
    config.data.datasets[0].backgroundColor = gradient;
  }

  return config;
};

const Artists = [
  {
    price: '50 Cent',
    slug: 'piptycent',
    proposals: 1
  },
  {
    price: '50 Cent',
    slug: 'piptycent',
    proposals: 0
  },
  {
    price: '50 Cent',
    slug: 'piptycent',
    proposals: 2
  },
  {
    price: '50 Cent',
    slug: 'piptycent',
    proposals: 3
  },
  {
    price: '50 Cent',
    slug: 'piptycent',
    proposals: 2
  }
];

const Proposals = [
  {
    price: '50 Cent',
    slug: 'piptycent',
    proposer: true,
    rate: 20,
    pUSD: 'pUSD 171 ($171)',
    status: 'Accepted'
  },
  {
    price: '50 Cent',
    slug: 'piptycent',
    proposer: false,
    rate: 10,
    pUSD: 'pUSD 171 ($171)',
    status: 'Accepted'
  },
  {
    price: '50 Cent',
    slug: 'piptycent',
    proposer: false,
    rate: 50,
    pUSD: 'pUSD 171 ($171)',
    status: 'Accepted'
  },
  {
    price: '50 Cent',
    slug: 'piptycent',
    proposer: false,
    rate: 5,
    pUSD: 'pUSD 171 ($171)',
    status: 'Declined'
  },
  {
    price: '50 Cent',
    slug: 'piptycent',
    proposer: false,
    rate: 5,
    pUSD: 'pUSD 171 ($171)',
    status: 'Pending'
  }
];

export default function MutilArtistDetailPage() {
  const classes = multiArtistPageStyles();
  const params: any = useParams();
  const history = useHistory();

  const [artist, setArtist] = useState<any>(mockArtistData);
  const [loadingArtists, setLoadingArtist] = useState<boolean>(false);

  const [creators, setCreators] = useState<any[]>([{ name: 'tester' }]);
  const [followed, setFollowed] = React.useState<boolean>(false);

  const [currentTab, setCurrentTab] = React.useState<number>(2);

  const [openSaluteModal, setOpenSaluteModal] = useState<boolean>(false);

  const [openShareMenu, setOpenShareMenu] = React.useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const theme = useTheme();
  const tabletMatch = useMediaQuery(theme.breakpoints.down('md'));
  const mobileMatch = useMediaQuery(theme.breakpoints.down('xs'));

  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const [rewardConfig1, setRewardConfig1] = React.useState<any>();

  const [artists, setArtists] = useState<any[]>(Artists);
  const [chat, setChat] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const [proposals, setProposals] = useState<any[]>(Proposals);

  useEffect(() => {
    setLoadingArtist(true);
    // call api for getting vote list
    setLoadingArtist(false);

    const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig.configurer = configurer;
    newRewardConfig.config.data.labels = getAllHours();
    newRewardConfig.config.data.datasets[0].data = getAllValues();
    newRewardConfig.config.data.datasets[0].backgroundColor = '#7F6FFF';
    newRewardConfig.config.data.datasets[0].borderColor = '#7F6FFF';
    newRewardConfig.config.data.datasets[0].pointBackgroundColor = '#7F6FFF';
    newRewardConfig.config.data.datasets[0].hoverBackgroundColor = '#7F6FFF';
    newRewardConfig.config.options.scales.xAxes[0].offset = true;
    newRewardConfig.config.options.scales.yAxes[0].ticks.display = true;

    setRewardConfig(newRewardConfig);

    const newRewardConfig1 = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig1.configurer = configurer;
    newRewardConfig1.config.data.labels = getAllHours();
    newRewardConfig1.config.data.datasets[0].data = getAllValues();
    newRewardConfig1.config.data.datasets[0].backgroundColor = '#9C30C2';
    newRewardConfig1.config.data.datasets[0].borderColor = '#9C30C2';
    newRewardConfig1.config.data.datasets[0].pointBackgroundColor = '#9C30C2';
    newRewardConfig1.config.data.datasets[0].hoverBackgroundColor = '#9C30C2';
    newRewardConfig1.config.options.scales.xAxes[0].offset = true;
    newRewardConfig1.config.options.scales.yAxes[0].ticks.display = true;

    setRewardConfig1(newRewardConfig1);
  }, []);

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

  const showShareMenu = () => {
    setOpenShareMenu(true);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorShareMenuRef.current &&
      anchorShareMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleOpenQRCodeModal = () => {
    const link = window.location.href.includes('NFT')
      ? `Artists/${params.artistId}`
      : `FT/${params.artistId}`;
    shareMediaWithQrCode(params.artistId, link);
  };

  const handleOpenShareModal = () => {
    const link = window.location.href.includes('NFT')
      ? `MediaNFT/${params.artistId}`
      : `FT/${params.artistId}`;
    shareMediaToSocial(params.artistId, 'Capsule', 'NEW-MUSIC-PODS', link);
  };

  const handleFollow = () => {};

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    artist.songs.map((item) => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box display="flex" alignItems="center">
            <Avatar size="medium" url={getRandomAvatar()} />
            <Box display="flex" flexDirection="column" ml={2}>
              <Box className={classes.header4} color={'#181818 !important'}>
                Sabrina Spellman
              </Box>
              <Box className={classes.header4}>@user_name</Box>
            </Box>
          </Box>
        )
      });
      row.push({
        cell: (
          <Box className={classes.header4} color={'#65CB63 !important'}>
            0xcD242...294
          </Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <Box className={classes.header4} color={'#54658F !important'}>
            Thu, 04 Mar
          </Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <Box className={classes.header4} color={'#54658F !important'}>
            10:30 PM
          </Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <Box className={classes.header4} color={'#54658F !important'}>
            45m 23s
          </Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <Box className={classes.header4} color={'#54658F !important'}>
            pUSD 1.23
          </Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <svg
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5991 0.76759L7.59909 10.7676M17.5991 0.76759L17.5992 6.76759M17.5991 0.76759L11.5991 0.767578M7.59912 0.76759H1.59912V16.7676H17.5991V10.7676"
              stroke="#65CB63"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        cellAlign: 'center'
      });

      tableData.push(row);
    });

    return tableData;
  };

  const getMessages = (chatInfo?: any, isNew?: boolean): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!isNew && (loadingMessages || !hasMore)) {
        resolve(0);
        return;
      }
      setLoadingMessages(true);
      resolve(0);
    });
  };

  return (
    <Box className={classes.content}>
      <Box className={classes.gradient} />
      {mobileMatch ? (
        <Box zIndex={1}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            style={{ cursor: 'pointer' }}
            onClick={() => history.goBack()}
            mb={3}
          >
            <Box>
              <ArrowIcon color={'#54658F'} />
            </Box>
            <Box
              color="#54658F"
              fontSize={14}
              fontWeight={700}
              ml="5px"
              mb="4px"
            >
              BACK
            </Box>
          </Box>
          <Box position="relative" height={441}>
            <img
              src={require('assets/anonAvatars/ToyFaces_Colored_BG_061.webp')}
              style={{
                objectFit: 'cover',
                borderRadius: '16px',
                width: '100%',
                height: '100%',
                position: 'absolute'
              }}
            />
          </Box>
          <Box className={classes.header2} mt={2}>
            Artist Profile
          </Box>
          <Box className={classes.headerTitle} mt={2}>
            {artist.name}
          </Box>
          <Box
            mt={2.5}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box>
              <Box className={classes.header1}>{artist.followers}</Box>
              <Box className={classes.header3}>Followers</Box>
            </Box>
            <Box>
              <Box className={classes.header1}>{artist.songs.length}</Box>
              <Box className={classes.header3}>Tracks</Box>
            </Box>
          </Box>
          <Box mt={3.5}>
            <Box className={classes.flexBox}>
              <Box className={classes.flexBox}>
                <img src={require('assets/emojiIcons/watermelon.webp')} />
                <Box className={classes.header1} ml={1}>
                  {mockArtistData.fruits[0]}
                </Box>
              </Box>
              <Box className={classes.flexBox} ml={2}>
                <img src={require('assets/emojiIcons/avocado.webp')} />
                <Box className={classes.header1} ml={1}>
                  {mockArtistData.fruits[1]}
                </Box>
              </Box>
              <Box className={classes.flexBox} ml={2}>
                <img src={require('assets/emojiIcons/orange.webp')} />
                <Box className={classes.header1} ml={1}>
                  {mockArtistData.fruits[2]}
                </Box>
              </Box>
            </Box>
            <Box ml={2.5} className={classes.header3}>
              Fruits
            </Box>
          </Box>
          <Box mt={2} className={classes.flexBox}>
            <Box className={classes.flexBox}>
              {creators.map((creator, index) => (
                <Box
                  ml={index > 1 ? '-16px' : 0}
                  key={index}
                  onClick={() => {
                    history.push(`/profile/${creator.id}`);
                  }}
                  title={creator?.name}
                  style={{ cursor: 'pointer' }}
                >
                  <Avatar
                    size="medium"
                    url={
                      creator?.imageURL
                        ? `url(${processImage(creator?.imageURL)})`
                        : require('assets/anonAvatars/ToyFaces_Colored_BG_035.webp')
                    }
                  />
                </Box>
              ))}
            </Box>
            <Box ml={2} className={classes.svgBox}>
              <div ref={anchorShareMenuRef}>
                <ShareIcon onClick={showShareMenu} />
              </div>
            </Box>
            {openShareMenu && (
              <Popper
                open={openShareMenu}
                anchorEl={anchorShareMenuRef.current}
                transition
                disablePortal={false}
                style={{ position: 'inherit' }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom',
                      position: 'inherit'
                    }}
                  >
                    <Paper className={classes.paper}>
                      <ClickAwayListener onClickAway={handleCloseShareMenu}>
                        <MenuList
                          autoFocusItem={openShareMenu}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDownShareMenu}
                        >
                          <CustomMenuItem onClick={handleOpenShareModal}>
                            <img
                              src={require('assets/icons/butterfly.webp')}
                              alt={'spaceship'}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            Share on social media
                          </CustomMenuItem>
                          <CustomMenuItem onClick={handleOpenQRCodeModal}>
                            <img
                              src={require('assets/icons/qrcode_small.webp')}
                              alt={'spaceship'}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            Share With QR Code
                          </CustomMenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            )}
            <Box
              ml={2}
              className={classes.whiteBox}
              style={{ cursor: 'pointer' }}
            >
              <Box className={classes.svgBox}>
                {!followed ? <PlusIcon /> : <MinusIcon />}
              </Box>
              <Box ml={1} onClick={handleFollow}>
                {followed ? 'Unfollow' : 'Follow'}
              </Box>
            </Box>
            {/* <Box ml={2}>
              <FruitSelect fruitObject={{}} members={[]} />
            </Box> */}
          </Box>
          <StyledDivider type="solid" mt={2} />
          <Box mt={2}>
            {!artist.isClaimed && (
              <PrimaryButton
                size="medium"
                onClick={() => setOpenSaluteModal(true)}
                style={{
                  background: '#2D3047',
                  marginTop: 16,
                  height: 52,
                  paddingLeft: '48px',
                  paddingRight: '48px'
                }}
                isRounded
              >
                <Box className={classes.flexBox} color={'white !important'}>
                  <Box className={classes.header2} color={'white !important'}>
                    Claim Profile
                  </Box>
                  <Box ml={1} className={classes.flexBox}>
                    <img
                      src={require('assets/icons/verified_filled_gradient.webp')}
                    />
                  </Box>
                </Box>
              </PrimaryButton>
            )}
            <PrimaryButton
              size="medium"
              onClick={() => {}}
              style={{ background: '#65CB63', marginTop: 16, height: 52 }}
            >
              <Box className={classes.flexBox} color={'white !important'}>
                <Box className={classes.header2} color={'white !important'}>
                  🤑 Funds to claim
                </Box>
                <Box
                  className={classes.header1}
                  color={'white !important'}
                  ml={1}
                >
                  pUSD 21.304
                </Box>
              </Box>
            </PrimaryButton>
            <Box className={classes.flexBox} mt={2}>
              <img src={require('assets/icons/info_gray.webp')} />
              <Box className={classes.header4} ml={1} style={{ fontSize: 9 }}>
                All Artist Must Verify Their Profiles in Order to Claim Funds
              </Box>
            </Box>
          </Box>
        </Box>
      ) : tabletMatch ? (
        <Box zIndex={1}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            style={{ cursor: 'pointer' }}
            onClick={() => history.goBack()}
            mb={3}
          >
            <Box>
              <ArrowIcon color={'#54658F'} />
            </Box>
            <Box
              color="#54658F"
              fontSize={14}
              fontWeight={700}
              ml="5px"
              mb="4px"
            >
              BACK
            </Box>
          </Box>
          <Grid container spacing={4}>
            <Grid item md={6}>
              <Box className={classes.header2} mt={2}>
                Artist Profile
              </Box>
              <Box className={classes.headerTitle} mt={2}>
                {artist.name}
              </Box>
              <Box>
                <Box className={classes.header1}>{artist.followers}</Box>
                <Box className={classes.header3}>Followers</Box>
              </Box>
              <Box mt={3.5}>
                <Box className={classes.flexBox}>
                  <Box className={classes.flexBox}>
                    <img src={require('assets/emojiIcons/watermelon.webp')} />
                    <Box className={classes.header1} ml={1}>
                      {mockArtistData.fruits[0]}
                    </Box>
                  </Box>
                  <Box className={classes.flexBox} ml={2}>
                    <img src={require('assets/emojiIcons/avocado.webp')} />
                    <Box className={classes.header1} ml={1}>
                      {mockArtistData.fruits[1]}
                    </Box>
                  </Box>
                  <Box className={classes.flexBox} ml={2}>
                    <img src={require('assets/emojiIcons/orange.webp')} />
                    <Box className={classes.header1} ml={1}>
                      {mockArtistData.fruits[2]}
                    </Box>
                  </Box>
                </Box>
                <Box ml={2.5} className={classes.header3}>
                  Fruits
                </Box>
              </Box>
              <Box mt={2.5}>
                <Box className={classes.header1}>{artist.songs.length}</Box>
                <Box className={classes.header3}>Tracks</Box>
              </Box>
              <Box mt={2} className={classes.flexBox}>
                <Box className={classes.flexBox}>
                  {creators.map((creator, index) => (
                    <Box
                      ml={index > 1 ? '-16px' : 0}
                      key={index}
                      onClick={() => {
                        history.push(`/profile/${creator.id}`);
                      }}
                      title={creator?.name}
                      style={{ cursor: 'pointer' }}
                    >
                      <Avatar
                        size="medium"
                        url={
                          creator?.imageURL
                            ? `url(${processImage(creator?.imageURL)})`
                            : require('assets/anonAvatars/ToyFaces_Colored_BG_035.webp')
                        }
                      />
                    </Box>
                  ))}
                </Box>
                <Box ml={2} className={classes.svgBox}>
                  <div ref={anchorShareMenuRef}>
                    <ShareIcon onClick={showShareMenu} />
                  </div>
                </Box>
                {openShareMenu && (
                  <Popper
                    open={openShareMenu}
                    anchorEl={anchorShareMenuRef.current}
                    transition
                    disablePortal={false}
                    style={{ position: 'inherit' }}
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === 'bottom'
                              ? 'center top'
                              : 'center bottom',
                          position: 'inherit'
                        }}
                      >
                        <Paper className={classes.paper}>
                          <ClickAwayListener onClickAway={handleCloseShareMenu}>
                            <MenuList
                              autoFocusItem={openShareMenu}
                              id="menu-list-grow"
                              onKeyDown={handleListKeyDownShareMenu}
                            >
                              <CustomMenuItem onClick={handleOpenShareModal}>
                                <img
                                  src={require('assets/icons/butterfly.webp')}
                                  alt={'spaceship'}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    marginRight: 5
                                  }}
                                />
                                Share on social media
                              </CustomMenuItem>
                              <CustomMenuItem onClick={handleOpenQRCodeModal}>
                                <img
                                  src={require('assets/icons/qrcode_small.webp')}
                                  alt={'spaceship'}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    marginRight: 5
                                  }}
                                />
                                Share With QR Code
                              </CustomMenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                )}
                <Box
                  ml={2}
                  className={classes.whiteBox}
                  style={{ cursor: 'pointer' }}
                >
                  <Box className={classes.svgBox}>
                    {!followed ? <PlusIcon /> : <MinusIcon />}
                  </Box>
                  <Box ml={1} onClick={handleFollow}>
                    {followed ? 'Unfollow' : 'Follow'}
                  </Box>
                </Box>
                {/* <Box ml={2}>
                  <FruitSelect fruitObject={{}} members={[]} />
                </Box> */}
              </Box>
            </Grid>
            <Grid item md={6} style={{ position: 'relative' }}>
              <img
                src={require('assets/anonAvatars/ToyFaces_Colored_BG_061.webp')}
                style={{
                  objectFit: 'cover',
                  borderRadius: '16px',
                  height: '90%',
                  position: 'absolute'
                }}
              />
            </Grid>
          </Grid>
          <Box
            mt={2}
            className={classes.flexBox}
            justifyContent="space-between"
          >
            <PrimaryButton
              size="medium"
              onClick={() => {}}
              style={{ background: '#65CB63', marginTop: 16, height: 52 }}
            >
              <Box className={classes.flexBox} color={'white !important'}>
                <Box className={classes.header2} color={'white !important'}>
                  🤑 Funds to claim
                </Box>
                <Box
                  className={classes.header1}
                  color={'white !important'}
                  ml={1}
                >
                  pUSD 21.304
                </Box>
              </Box>
            </PrimaryButton>
            {!artist.isClaimed && (
              <PrimaryButton
                size="medium"
                onClick={() => setOpenSaluteModal(true)}
                style={{
                  background: '#2D3047',
                  marginTop: 16,
                  height: 52,
                  paddingLeft: '48px',
                  paddingRight: '48px'
                }}
                isRounded
              >
                <Box className={classes.flexBox} color={'white !important'}>
                  <Box className={classes.header2} color={'white !important'}>
                    Claim Profile
                  </Box>
                  <Box ml={1} className={classes.flexBox}>
                    <img
                      src={require('assets/icons/verified_filled_gradient.webp')}
                    />
                  </Box>
                </Box>
              </PrimaryButton>
            )}
          </Box>
          <Box className={classes.flexBox} mt={2}>
            <img src={require('assets/icons/info_gray.webp')} />
            <Box className={classes.header4} ml={1}>
              All Artist Must Verify Their Profiles in Order to Claim Funds
            </Box>
          </Box>
        </Box>
      ) : (
        <Grid container style={{ zIndex: 1, position: 'relative' }} spacing={8}>
          <Grid item xs={12} sm={8}>
            <Box display="flex" alignItems="center">
              <Box className={classes.header2} fontSize={'18px !important'}>
                Sabrina Spellman
              </Box>
              <Box
                width={5}
                height={5}
                borderRadius="100%"
                bgcolor="#54658F"
                mx={1.5}
              />
              <Box
                className={classes.header2}
                fontSize={'18px !important'}
                fontWeight={'400 !important'}
              >
                Collection Name
              </Box>
            </Box>
            <Box className={classes.headerTitle} mt={2}>
              {artist.name}
            </Box>
            <Box display="flex" mb={1.5}>
              {['pop', 'electro', 'music'].map((tag, index) => (
                <Box className={classes.tag} key={`tag-${index}`}>
                  {tag}
                </Box>
              ))}
            </Box>
            <Box className={classes.header3} mb={2}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum commodo pellentesque porta. Orci varius natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            </Box>
            <Box className={classes.flexBox}>
              <Box className={classes.flexBox}>
                {creators.map((creator, index) => (
                  <Box
                    ml={index > 1 ? '-16px' : 0}
                    key={index}
                    onClick={() => {
                      history.push(`/profile/${creator.id}`);
                    }}
                    title={creator?.name}
                    style={{ cursor: 'pointer' }}
                  >
                    <Avatar
                      size="medium"
                      url={
                        creator?.imageURL
                          ? `url(${processImage(creator?.imageURL)})`
                          : require('assets/anonAvatars/ToyFaces_Colored_BG_035.webp')
                      }
                    />
                  </Box>
                ))}
              </Box>
              <Box ml={2} className={classes.svgBox}>
                <div ref={anchorShareMenuRef}>
                  <ShareIcon onClick={showShareMenu} />
                </div>
              </Box>
              {openShareMenu && (
                <Popper
                  open={openShareMenu}
                  anchorEl={anchorShareMenuRef.current}
                  transition
                  disablePortal={false}
                  style={{ position: 'inherit' }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === 'bottom'
                            ? 'center top'
                            : 'center bottom',
                        position: 'inherit'
                      }}
                    >
                      <Paper className={classes.paper}>
                        <ClickAwayListener onClickAway={handleCloseShareMenu}>
                          <MenuList
                            autoFocusItem={openShareMenu}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDownShareMenu}
                          >
                            <CustomMenuItem onClick={handleOpenShareModal}>
                              <img
                                src={require('assets/icons/butterfly.webp')}
                                alt={'spaceship'}
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 5
                                }}
                              />
                              Share on social media
                            </CustomMenuItem>
                            <CustomMenuItem onClick={handleOpenQRCodeModal}>
                              <img
                                src={require('assets/icons/qrcode_small.webp')}
                                alt={'spaceship'}
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 5
                                }}
                              />
                              Share With QR Code
                            </CustomMenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              )}
              {/* <Box ml={3}>
                <FruitSelect
                  fruitObject={{}}
                  members={[]}
                  fruitWidth={32}
                  fruitHeight={32}
                />
              </Box> */}
              <Box
                ml={4}
                className={classes.whiteBox}
                style={{ cursor: 'pointer' }}
              >
                <Box className={classes.svgBox}>
                  {!followed ? <PlusIcon /> : <MinusIcon />}
                </Box>
                <Box ml={1} fontSize={14} onClick={handleFollow}>
                  {followed ? 'Unfollow' : 'Follow'}
                </Box>
              </Box>
            </Box>
            <Box
              bgcolor="rgba(0,0,0, 0.1)"
              height="1px"
              width={1}
              mt={3}
              mb={2}
            />
            <Box className={classes.flexBox} justifyContent="space-between">
              <PrimaryButton
                size="medium"
                onClick={() => {}}
                style={{ background: '#65CB63', marginTop: 16, height: 52 }}
              >
                <Box className={classes.flexBox} color={'white !important'}>
                  <Box className={classes.header2} color={'white !important'}>
                    🤑 Funds Raised
                  </Box>
                  <Box
                    className={classes.header1}
                    color={'white !important'}
                    ml={1}
                  >
                    pUSD 21.304
                  </Box>
                </Box>
              </PrimaryButton>
              <Box className={classes.flexBox} mt={2}>
                <img src={require('assets/icons/info_gray.webp')} />
                <Box className={classes.header4} ml={1}>
                  All Artist Must Verif\y Their Profiles in Order to Claim Funds
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            style={{ position: 'relative', padding: 0 }}
          >
            <img
              src={require('assets/anonAvatars/ToyFaces_Colored_BG_061.webp')}
              style={{
                objectFit: 'cover',
                borderRadius: '16px',
                position: 'absolute',
                width: '100%',
                height: '100%'
              }}
            />
          </Grid>
        </Grid>
      )}
      <Box
        className={classes.flexBox}
        justifyContent="space-between"
        mt={12}
        pb={2}
      >
        <Box>
          <Box className={classes.header3}>📈 Owner Share</Box>
          <Box className={classes.header1}>pUSD 213</Box>
        </Box>
        <Box>
          <Box className={classes.header3}>📊 Artists Share</Box>
          <Box className={classes.header1}>pUSD 21.104</Box>
        </Box>
        <Box>
          <Box className={classes.header3}>🎧 Reproductions</Box>
          <Box className={classes.header1}>6,588</Box>
        </Box>
        <Box>
          <Box display="flex" alignItems="flex-end">
            <img
              src={require('assets/emojiIcons/fruits.webp')}
              width={18}
              height={18}
            />
            <Box className={classes.header3} ml={0.5}>
              Fruits
            </Box>
          </Box>
          <Box className={classes.header1}>4,456</Box>
        </Box>
        <Box>
          <Box className={classes.header3}>🚀 Sharing Share</Box>
          <Box className={classes.header1}>0.2%</Box>
        </Box>
      </Box>
      <Box mt={7}>
        <Box className={classes.header5}>Artists</Box>
        <Box display="flex" justifyContent="space-between">
          {[1, 2, 3, 4, 5].map((user, index) => (
            <UserCard key={`artist-${index}`} />
          ))}
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          mt={5}
        >
          <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3491 14.7576C11.3491 14.3434 11.0133 14.0076 10.5991 14.0076C10.1849 14.0076 9.84912 14.3434 9.84912 14.7576H11.3491ZM9.84912 14.7676C9.84912 15.1818 10.1849 15.5176 10.5991 15.5176C11.0133 15.5176 11.3491 15.1818 11.3491 14.7676H9.84912ZM9.84912 11.7676C9.84912 12.1818 10.1849 12.5176 10.5991 12.5176C11.0133 12.5176 11.3491 12.1818 11.3491 11.7676H9.84912ZM6.87499 6.75412C6.76714 7.15404 7.00392 7.56568 7.40384 7.67353C7.80377 7.78138 8.2154 7.5446 8.32325 7.14468L6.87499 6.75412ZM9.84912 14.7576V14.7676H11.3491V14.7576H9.84912ZM12.8491 7.67667C12.8491 8.27464 12.4771 8.59079 11.6766 9.13654C11.0004 9.59763 9.84912 10.3095 9.84912 11.7676H11.3491C11.3491 11.2257 11.6979 10.9375 12.5216 10.3759C13.2212 9.89891 14.3491 9.16961 14.3491 7.67667H12.8491ZM10.5991 5.51758C11.8858 5.51758 12.8491 6.50155 12.8491 7.67667H14.3491C14.3491 5.63849 12.6792 4.01758 10.5991 4.01758V5.51758ZM8.32325 7.14468C8.5665 6.24266 9.49085 5.51758 10.5991 5.51758V4.01758C8.86689 4.01758 7.30846 5.14671 6.87499 6.75412L8.32325 7.14468ZM18.8491 9.76758C18.8491 14.3239 15.1555 18.0176 10.5991 18.0176V19.5176C15.9839 19.5176 20.3491 15.1524 20.3491 9.76758H18.8491ZM10.5991 18.0176C6.04277 18.0176 2.34912 14.3239 2.34912 9.76758H0.849121C0.849121 15.1524 5.21434 19.5176 10.5991 19.5176V18.0176ZM2.34912 9.76758C2.34912 5.21123 6.04277 1.51758 10.5991 1.51758V0.0175781C5.21434 0.0175781 0.849121 4.3828 0.849121 9.76758H2.34912ZM10.5991 1.51758C15.1555 1.51758 18.8491 5.21123 18.8491 9.76758H20.3491C20.3491 4.3828 15.9839 0.0175781 10.5991 0.0175781V1.51758Z"
              fill="#727F9A"
            />
          </svg>
          <Box className={classes.header4} maxWidth={350} ml={1.5} mr={3}>
            You can invite new people to be part of this Capsule such as music
            technicians , record labels or whoever you want.
          </Box>
          <PrimaryButton size="medium" className={classes.inviteButton}>
            Invite New People
          </PrimaryButton>
        </Box>
      </Box>
      <Box bgcolor="rgba(0,0,0, 0.1)" height="1px" width={1} mt={6} mb={5} />
      <Box className={classes.flexBox}>
        {TABS.map((item, index) => (
          <Box
            className={`${classes.tabBox} ${
              currentTab === index ? classes.selectedTabBox : ''
            }`}
            onClick={() => setCurrentTab(index)}
          >
            {item}
          </Box>
        ))}
      </Box>
      <Box mt={10}>
        {currentTab === 0 && (
          <>
            <Box display="flex">
              <Box width={1} pr={2}>
                <Box className={classes.header5}>Reproductions</Box>
                <Box height="250px" width={1}>
                  {rewardConfig && <PrintChart config={rewardConfig} />}
                </Box>
              </Box>
              <Box width={1} pl={2}>
                <Box className={classes.header5}>Funds Raised</Box>
                <Box height="250px" width={1}>
                  {rewardConfig1 && <PrintChart config={rewardConfig1} />}
                </Box>
              </Box>
            </Box>
            <Box className={classes.header5} mt={8} mb={3}>
              Transaction History
            </Box>
            <CustomTable
              headers={tableHeaders}
              rows={getTableData()}
              placeholderText="No transaction"
              theme="transaction"
              variant={Variant.Transparent}
            />
          </>
        )}
        {currentTab === 1 && (
          <>
            <Box className={classes.header5}>Chat with peeps</Box>
            <div className={classes.chatContent}>
              <div className={classes.chatColumn}>
                <MessageWidget
                  typeChat={'ClaimableSongs'}
                  media={{}}
                  chat={chat}
                  messages={messages}
                  setMessages={(msgs) => setMessages(msgs)}
                  getMessages={getMessages}
                  loadingMessages={loadingMessages}
                />
              </div>
              <div className={classes.artistsColumn}>
                <Box className={classes.header5}>Proposals</Box>
                <div className={classes.artistsList}>
                  {artists.length > 0 &&
                    artists.map((artist, index) => (
                      <div
                        className={classes.artistTile}
                        key={`artist-${index}`}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          marginRight={'15px'}
                        >
                          <div
                            className={classes.artistImage}
                            style={{
                              backgroundImage: `url(${getRandomAvatar()})`
                            }}
                          />
                          <Box display="flex" flexDirection="column">
                            <div className={classes.artistName}>
                              {artist.price ?? 'Price'}
                            </div>
                            <div className={classes.artistSlug}>
                              @{artist.slug ?? 'Artist Slug'}
                            </div>
                          </Box>
                        </Box>
                        <Box className={classes.proposals} mr={1.5}>
                          {artist.proposals ?? 0}
                        </Box>
                      </div>
                    ))}
                </div>
                <Box className={classes.create} height="170px !important">
                  <svg
                    width="31"
                    height="24"
                    viewBox="0 0 31 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.26579 22.9349L5.27939 23.0993C5.35976 23.5815 5.77695 23.9349 6.26579 23.9349V22.9349ZM24.9325 22.9349V23.9349C25.4213 23.9349 25.8385 23.5815 25.9188 23.0993L24.9325 22.9349ZM20.2658 12.9349L19.4221 13.4718C19.5756 13.713 19.825 13.8769 20.1073 13.9223C20.3896 13.9676 20.6778 13.8899 20.899 13.7089L20.2658 12.9349ZM10.9325 12.9349L10.2992 13.7089C10.5205 13.8899 10.8087 13.9676 11.091 13.9223C11.3732 13.8769 11.6226 13.713 11.7761 13.4718L10.9325 12.9349ZM2.61273 7.09929L5.27939 23.0993L7.25218 22.7705L4.58552 6.7705L2.61273 7.09929ZM6.26579 23.9349H24.9325V21.9349H6.26579V23.9349ZM25.9188 23.0993L28.5855 7.09929L26.6127 6.7705L23.9461 22.7705L25.9188 23.0993ZM26.9659 6.16094L19.6326 12.1609L20.899 13.7089L28.2324 7.70885L26.9659 6.16094ZM2.96588 7.70885L10.2992 13.7089L11.5657 12.1609L4.23236 6.16094L2.96588 7.70885ZM11.7761 13.4718L16.4428 6.13844L14.7555 5.06469L10.0888 12.398L11.7761 13.4718ZM14.7555 6.13844L19.4221 13.4718L21.1094 12.398L16.4428 5.06469L14.7555 6.13844ZM16.5991 3.60156C16.5991 4.15385 16.1514 4.60156 15.5991 4.60156V6.60156C17.256 6.60156 18.5991 5.25842 18.5991 3.60156H16.5991ZM15.5991 4.60156C15.0468 4.60156 14.5991 4.15385 14.5991 3.60156H12.5991C12.5991 5.25842 13.9423 6.60156 15.5991 6.60156V4.60156ZM14.5991 3.60156C14.5991 3.04928 15.0468 2.60156 15.5991 2.60156V0.601562C13.9423 0.601562 12.5991 1.94471 12.5991 3.60156H14.5991ZM15.5991 2.60156C16.1514 2.60156 16.5991 3.04928 16.5991 3.60156H18.5991C18.5991 1.94471 17.256 0.601562 15.5991 0.601562V2.60156ZM4.59912 4.9349C4.59912 5.48718 4.15141 5.9349 3.59912 5.9349V7.9349C5.25598 7.9349 6.59912 6.59175 6.59912 4.9349H4.59912ZM3.59912 5.9349C3.04684 5.9349 2.59912 5.48718 2.59912 4.9349H0.599121C0.599121 6.59175 1.94227 7.9349 3.59912 7.9349V5.9349ZM2.59912 4.9349C2.59912 4.38261 3.04684 3.9349 3.59912 3.9349V1.9349C1.94227 1.9349 0.599121 3.27804 0.599121 4.9349H2.59912ZM3.59912 3.9349C4.15141 3.9349 4.59912 4.38261 4.59912 4.9349H6.59912C6.59912 3.27804 5.25598 1.9349 3.59912 1.9349V3.9349ZM28.5991 4.9349C28.5991 5.48718 28.1514 5.9349 27.5991 5.9349V7.9349C29.256 7.9349 30.5991 6.59175 30.5991 4.9349H28.5991ZM27.5991 5.9349C27.0468 5.9349 26.5991 5.48718 26.5991 4.9349H24.5991C24.5991 6.59175 25.9423 7.9349 27.5991 7.9349V5.9349ZM26.5991 4.9349C26.5991 4.38261 27.0468 3.9349 27.5991 3.9349V1.9349C25.9423 1.9349 24.5991 3.27804 24.5991 4.9349H26.5991ZM27.5991 3.9349C28.1514 3.9349 28.5991 4.38261 28.5991 4.9349H30.5991C30.5991 3.27804 29.256 1.9349 27.5991 1.9349V3.9349Z"
                      fill="#65CB63"
                    />
                  </svg>
                  <Box className={classes.header4} color={'#54658F !important'}>
                    Create New
                    <br />
                    Distribution Proposal
                  </Box>
                  <PrimaryButton size="small" className={classes.startText}>
                    Let's get Started
                  </PrimaryButton>
                </Box>
              </div>
            </div>
          </>
        )}
        {currentTab === 2 && (
          <>
            <Box className={classes.header5} mb={4}>
              Distribution Proposals
            </Box>
            <Grid container spacing={4}>
              <Grid item md={8} sm={12}>
                <Box
                  display="flex"
                  flexDirection="column"
                  bgcolor="#FFFFFF"
                  boxShadow="0px 18px 10px -10px rgba(19, 45, 38, 0.07)"
                  borderRadius={20}
                  height={616}
                  padding="40px 22px"
                >
                  <Box display="flex" justifyContent="space-between">
                    <Box className={classes.header2}>
                      Funds Distribution Proposal
                    </Box>
                    <SecondaryButton size="small">Show history</SecondaryButton>
                  </Box>
                  <Box flex={1} my={2} overflow="auto">
                    {proposals.map((proposal, index) => (
                      <Box
                        key={`proposal-${index}`}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        padding="16px 22px"
                      >
                        <Box display="flex" alignItems="center">
                          <Avatar size="medium" url={getRandomAvatar()} />
                          <Box display="flex" flexDirection="column" ml={2}>
                            <Box className={classes.artistName}>
                              {proposal.price ?? 'Price'}
                            </Box>
                            <Box
                              className={classes.artistSlug}
                              color="#65CB63 !important"
                            >
                              @{proposal.slug ?? 'Artist Slug'}
                            </Box>
                          </Box>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Box className={classes.proposals}>
                            {proposal.rate}%
                          </Box>
                          <Box className={classes.header2} ml={5} mr={4}>
                            pUSD 171 ($171)
                          </Box>
                          <Box display="flex" alignItems="center">
                            <Box
                              className={classes.header3}
                              mr="5px"
                              color={`${
                                proposal.status === 'Accepted'
                                  ? '#65CB63'
                                  : proposal.status === 'Declined'
                                  ? '#F43E5F'
                                  : '#54658F'
                              } !important`}
                            >
                              {proposal.status}
                            </Box>
                            <img
                              src={require(`assets/musicDAOImages/${proposal.status.toLowerCase()}.webp`)}
                              alt="status"
                            />
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="space-between"
                  >
                    <SecondaryButton
                      size="medium"
                      className={classes.declineButton}
                    >
                      Decline
                    </SecondaryButton>
                    <Box display="flex">
                      <PrimaryButton
                        size="medium"
                        className={classes.proposalButton}
                      >
                        Place counter Proposal
                      </PrimaryButton>
                      <PrimaryButton
                        size="medium"
                        className={classes.acceptButton}
                      >
                        Accept & Sign
                      </PrimaryButton>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item md={4} sm={12}>
                <div className={classes.create}>
                  <svg
                    width="31"
                    height="24"
                    viewBox="0 0 31 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.26579 22.9349L5.27939 23.0993C5.35976 23.5815 5.77695 23.9349 6.26579 23.9349V22.9349ZM24.9325 22.9349V23.9349C25.4213 23.9349 25.8385 23.5815 25.9188 23.0993L24.9325 22.9349ZM20.2658 12.9349L19.4221 13.4718C19.5756 13.713 19.825 13.8769 20.1073 13.9223C20.3896 13.9676 20.6778 13.8899 20.899 13.7089L20.2658 12.9349ZM10.9325 12.9349L10.2992 13.7089C10.5205 13.8899 10.8087 13.9676 11.091 13.9223C11.3732 13.8769 11.6226 13.713 11.7761 13.4718L10.9325 12.9349ZM2.61273 7.09929L5.27939 23.0993L7.25218 22.7705L4.58552 6.7705L2.61273 7.09929ZM6.26579 23.9349H24.9325V21.9349H6.26579V23.9349ZM25.9188 23.0993L28.5855 7.09929L26.6127 6.7705L23.9461 22.7705L25.9188 23.0993ZM26.9659 6.16094L19.6326 12.1609L20.899 13.7089L28.2324 7.70885L26.9659 6.16094ZM2.96588 7.70885L10.2992 13.7089L11.5657 12.1609L4.23236 6.16094L2.96588 7.70885ZM11.7761 13.4718L16.4428 6.13844L14.7555 5.06469L10.0888 12.398L11.7761 13.4718ZM14.7555 6.13844L19.4221 13.4718L21.1094 12.398L16.4428 5.06469L14.7555 6.13844ZM16.5991 3.60156C16.5991 4.15385 16.1514 4.60156 15.5991 4.60156V6.60156C17.256 6.60156 18.5991 5.25842 18.5991 3.60156H16.5991ZM15.5991 4.60156C15.0468 4.60156 14.5991 4.15385 14.5991 3.60156H12.5991C12.5991 5.25842 13.9423 6.60156 15.5991 6.60156V4.60156ZM14.5991 3.60156C14.5991 3.04928 15.0468 2.60156 15.5991 2.60156V0.601562C13.9423 0.601562 12.5991 1.94471 12.5991 3.60156H14.5991ZM15.5991 2.60156C16.1514 2.60156 16.5991 3.04928 16.5991 3.60156H18.5991C18.5991 1.94471 17.256 0.601562 15.5991 0.601562V2.60156ZM4.59912 4.9349C4.59912 5.48718 4.15141 5.9349 3.59912 5.9349V7.9349C5.25598 7.9349 6.59912 6.59175 6.59912 4.9349H4.59912ZM3.59912 5.9349C3.04684 5.9349 2.59912 5.48718 2.59912 4.9349H0.599121C0.599121 6.59175 1.94227 7.9349 3.59912 7.9349V5.9349ZM2.59912 4.9349C2.59912 4.38261 3.04684 3.9349 3.59912 3.9349V1.9349C1.94227 1.9349 0.599121 3.27804 0.599121 4.9349H2.59912ZM3.59912 3.9349C4.15141 3.9349 4.59912 4.38261 4.59912 4.9349H6.59912C6.59912 3.27804 5.25598 1.9349 3.59912 1.9349V3.9349ZM28.5991 4.9349C28.5991 5.48718 28.1514 5.9349 27.5991 5.9349V7.9349C29.256 7.9349 30.5991 6.59175 30.5991 4.9349H28.5991ZM27.5991 5.9349C27.0468 5.9349 26.5991 5.48718 26.5991 4.9349H24.5991C24.5991 6.59175 25.9423 7.9349 27.5991 7.9349V5.9349ZM26.5991 4.9349C26.5991 4.38261 27.0468 3.9349 27.5991 3.9349V1.9349C25.9423 1.9349 24.5991 3.27804 24.5991 4.9349H26.5991ZM27.5991 3.9349C28.1514 3.9349 28.5991 4.38261 28.5991 4.9349H30.5991C30.5991 3.27804 29.256 1.9349 27.5991 1.9349V3.9349Z"
                      fill="#65CB63"
                    />
                  </svg>
                  <Box className={classes.header4} color={'#54658F !important'}>
                    Create New
                    <br />
                    Distribution Proposal
                  </Box>
                  <PrimaryButton size="small" className={classes.startText}>
                    Let's get Started
                  </PrimaryButton>
                </div>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
}
