import React, { useState, useEffect } from 'react';
import axios from 'axios';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';

import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import URL from 'shared/functions/getURL';
import Box from 'shared/ui-kit/Box';
import PrintChart from 'shared/ui-kit/Chart/Chart';
import { potionsManageBopsPageStyle } from './index.styles';
import { Color, PrimaryButton } from 'shared/ui-kit';
import { useHistory } from 'react-router-dom';
import { BackIcon } from 'components/MusicDao/components/Icons/SvgIcons';
import { BopsCombineCard } from 'components/MusicDao/components/Cards/BopsCombineCard';
import { CombineBopsModal } from 'components/MusicDao/modals/CombineBopsModal';

const FreeHoursChartConfig1 = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: 'line',
          label: '',
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: '#65CB63',
          borderColor: '#65CB63',
          pointBackgroundColor: '#65CB63',
          hoverBackgroundColor: '#65CB63',
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          borderWidth: 3,
          cubicInterpolationMode: 'monotone',
          lineTension: 0.05
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
          top: 30,
          bottom: 0
        }
      },

      scales: {
        xAxes: [
          {
            barPercentage: 0.4,
            offset: true,
            display: true,
            gridLines: {
              color: '#2B3161',
              lineWidth: 50
            },
            ticks: {
              beginAtZero: true,
              fontColor: '#fff'
            }
          }
        ],
        yAxes: [
          {
            display: true,
            position: 'right',
            gridLines: {
              color: 'transparent'
            },
            ticks: {
              fontColor: '#fff',
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
        bodyFontColor: '#fff'
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

const FreeHoursChartConfig2 = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: 'line',
          label: '',
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: '#6D4DD1',
          borderWidth: 0,
          lineTension: 0.2
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
          top: 30,
          bottom: 0
        }
      },

      scales: {
        xAxes: [
          {
            barPercentage: 0.4,
            offset: true,
            display: true,
            gridLines: {
              color: '#ffffff',
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
            position: 'right',
            gridLines: {
              color: '#EFF2F8'
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
    let gradient = ref.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(0.6, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(
      1,
      `${config.data.datasets[index].backgroundColor}33`
    );
    config.data.datasets[0].backgroundColor = gradient;

    if (config.data.datasets[index].type === 'bar') {
      config.data.datasets[index].borderWidth = 0;
    }
  }

  return config;
};

export default function PotionsManageBopsPae() {
  const classes = potionsManageBopsPageStyle();
  const history = useHistory();

  const isMobile = useMediaQuery('(max-width:400px)');
  const [activeFirstTab, setActiveFirstTab] = useState<number>(0);
  const [activeSecondTab, setActiveSecondTab] = useState<number>(1);

  const [songs, setSongs] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState<number>(1);
  const [songsLoader, setSongsLoader] = React.useState<boolean>(false);

  const [freeHoursConfig, setFreeHoursConfig] = useState<any>();
  const [graphType, setGraphType] = useState<number>(0);
  const [labelType, setLabelType] = useState<number>(0);

  const [openCombineModal, setOpenCombineModal] = useState<boolean>(false);

  useEffect(() => {
    getClaimablePods();
  }, [pagination]);

  const getAllDaysInMonth = () => {
    const dt = new Date();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();

    const result: string[] = [];
    for (let index = 1; index <= daysInMonth; index++) {
      result.push(index < 10 ? `0${index}` : `${index}`);
    }

    return result;
  };

  const getAllValuesInMonth = () => {
    const dt = new Date();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();

    const result: number[] = [];
    for (let index = 1; index <= daysInMonth; index++) {
      result.push(Math.floor(Math.random() * 10000));
    }

    return result;
  };

  useEffect(() => {
    const newConfig =
      graphType === 0
        ? JSON.parse(JSON.stringify(FreeHoursChartConfig1))
        : JSON.parse(JSON.stringify(FreeHoursChartConfig2));
    newConfig.configurer = configurer;
    newConfig.config.data.labels = getAllDaysInMonth();
    newConfig.config.data.datasets[0].data = getAllValuesInMonth();
    setFreeHoursConfig(newConfig);
  }, [graphType]);

  const getClaimablePods = async () => {
    const config = {
      searchValue: '',
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

  return (
    <Box className={classes.container}>
      <Box className={classes.backgroundBox} />
      <div className={classes.body}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
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
          <Box className={classes.header}>Manage Your Bops</Box>
          <PrimaryButton
            size="medium"
            className={classes.combineButton}
            onClick={() => setOpenCombineModal(true)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.72239 0.000976562C0.77114 0.000976562 0 0.772119 0 1.72337V10.8464C0 11.7976 0.771141 12.5687 1.72239 12.5687H3.89266C3.97007 12.6342 4.05436 12.6937 4.14525 12.7462L8.56301 15.2968C9.38682 15.7724 10.4402 15.4901 10.9158 14.6663L15.4773 6.7656C15.953 5.94179 15.6707 4.88839 14.8469 4.41277L10.4291 1.86217C9.81788 1.50926 9.08022 1.57361 8.54597 1.96683V1.72337C8.54597 0.772117 7.77483 0.000976562 6.82358 0.000976562H1.72239ZM8.54597 1.96683C8.3602 2.10356 8.19902 2.28006 8.0763 2.49261L3.51481 10.3933C3.09166 11.1263 3.26839 12.0409 3.89266 12.5687H6.82358C7.77483 12.5687 8.54597 11.7976 8.54597 10.8463V1.96683Z"
                fill="url(#paint0_linear)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="1.18904"
                  y1="7.12264"
                  x2="15.1176"
                  y2="9.01022"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.179206" stopColor="#A0D800" />
                  <stop offset="0.852705" stopColor="#0DCC9E" />
                </linearGradient>
              </defs>
            </svg>
            Combine Bops
          </PrimaryButton>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width={1}
          mt={4}
        >
          <Box
            className={`${classes.tabBarItem} ${
              activeFirstTab === 0 && classes.tabBarItemActive
            }`}
            onClick={() => setActiveFirstTab(0)}
          >
            <Box className={classes.header1} ml={2}>
              General stats
            </Box>
          </Box>
          <Box
            className={`${classes.tabBarItem} ${
              activeFirstTab === 1 && classes.tabBarItemActive
            }`}
            onClick={() => setActiveFirstTab(1)}
          >
            <Box className={classes.header1} ml={2}>
              Revenue graph
            </Box>
          </Box>
        </Box>
        <Box className={classes.contentBox} width={1}>
          {activeFirstTab === 0 ? (
            <Box className={classes.filterContainer}>
              <div className={classes.rankingStatsCard}>
                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <USDTIcon />
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                    >
                      <Box fontSize={18} fontWeight={600}>
                        #1550
                      </Box>
                      <Box fontSize={13} fontWeight={600}>
                        In Ranking
                      </Box>
                    </Box>
                  </Box>
                  <Box mt={2} fontSize={36} fontWeight={600}>
                    244420.5732
                  </Box>
                  <Box mt={'2px'} fontSize={18} fontWeight={600}>
                    USDT
                  </Box>
                  <Box mt={2} width={'93px'} height={'1px'} bgcolor="#fff" />
                </Box>
                <Box>
                  <Box mt={5} fontSize={19} fontWeight={600}>
                    TOTAL
                  </Box>
                  <Box mt={'1px'} fontSize={19} fontWeight={600}>
                    IN STAKE
                  </Box>
                </Box>
              </div>
              <div className={classes.beatsStatsCard}>
                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <img
                      src={require('assets/musicDAOImages/beats_icon_green.webp')}
                      alt="beats"
                    />
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                    >
                      <Box fontSize={18} fontWeight={600}>
                        #1550
                      </Box>
                      <Box fontSize={13} fontWeight={600}>
                        In Ranking
                      </Box>
                    </Box>
                  </Box>
                  <Box mt={2} fontSize={36} fontWeight={600}>
                    7,923
                  </Box>
                  <Box mt={'2px'} fontSize={18} fontWeight={600}>
                    Beats
                  </Box>
                  <Box mt={2} width={'93px'} height={'1px'} bgcolor="#fff" />
                </Box>
                <Box>
                  <Box mt={5} fontSize={19} fontWeight={600}>
                    TOTAL BEATS
                  </Box>
                  <Box mt={'1px'} fontSize={19} fontWeight={600}>
                    EARNED
                  </Box>
                </Box>
              </div>
              <div className={classes.revenueStatsCard}>
                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <USDTIcon />
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                    >
                      <Box fontSize={18} fontWeight={600}>
                        #1550
                      </Box>
                      <Box fontSize={13} fontWeight={600}>
                        In Ranking
                      </Box>
                    </Box>
                  </Box>
                  <Box mt={2} fontSize={36} fontWeight={600}>
                    244420.5732
                  </Box>
                  <Box mt={'2px'} fontSize={18} fontWeight={600}>
                    USDT
                  </Box>
                  <Box mt={2} width={'93px'} height={'1px'} bgcolor="#fff" />
                </Box>
                <Box>
                  <Box mt={5} fontSize={19} fontWeight={600}>
                    TOTAL REVENUE
                  </Box>
                  <Box mt={'1px'} fontSize={19} fontWeight={600}>
                    EARNED
                  </Box>
                </Box>
              </div>
            </Box>
          ) : (
            <Box className={classes.filterContainer}>
              <Box className={classes.graphBox} zIndex={1} mt={6}>
                <div className={classes.graphTobBox}>
                  <Box
                    className={classes.header2_1}
                    color="#F0F5F8"
                    pl={isMobile ? 2 : 0}
                  >
                    Beats generated over time
                  </Box>
                  <Box className={classes.headerControlBox}>
                    <Box
                      className={`${classes.buttonBox} ${
                        graphType === 0 ? classes.selectedButtonBox : ''
                      }`}
                      onClick={() => setGraphType(0)}
                    >
                      Beats
                    </Box>
                    <Box
                      className={`${classes.buttonBox} ${
                        graphType === 1 ? classes.selectedButtonBox : ''
                      }`}
                      onClick={() => setGraphType(1)}
                    >
                      USDC Revenue
                    </Box>
                  </Box>
                </div>

                <div className={classes.graphFilterBox}>
                  <div />
                  <Box
                    className={classes.controlBox}
                    style={{
                      background: graphType === 0 ? '#5CC4D133' : '#6D4DD133'
                    }}
                  >
                    <Box
                      className={classes.secondButtonBox}
                      style={{
                        background: labelType === 0 ? '#F0F5F8' : 'transparent',
                        border: 'none',
                        color: labelType === 0 ? '#2D3047' : '#EEF2F6',
                        fontSize: 14,
                        fontWeight: 500
                      }}
                      onClick={() => setLabelType(0)}
                    >
                      1D
                    </Box>
                    <Box
                      className={classes.secondButtonBox}
                      style={{
                        background: labelType === 1 ? '#F0F5F8' : 'transparent',
                        border: 'none',
                        color: labelType === 1 ? '#2D3047' : '#EEF2F6',
                        fontSize: 14,
                        fontWeight: 500
                      }}
                      onClick={() => setLabelType(1)}
                    >
                      7D
                    </Box>
                    <Box
                      className={classes.secondButtonBox}
                      style={{
                        background: labelType === 2 ? '#F0F5F8' : 'transparent',
                        border: 'none',
                        color: labelType === 2 ? '#2D3047' : '#EEF2F6',
                        fontSize: 14,
                        fontWeight: 500
                      }}
                      onClick={() => setLabelType(2)}
                    >
                      1M
                    </Box>
                    <Box
                      className={classes.secondButtonBox}
                      style={{
                        background: labelType === 3 ? '#F0F5F8' : 'transparent',
                        border: 'none',
                        color: labelType === 3 ? '#2D3047' : '#EEF2F6',
                        fontSize: 14,
                        fontWeight: 500
                      }}
                      onClick={() => setLabelType(3)}
                    >
                      YTD
                    </Box>
                  </Box>
                </div>
                <Box style={{ height: '350px' }}>
                  {freeHoursConfig && <PrintChart config={freeHoursConfig} />}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width={1}
          mt={4}
        >
          <Box
            className={`${classes.tabBarItem} ${
              activeSecondTab === 0 && classes.tabBarItemActive
            }`}
            onClick={() => setActiveSecondTab(0)}
          >
            <Box className={classes.header1} ml={2}>
              Your Bops
            </Box>
          </Box>
          <Box
            className={`${classes.tabBarItem} ${
              activeSecondTab === 1 && classes.tabBarItemActive
            }`}
            onClick={() => setActiveSecondTab(1)}
          >
            <Box className={classes.header1} ml={2}>
              In creation
            </Box>
          </Box>
        </Box>
        <Box mt={3}>
          <LoadingWrapper theme="dark" loading={songsLoader}>
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={`${index}-combine-portion-card`}
                >
                  <BopsCombineCard pod={item} />
                </Grid>
              ))}
            </Grid>
          </LoadingWrapper>
          <Box className={classes.pagination}>
            <Pagination count={10} onChange={() => {}} />
          </Box>
        </Box>
      </div>
      {openCombineModal && (
        <CombineBopsModal
          open={openCombineModal}
          handleClose={() => setOpenCombineModal(false)}
          songs={songs}
        />
      )}
    </Box>
  );
}

const USDTIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M0.509766 24.1182C0.509766 11.1422 11.0289 0.623047 24.0049 0.623047C36.9809 0.623047 47.5 11.1422 47.5 24.1182C47.5 37.0942 36.9809 47.6133 24.0049 47.6133C11.0289 47.6133 0.509766 37.0942 0.509766 24.1182Z"
        fill="#65CB63"
      />
      <path
        d="M24.0049 47.6133C36.9809 47.6133 47.5 37.0942 47.5 24.1182C47.5 11.1422 36.9809 0.623047 24.0049 0.623047C11.0289 0.623047 0.509766 11.1422 0.509766 24.1182C0.509766 37.0942 11.0289 47.6133 24.0049 47.6133Z"
        fill="#26A17B"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.827 26.1497V26.1467C26.6655 26.1585 25.8329 26.2084 23.9753 26.2084C22.4922 26.2084 21.4481 26.1644 21.081 26.1467V26.1511C15.3717 25.9 11.1102 24.9059 11.1102 23.7165C11.1102 22.5285 15.3717 21.5344 21.081 21.2788V25.1614C21.454 25.1878 22.523 25.251 24.0003 25.251C25.7727 25.251 26.6611 25.1776 26.827 25.1629V21.2818C32.5246 21.5358 36.7757 22.53 36.7757 23.7165C36.7757 24.9059 32.5246 25.8971 26.827 26.1497ZM26.827 20.878V17.4036H34.7772V12.1055H13.1308V17.4036H21.081V20.8765C14.6198 21.1731 9.76074 22.4536 9.76074 23.9867C9.76074 25.5197 14.6198 26.7987 21.081 27.0968V38.2306H26.827V27.0939C33.2779 26.7973 38.1252 25.5182 38.1252 23.9867C38.1252 22.4551 33.2779 21.1761 26.827 20.878Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <path
          d="M0.509766 24.1182C0.509766 11.1422 11.0289 0.623047 24.0049 0.623047C36.9809 0.623047 47.5 11.1422 47.5 24.1182C47.5 37.0942 36.9809 47.6133 24.0049 47.6133C11.0289 47.6133 0.509766 37.0942 0.509766 24.1182Z"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);
