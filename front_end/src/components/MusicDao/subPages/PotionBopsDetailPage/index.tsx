import React from 'react';
import { useHistory } from 'react-router-dom';
import Carousel from 'react-simply-carousel';
import cls from 'classnames';

import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Box from 'shared/ui-kit/Box';
import { DropDownIcon } from 'shared/ui-kit/Icons';
import { BackIcon } from 'components/MusicDao/components/Icons/SvgIcons';
import { potionDetailStyles } from './index.styles';
import { Avatar, Color, PrimaryButton } from 'shared/ui-kit';

import { Songs } from './mock';
import { StyledButton } from 'components/MusicDao/modals/CreateBop';
import PrintChart from 'shared/ui-kit/Chart/Chart';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import { getRandomAvatar } from 'shared/services/user/getUserAvatar';
import MarketplaceCard from 'components/MusicDao/components/Cards/MarketplaceCard';

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
    gradient.addColorStop(0, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(
      1,
      `${config.data.datasets[index].backgroundColor}33`
    );
    config.data.datasets[0].backgroundColor = gradient;
  }

  return config;
};

const TableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: 'left',
    headerName: 'From'
  },
  {
    headerAlign: 'center',
    headerName: 'Token'
  },
  {
    headerAlign: 'center',
    headerName: 'Symbol'
  },
  {
    headerAlign: 'center',
    headerName: 'Price'
  },
  {
    headerAlign: 'center',
    headerName: 'Explorer'
  }
];

const PotionBopsDetailPage = () => {
  const classes = potionDetailStyles();

  const history = useHistory();

  const [songs, setSongs] = React.useState<any[]>(Songs.slice(0, 6));
  const [currentSlide, setCurrentSlide] = React.useState<number>(0);
  const [showChildren, setShowChildren] = React.useState<boolean>(false);
  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const [selectedTimeFilter, setSelectedTimeFilter] = React.useState<number>(0);
  const [tableData, setTableData] = React.useState<
    Array<Array<CustomTableCellInfo>>
  >([]);

  const handleSlidePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleSlideNext = () => {
    if (currentSlide < songs.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

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

    setTableData(
      [1, 2, 3, 4, 5].map((item, index) => [
        {
          cellAlign: 'center',
          cell: (
            <Box display="flex" alignItems="center">
              <Avatar url={getRandomAvatar()} size={'medium'} />
              <Box display="flex" flexDirection="column">
                <Box fontSize={14} fontWeight={500} color="#1A1B1C">
                  User name
                </Box>
                <Box fontSize={14} fontWeight={500} color="#54658F">
                  @username
                </Box>
              </Box>
            </Box>
          )
        },
        {
          cellAlign: 'center',
          cell: (
            <img
              width={24}
              height={24}
              src={require('assets/tokenImages/USDT.webp')}
              alt="token"
            />
          )
        },
        {
          cellAlign: 'center',
          cell: (
            <Box fontSize={14} fontWeight={500} color="#54658F">
              DAI
            </Box>
          )
        },
        {
          cellAlign: 'center',
          cell: (
            <Box fontSize={14} fontWeight={500} color="#54658F">
              2,400
            </Box>
          )
        },
        {
          cellAlign: 'center',
          cell: (
            <img
              width={24}
              height={24}
              src={require('assets/tokenImages/POLYGON.webp')}
              alt="polygon"
            />
          )
        }
      ])
    );
  }, []);

  return (
    <Box className={classes.container}>
      <Box className={classes.background} />
      <Box className={classes.mainBox}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Box
            display="flex"
            onClick={() => history.goBack()}
            style={{ cursor: 'pointer' }}
          >
            <BackIcon />
            <Box ml={1} color={Color.White}>
              BACK
            </Box>
          </Box>
          <Box className={classes.title1}>Bop Details</Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            position="relative"
          >
            <img
              src={require('assets/icons/share_filled.svg')}
              alt="share"
              style={{ marginRight: 24 }}
            />
            <img
              src={require('assets/icons/bookmark.webp')}
              alt="bookmark"
              style={{ marginRight: 24 }}
            />
            <PrimaryButton size="small" className={classes.follow}>
              + Follow
            </PrimaryButton>
            <Box width="1px" height={30} bgcolor="rgba(0, 0, 0, 0.2)" ml={3} />
            <Box
              fontSize={12}
              fontWeight={600}
              color={Color.MusicDAODark}
              ml={1.5}
            >
              2245 Fruits
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor={'rgba(255, 255, 255, 0.46)'}
              width={36}
              height={36}
              borderRadius="100%"
              ml={1}
            >
              <img
                src={require('assets/musicDAOImages/fruit.webp')}
                alt="fruit"
              />
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" className={classes.card}>
          <Grid container spacing={6}>
            <Grid item md={4} xs={12}>
              <Box mt={-5}>
                <MarketplaceCard />
              </Box>
            </Grid>
            <Grid item md={8} xs={12}>
              <Box className={classes.title2} mb={4}>
                Level & Breeding
              </Box>
              <Box display="flex" alignItems="center">
                <Box
                  position="relative"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <svg
                    width="339"
                    height="145"
                    viewBox="0 0 339 145"
                    fill="none"
                    style={{ marginLeft: -24, marginTop: -48 }}
                  >
                    <path
                      opacity="0.3"
                      d="M64.3695 127.699C73.3873 107.6 87.987 90.5123 106.433 78.4683C124.879 66.4242 146.396 59.9302 168.425 59.7582C190.454 59.5862 212.07 65.7434 230.701 77.498C249.333 89.2525 264.198 106.11 273.529 126.066"
                      stroke="#54658F"
                      strokeOpacity="0.3"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <g opacity="0.2">
                      <mask id="path-2-inside-1" fill="white">
                        <path d="M277.764 144.178C287.218 141.958 293.188 132.427 289.703 123.363C281.402 101.769 267.448 82.6731 249.172 68.1723C226.284 50.0116 197.961 40.1247 168.803 40.1168C139.645 40.1089 111.364 49.9805 88.5517 68.1288C70.3282 82.6266 56.4497 101.726 48.2411 123.328C44.7985 132.388 50.7722 141.883 60.2065 144.102C69.6831 146.331 79.0211 140.334 82.9454 131.425C89.0572 117.549 98.461 105.281 110.446 95.7468C127.055 82.5329 147.647 75.3453 168.877 75.3511C190.107 75.3569 210.729 82.5556 227.394 95.7785C239.451 105.344 248.924 117.657 255.093 131.58C259.021 140.444 268.326 146.395 277.764 144.178Z" />
                      </mask>
                      <path
                        d="M277.764 144.178C287.218 141.958 293.188 132.427 289.703 123.363C281.402 101.769 267.448 82.6731 249.172 68.1723C226.284 50.0116 197.961 40.1247 168.803 40.1168C139.645 40.1089 111.364 49.9805 88.5517 68.1288C70.3282 82.6266 56.4497 101.726 48.2411 123.328C44.7985 132.388 50.7722 141.883 60.2065 144.102C69.6831 146.331 79.0211 140.334 82.9454 131.425C89.0572 117.549 98.461 105.281 110.446 95.7468C127.055 82.5329 147.647 75.3453 168.877 75.3511C190.107 75.3569 210.729 82.5556 227.394 95.7785C239.451 105.344 248.924 117.657 255.093 131.58C259.021 140.444 268.326 146.395 277.764 144.178Z"
                        stroke="#54658F"
                        strokeWidth="2"
                        mask="url(#path-2-inside-1)"
                      />
                    </g>
                    <path
                      d="M64.3695 127.699C75.6688 102.515 95.6475 82.2326 120.659 70.5551"
                      stroke="url(#paint0_linear)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* <circle
                      stroke="red" strokeWidth="9" fill="transparent" r="116" cx="-200" cy="-140"
                      style={{ strokeDasharray: "326.726, 326.726", strokeDashoffset: 228.708 }}
                    /> */}
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="73.3055"
                        y1="210.21"
                        x2="277.431"
                        y2="143.16"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0.179206" stopColor="#A0D800" />
                        <stop offset="0.415076" stopColor="#0DCC9E" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <Box
                    display="flex"
                    flexDirection="column"
                    position="absolute"
                    bottom={-30}
                  >
                    <Box fontSize={16} color={Color.MusicDAOLightBlue}>
                      Bop Level
                    </Box>
                    <Box fontSize={32} color={Color.MusicDAODark}>
                      12%
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Box
                    display="flex"
                    flexDirection="column"
                    width={1}
                    borderBottom="1px solid rgba(84, 101, 143, 0.3)"
                    pb={2}
                  >
                    <Box className={classes.text1}>Breeding to date</Box>
                    <Box className={classes.text2}>223</Box>
                  </Box>
                  <Box display="flex" flexDirection="column" width={1} mt={2}>
                    <Box className={classes.text1}>Breeding to next level</Box>
                    <Box className={classes.text2}>2424</Box>
                  </Box>
                </Box>
              </Box>
              <Box
                width={1}
                height={'1px'}
                bgcolor="rgba(0, 0, 0, 0.2)"
                mt={5}
                mb={3}
              />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box className={classes.title2}>Current Price</Box>
                <Box display="flex" alignItems="center">
                  <Box className={classes.title1} color="#65CB63 !important">
                    ETH 1.868
                  </Box>
                  <Box
                    className={classes.text1}
                    color="#54658F !important"
                    ml={1}
                  >
                    ($356,00)
                  </Box>
                </Box>
              </Box>
              <Box
                width={1}
                height={'1px'}
                bgcolor="rgba(0, 0, 0, 0.2)"
                mt={3}
                mb={3}
              />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box className={classes.title2}>
                  Children <span style={{ fontWeight: 400 }}>2/7</span>
                </Box>
                <Box
                  className={classes.text1}
                  style={{ cursor: 'pointer' }}
                  color="#54658F !important"
                  onClick={() => setShowChildren((prev) => !prev)}
                >
                  Show
                </Box>
              </Box>
              {showChildren && (
                <>
                  <Carousel
                    activeSlideIndex={currentSlide}
                    itemsToShow={3}
                    itemsToScroll={3}
                    forwardBtnProps={{
                      show: false
                    }}
                    backwardBtnProps={{
                      show: false
                    }}
                    infinite={false}
                  >
                    {songs.slice(0, 6).map((item, index) => (
                      <Box minWidth={300}>
                        <MarketplaceCard key={`children-card-${index}`} />
                      </Box>
                    ))}
                  </Carousel>
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Box
                      className={classes.sliderNav}
                      onClick={handleSlidePrev}
                    >
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.13131 11.3846L1.07343 6.48479M1.07343 6.48479L6.13131 1.58496M1.07343 6.48479H13.9268"
                          stroke="#181818"
                          strokeWidth="1.5122"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      className={classes.sliderNav}
                      ml={2.5}
                      onClick={handleSlideNext}
                    >
                      <svg
                        width="15"
                        height="13"
                        viewBox="0 0 15 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.86869 11.3846L13.9266 6.48479M13.9266 6.48479L8.86869 1.58496M13.9266 6.48479H1.07324"
                          stroke="#181818"
                          strokeWidth="1.5122"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                  </Box>
                </>
              )}
              <Box
                width={1}
                height={'1px'}
                bgcolor="rgba(0, 0, 0, 0.2)"
                mt={2.5}
                mb={3}
              />
              <Box display="flex">
                <StyledButton
                  className={classes.button}
                  text="buy now for 15 ETH"
                  bgcolor="#2D3047"
                  color="white"
                  onClick={() => {}}
                />
                <StyledButton
                  className={classes.button}
                  text="Place Buy Offer"
                  bgcolor="#2D3047"
                  gradient="url(#button_gradient)"
                  color="white"
                  onClick={() => {}}
                />
                <svg>
                  <defs>
                    <linearGradient
                      id="button_gradient"
                      x1="22.6448"
                      y1="28.4572"
                      x2="209.825"
                      y2="152.278"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.179206" stop-color="#A0D800" />
                      <stop offset="0.852705" stop-color="#0DCC9E" />
                    </linearGradient>
                  </defs>
                </svg>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" flexDirection="column" className={classes.card}>
          <Accordion className={classes.accordion}>
            <AccordionSummary expandIcon={<DropDownIcon />}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width={1}
              >
                <Box className={classes.title2}>Ownership history</Box>
                <Box className={classes.text1} color="#54658F !important">
                  Showall
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" width={1}>
                {[1, 2, 3, 4, 5].map((history, index) => (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    key={`history-${index}`}
                    py={2}
                    borderBottom="1px solid #54658F1A"
                  >
                    <Box display="flex" alignItems="center">
                      <Box
                        width={'7px'}
                        height={'7px'}
                        bgcolor={'#65CB63'}
                        borderRadius={'100%'}
                        mr={3}
                      />
                      <Box
                        fontSize={14}
                        fontWeight={600}
                        color={Color.MusicDAODark}
                      >
                        Owned by 0xeec9ec9ec9ec9ec9ec92f8
                      </Box>
                    </Box>
                    <Box fontSize={13} fontWeight={500} color={Color.GrayDark}>
                      2021-08-25 07:21:03
                    </Box>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box display="flex" flexDirection="column" className={classes.card}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={classes.title2}>Historical beats earned</Box>
            <Box className={classes.timeFilters}>
              {['1D', '7D', '1M', 'YTD'].map((filter, index) => (
                <div
                  className={cls(
                    {
                      [classes.selectedTimeFilter]: index === selectedTimeFilter
                    },
                    classes.timeFilter
                  )}
                  onClick={() => setSelectedTimeFilter(index)}
                  key={`time-${filter}`}
                >
                  {filter}
                </div>
              ))}
            </Box>
          </Box>
          <Box height="250px" width={1}>
            {rewardConfig && <PrintChart config={rewardConfig} />}
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          className={classes.card}
          mb={5}
        >
          <Box className={classes.title2} mb={3}>
            All offers
          </Box>
          <CustomTable
            headers={TableHeaders}
            rows={tableData}
            placeholderText="No offers"
            theme="transaction"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PotionBopsDetailPage;
