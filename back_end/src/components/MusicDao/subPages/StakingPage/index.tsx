import React, { useState, useEffect, useCallback } from 'react';
import Moment from 'react-moment';
import { useHistory } from 'react-router-dom';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import HowItWorksModal from 'components/MusicDao/modals/HowItWorks';
import Box from 'shared/ui-kit/Box';
import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import PrintChart from 'shared/ui-kit/Chart/Chart';
import StakingPoolCard from 'components/MusicDao/components/Cards/StakingPoolCard';
import { ReactComponent as OscelloIcon } from 'assets/icons/oscello.svg';
import {
  ShortArrowIcon,
  ShareMusicIcon,
  SparkIcon
} from '../../components/Icons/SvgIcons';
import { stakingPageStyles } from './index.styles';

const TRANSACTIONHEADERS: Array<CustomTableHeaderInfo> = [
  {
    headerName: 'Staked asset',
    headerAlign: 'left'
  },
  {
    headerName: 'Staking Amount',
    headerAlign: 'center'
  },
  {
    headerName: 'Total Value',
    headerAlign: 'center'
  },
  {
    headerName: 'Address',
    headerAlign: 'center'
  },
  {
    headerName: 'Time',
    headerAlign: 'center'
  },
  {
    headerName: 'Music Scan',
    headerAlign: 'center'
  }
];

const TRANSACTIONS = [
  {
    token: 'USDT',
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: '0xcD242294D242294D242294',
    time: new Date(),
    date: new Date()
  },
  {
    token: 'DAI',
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: '0xcD242294D242294D242294',
    time: new Date(),
    date: new Date()
  },
  {
    token: 'USDC',
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: '0xcD242294D242294D242294',
    time: new Date(),
    date: new Date()
  },
  {
    token: 'BNB',
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: '0xcD242294D242294D242294',
    time: new Date(),
    date: new Date()
  },
  {
    token: 'BNB',
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: '0xcD242294D242294D242294',
    time: new Date(),
    date: new Date()
  },
  {
    token: 'USDT',
    stakingAmmount: 22.45,
    totalValue: 73500,
    address: '0xcD242294D242294D242294',
    time: new Date(),
    date: new Date()
  }
];

const DAYLABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
const MONTHLABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: 'bar',
          barPercentage: 0.4,
          label: '',
          data: [] as any[],
          pointRadius: 0,
          borderWidth: 0,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
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
    let gradient = ref.createLinearGradient(
      0,
      0,
      0,
      config.data.datasets[index].type === 'bar' ? 200 : 350
    );
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

const STAKINGPOOLS = [
  {
    token: 'USDC',
    quantity: '9,732',
    currentPercentage: 5,
    overTime: 10,
    data: [10, 40, 65, 80, 120, 230]
  },
  {
    token: 'DAI',
    quantity: '8,572',
    currentPercentage: 5,
    overTime: 10,
    data: [10, 40, 65, 80, 120, 230]
  },
  {
    token: 'USDT',
    quantity: '5,732',
    currentPercentage: 5,
    overTime: 10,
    data: [10, 40, 65, 80, 120, 230]
  },
  {
    token: 'BTC',
    quantity: '4,732',
    currentPercentage: 5,
    overTime: 10,
    data: [10, 40, 65, 80, 120, 230]
  },
  {
    token: 'BNB',
    quantity: '8,732',
    currentPercentage: 5,
    overTime: 10,
    data: [10, 40, 65, 80, 120, 230]
  }
];

export default function StakingPage() {
  const classes = stakingPageStyles();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'));

  const [freeHoursConfig, setFreeHoursConfig] = useState<any>();
  const [graphType, setGraphType] = useState<number>(0);
  const [labelType, setLabelType] = useState<number>(0);

  const [stakingConfig, setStakingConfig] = useState<any>();
  const [dateType, setDateType] = useState<number>(0);

  const [openHowModal, setOpenHowModal] = useState<boolean>(false);

  useEffect(() => {
    const newStakingConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newStakingConfig.configurer = configurer;
    newStakingConfig.config.data.labels =
      dateType === 0
        ? getAllHoursInDay()
        : dateType === 1
        ? getAllLabelsInWeek().map((item) => item.slice(0, 3).toUpperCase())
        : MONTHLABELS.map((item) => item.slice(0, 3).toUpperCase());
    newStakingConfig.config.data.datasets[0].data =
      dateType === 0
        ? getAllValuesInDay()
        : dateType === 1
        ? getAllValuesInWeek()
        : getAllValuesInYear();
    newStakingConfig.config.data.datasets[0].type = 'bar';
    newStakingConfig.config.data.datasets[0].backgroundColor = '#0DCC9E';
    newStakingConfig.config.data.datasets[0].borderColor == '#0DCC9E';
    newStakingConfig.config.data.datasets[0].pointBackgroundColor == '#0DCC9E';
    newStakingConfig.config.data.datasets[0].hoverBackgroundColor == '#0DCC9E';
    setStakingConfig(newStakingConfig);
  }, [dateType]);

  useEffect(() => {
    let newConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newConfig.configurer = configurer;
    newConfig.config.data.labels =
      graphType === 0 || labelType === 0
        ? getAllHoursInDay()
        : getAllLabelsInWeek().map((item) => item.slice(0, 3).toUpperCase());
    newConfig.config.data.datasets[0].data =
      graphType === 0 || labelType === 0
        ? getAllValuesInDay()
        : getAllValuesInWeek();
    newConfig.config.data.datasets[0].type = 'line';
    newConfig.config.data.datasets[0].backgroundColor =
      graphType === 0 ? '#F9E373' : '#6D4DD1';
    newConfig.config.data.datasets[0].borderColor =
      graphType === 0 ? '#F9E373' : '#6D4DD1';
    newConfig.config.data.datasets[0].pointBackgroundColor =
      graphType === 0 ? '#F9E373' : '#6D4DD1';
    newConfig.config.data.datasets[0].hoverBackgroundColor =
      graphType === 0 ? '#F9E373' : '#6D4DD1';
    setFreeHoursConfig(newConfig);
  }, [graphType, labelType]);

  const getAllHoursInDay = () => {
    const result: string[] = [];
    for (let index = 1; index <= 23; index++) {
      result.push(index < 10 ? `0${index}` : `${index}`);
    }

    return result;
  };

  const getAllValuesInDay = () => {
    const result: number[] = [];
    for (let index = 1; index <= 23; index++) {
      result.push(Math.floor(Math.random() * 10000));
    }

    return result;
  };

  const getAllLabelsInWeek = useCallback(() => {
    const d = new Date();
    const n = d.getDay();

    if (n === 0) return DAYLABELS;
    else return [...DAYLABELS.slice(n), ...DAYLABELS.slice(0, n)];
  }, []);

  const getAllValuesInWeek = useCallback(() => {
    const result: number[] = [];
    for (let index = 0; index < DAYLABELS.length; index++) {
      result.push(Math.floor(Math.random() * 10000));
    }

    return result;
  }, []);

  const getAllValuesInYear = useCallback(() => {
    const result: number[] = [];
    for (let index = 0; index < MONTHLABELS.length; index++) {
      result.push(Math.floor(Math.random() * 10000));
    }

    return result;
  }, []);

  const getPercentValueBox = (percent: number) => {
    return (
      <Box
        className={classes.percentValueBox}
        style={{
          background:
            percent > 0 ? 'rgba(0, 209, 59, 0.09)' : 'rgba(244, 62, 95, 0.09)'
        }}
      >
        <Box
          style={{ transform: `rotate(${percent > 0 ? 0 : 180}deg)` }}
          className={classes.flexBox}
        >
          <ShortArrowIcon color={percent > 0 ? '#00D13B' : '#F43E5F'} />
        </Box>
        <Box
          fontSize={percent > 0 ? 21 : 16}
          fontWeight={700}
          color={percent > 0 ? '#00D13B' : '#F43E5F'}
          ml={1}
        >
          {`${percent > 0 ? '+ ' : ''}${percent}%`}
        </Box>
      </Box>
    );
  };

  const getTransactonTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    TRANSACTIONS.map((item) => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box className={classes.flexBox}>
            <img
              src={require(`assets/tokenImages/${item.token}.webp`)}
              width={26}
              height={26}
            />
            <Box ml={1} className={classes.header5}>
              {item.token}
            </Box>
          </Box>
        ),
        cellAlign: 'left'
      });
      row.push({
        cell: (
          <Box
            className={classes.header5}
          >{`${item.stakingAmmount} ${item.token}`}</Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: <Box className={classes.header5}>${item.totalValue}</Box>,
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <Box className={classes.header5} style={{ color: '#65CB63' }}>
            {item.address.substr(0, 12) + '...' + item.address.substr(16)}
          </Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <Moment className={classes.header5} fromNow>
            {item.time}
          </Moment>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <div style={{ cursor: 'pointer' }}>
            <ShareMusicIcon color="#65CB63" />
          </div>
        ),
        cellAlign: 'center'
      });

      tableData.push(row);
    });

    return tableData;
  };

  return (
    <div className={classes.body}>
      <div className={classes.container}>
        <img
          src={require('assets/musicDAOImages/avocado.webp')}
          className={classes.image1}
        />
        <img
          src={require('assets/musicDAOImages/orange.webp')}
          className={classes.image2}
        />
        <img
          src={require('assets/musicDAOImages/watermelon.webp')}
          className={classes.image3}
        />
        <Box className={classes.content}>
          <Box className={classes.flexBox} justifyContent="flex-end">
            <SecondaryButton
              size="medium"
              onClick={() => {}}
              isRounded
              style={{
                width: 235,
                height: 48,
                background: 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                fontSize: 16,
                fontWeight: 700,

                color: '#404658',
                borderRadius: 29
              }}
            >
              Manage Positions
            </SecondaryButton>
          </Box>
          <Box
            className={classes.flexBox}
            width={1}
            justifyContent="center"
            flexDirection="column"
            mt={6}
          >
            <div className={classes.headerTitle}>Staking</div>
            <div className={classes.headerSubTitle}>
              Stake Music & Myx{' '}
              <span>to get fruits and APR of mining rewards.</span>
            </div>
            <Box className={classes.buttonsBox}>
              <SecondaryButton
                size="medium"
                style={{
                  background: 'transparent',
                  color: '#2D3047',
                  border: '1px solid #2D3047'
                }}
                onClick={() => setOpenHowModal(true)}
                isRounded
              >
                How It Works
              </SecondaryButton>
              <PrimaryButton
                size="medium"
                onClick={() => setOpenHowModal(true)}
                isRounded
                style={{ background: '#2D3047' }}
              >
                Calculate Rewards
              </PrimaryButton>
            </Box>
          </Box>
          <div className={classes.stakingPoolSection}>
            <div className={classes.subTitle}>Staking Pools</div>
            <div className={classes.horizontalScrollBox}>
              <Box className={classes.flexBox}>
                {STAKINGPOOLS.map((pool, index) => (
                  <Box key={index} ml={index > 0 ? 3 : 0}>
                    <StakingPoolCard item={pool} />
                  </Box>
                ))}
              </Box>
            </div>
          </div>
          <div className={classes.stakingStatsSection}>
            <div className={classes.subTitle1}>Staking stats</div>
            <Box className={classes.statsGroup}>
              <Box className={classes.whiteBox}>
                <Box
                  className={classes.flexBox}
                  justifyContent="flex-end"
                  width={1}
                >
                  {getPercentValueBox(3.2)}
                </Box>
                <Box className={classes.header3} color={'#54658F'} mt={'3px'}>
                  total rewards
                </Box>
                <Box className={classes.header1} color={'#2D3047'} mt={'11px'}>
                  7,923
                </Box>
                <Box className={classes.header3} color={'#54658F'} mt={'11px'}>
                  USD
                </Box>
              </Box>
              {!isMobile && (
                <Box className={classes.whiteBox}>
                  <Box
                    className={classes.flexBox}
                    justifyContent="flex-end"
                    width={1}
                  >
                    {getPercentValueBox(-3)}
                  </Box>
                  <Box className={classes.header3} color={'#54658F'} mt={'5px'}>
                    Total amount staked
                  </Box>
                  <Box
                    className={classes.header1}
                    color={'#2D3047'}
                    mt={'11px'}
                  >
                    8,555,732.22
                  </Box>
                  <Box
                    className={classes.header3}
                    color={'#54658F'}
                    mt={'11px'}
                  >
                    USD
                  </Box>
                </Box>
              )}
            </Box>
            {isMobile && (
              <Box className={classes.statsGroup} mt={2}>
                <Box className={classes.whiteBox}>
                  <Box
                    className={classes.flexBox}
                    justifyContent="space-between"
                    width={1}
                  >
                    <OscelloIcon />
                    <Box className={classes.percentValueBox}>
                      {getPercentValueBox(2.5)}
                    </Box>
                  </Box>
                  <Box
                    className={classes.header3}
                    color={'#54658F'}
                    mt={3}
                    style={{ textTransform: 'uppercase' }}
                  >
                    Total amount staked
                  </Box>
                  <Box className={classes.header1} color={'#2D3047'} mt={1}>
                    8,555,732.22
                  </Box>
                  <Box className={classes.header3} color={'#54658F'} mt={1}>
                    USD
                  </Box>
                </Box>
              </Box>
            )}
          </div>
          <div className={classes.graphSection}>
            <Box
              className={classes.flexBox}
              justifyContent="space-between"
              borderBottom="1px solid #00000022"
              flexWrap="wrap"
              gridRowGap={15}
              pb={2}
            >
              <Box className={classes.header1} color="#404658">
                {graphType === 0 ? 'Rewards' : 'Staked'}
              </Box>
              <Box className={classes.controlBox}>
                <Box
                  className={`${classes.buttonBox} ${
                    graphType === 0 ? classes.selectedButtonBox : ''
                  }`}
                  onClick={() => setGraphType(0)}
                >
                  Rewards
                </Box>
                <Box
                  className={`${classes.buttonBox} ${
                    graphType === 2 ? classes.selectedButtonBox : ''
                  }`}
                  onClick={() => setGraphType(2)}
                >
                  Staked
                </Box>
              </Box>
            </Box>

            <Box className={classes.flexBox} justifyContent="space-between">
              <Box className={classes.flexBox} my={1}>
                <Box className={classes.header2}>
                  {graphType === 0 ? '126,487' : '$4.16b'}
                </Box>
                <Box
                  className={classes.secondButtonBox}
                  style={{
                    background:
                      graphType === 0 ? 'rgba(255, 153, 0, 1)' : '#6D4DD1',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    border: 'none'
                  }}
                  ml={2}
                >
                  <SparkIcon />
                  <span style={{ marginLeft: '8px', color: 'white' }}>
                    +421.27%
                  </span>
                </Box>
              </Box>
              {graphType !== 0 && (
                <Box
                  className={classes.controlBox}
                  style={{
                    background: '#6D4DD133'
                  }}
                >
                  <Box
                    className={classes.secondButtonBox}
                    style={{
                      background: labelType === 0 ? '#6D4DD1' : 'transparent',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      border: 'none',
                      color: labelType === 0 ? 'white' : 'black'
                    }}
                    onClick={() => setLabelType(0)}
                  >
                    Day
                  </Box>
                  <Box
                    className={classes.secondButtonBox}
                    style={{
                      background: labelType === 1 ? '#6D4DD1' : 'transparent',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      border: 'none',
                      color: labelType === 1 ? 'white' : 'black'
                    }}
                    onClick={() => setLabelType(1)}
                  >
                    Week
                  </Box>
                </Box>
              )}
            </Box>
            <Box style={{ height: '350px' }}>
              {freeHoursConfig && <PrintChart config={freeHoursConfig} />}
            </Box>
          </div>
          <div className={classes.transactionSection}>
            <Box
              className={classes.flexBox}
              justifyContent="space-between"
              mb={4}
            >
              <Box fontSize={22} fontWeight={800} color="#2D3047">
                Transactions
              </Box>
              <Box className={classes.flexBox} justifyContent="center">
                <Box className={classes.secondButtonBox} onClick={() => {}}>
                  <div className={classes.header4}>Show All</div>
                  <Box
                    style={{ transform: `rotate(90deg)` }}
                    className={classes.flexBox}
                    ml={3}
                  >
                    <ShortArrowIcon color="#2D3047" />
                  </Box>
                </Box>
              </Box>
            </Box>
            <CustomTable
              headers={TRANSACTIONHEADERS}
              rows={getTransactonTableData()}
              theme="transaction"
            />
          </div>
          {openHowModal && (
            <HowItWorksModal
              open={openHowModal}
              handleClose={() => setOpenHowModal(false)}
              isStack
            />
          )}
        </Box>
      </div>
    </div>
  );
}
