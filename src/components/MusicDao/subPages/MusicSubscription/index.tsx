import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import PrintChart from 'shared/ui-kit/Chart/Chart';
import { Color, PrimaryButton } from 'shared/ui-kit';
import { musicSubscriptionStyles } from './index.styles';
import { TokenSelect } from 'shared/ui-kit/Select/TokenSelect';
import URL from 'shared/functions/getURL';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';

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

const TableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: 'center',
    headerName: 'Hours Received'
  },
  {
    headerAlign: 'center',
    headerName: 'Staking Amount'
  },
  {
    headerAlign: 'center',
    headerName: 'Total Value'
  },
  {
    headerAlign: 'center',
    headerName: 'Address'
  },
  {
    headerAlign: 'center',
    headerName: 'Time'
  },
  {
    headerAlign: 'center',
    headerName: 'Music Scan'
  }
];

export default function MusicSubscriptionPage() {
  const classes = musicSubscriptionStyles();

  const isMobile = useMediaQuery('(max-width:400px)');

  const [tokens, setTokens] = React.useState<any[]>([]);
  const [token, setToken] = React.useState<string>();

  const [rewardConfig, setRewardConfig] = React.useState<any>();

  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>(
    []
  );

  const getDiscountRage = () => {
    const result: number[] = [];

    for (let index = 0; index < 11; index++) {
      result.push(index * 2);
    }

    return result;
  };

  const getMusicHours = () => {
    const result: number[] = [];

    for (let index = 1; index < 11; index++) {
      result.push(index * 10);
    }

    return result;
  };

  React.useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then((res) => {
      const resp = res.data;
      if (resp.success) {
        setTokens(
          resp.data.map((obj) => ({ token: obj.token, name: obj.token }))
        ); // update token list
        setToken(resp.data[0].token);
      }
    });

    const newRewardConfig1 = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig1.configurer = configurer;
    newRewardConfig1.config.data.labels = getMusicHours();
    newRewardConfig1.config.data.datasets[0].data = getDiscountRage();
    newRewardConfig1.config.data.datasets[0].backgroundColor = '#65CB63';
    newRewardConfig1.config.data.datasets[0].borderColor = '#65CB63';
    newRewardConfig1.config.data.datasets[0].pointBackgroundColor = '#65CB63';
    newRewardConfig1.config.data.datasets[0].hoverBackgroundColor = '#65CB63';

    setRewardConfig(newRewardConfig1);

    setTableData(
      [1, 2, 3, 4, 5].map((row) => {
        return [
          {
            cellAlign: 'center',
            cell: (
              <Box fontSize={16} fontWeight={600} color={Color.MusicDAOGreen}>
                23h 12m 34s
              </Box>
            )
          },
          {
            cellAlign: 'center',
            cell: '50.54 USDT'
          },
          {
            cellAlign: 'center',
            cell: '$74.03k'
          },
          {
            cellAlign: 'center',
            cell: (
              <Box fontSize={16} fontWeight={600} color={Color.MusicDAOGreen}>
                0xcD242...294
              </Box>
            )
          },
          {
            cellAlign: 'center',
            cell: '1 minute ago'
          },
          {
            cellAlign: 'center',
            cell: (
              <svg
                width="16"
                height="18"
                viewBox="0 0 16 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.9776 1.00001L6.67312 11M14.9776 1.00001L14.9777 7.00001M14.9776 1.00001L9.99498 1M6.67315 1.00001H1.69043V17H14.9777V11"
                  stroke="#65CB63"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )
          }
        ];
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className={classes.container}>
      <Box className={classes.backgroundBox} />
      <div className={classes.body}>
        <Box display="flex" justifyContent="flex-end">
          <Box
            display="flex"
            alignItems="center"
            bgcolor={'rgba(255, 255, 255, 0.5)'}
            padding="3px 10px"
            borderRadius={30}
          >
            <Box width={32} height={32} bgcolor="#009C51" borderRadius="100%">
              <img
                src={require('assets/musicDAOImages/music-default.webp')}
                alt="music"
                style={{ marginLeft: -14, marginTop: -14 }}
              />
            </Box>
            <Box fontSize={16} fontWeight={500} color="#404658" ml={1.5}>
              Available music
            </Box>
            <Box fontSize={16} fontWeight={600} color="#404658" ml={2.5}>
              255 h 32 min
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt={1}
        >
          <Box fontSize={58} fontWeight={400} color={Color.White}>
            <span style={{ fontWeight: 800 }}>Music</span> Subscription
          </Box>
          <Box
            fontSize={26}
            fontWeight={400}
            color={Color.White}
            width={735}
            textAlign="center"
            mt={2}
          >
            <span style={{ fontWeight: 800 }}>Get hours of music</span> to use
            across TRAX platform and enjoy your favurite tracks and artists.
          </Box>
        </Box>
        <Box className={classes.card}>
          <Box className={classes.title}>Pick Your Music Subscription Plan</Box>
          <Box className={classes.titleDescription} mt={2}>
            You can pick your subscription plan by adjusting USDT value to match
            hours of music you want in return.
          </Box>
          <Box display="flex" alignItems="center" mt={7}>
            <Grid container spacing={3}>
              <Grid item md={6} sm={12}>
                <Box display="flex" flexDirection="column">
                  <Box className={classes.itemTitle} mb={2}>
                    Select Chain
                  </Box>
                  <TokenSelect
                    tokens={tokens}
                    value={token}
                    className={classes.tokenSelect}
                    onChange={(e) => {
                      setToken(e.target.value);
                    }}
                  />
                </Box>
              </Grid>
              <Grid item md={6} sm={12}>
                <Box display="flex" flexDirection="column">
                  <Box className={classes.itemTitle} mb={2}>
                    Amount of USDT
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className={classes.tokenValue}
                  >
                    <img
                      width={37}
                      height={37}
                      src={require('assets/tokenImages/USDT.webp')}
                      alt="token"
                    />
                    <input />
                    <span>225 USDT</span>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box className={classes.cardBox} mt={4}>
            <Box className={classes.title}>Calculate discount</Box>
            <Box fontSize={14} fontWeight={500} color="#707582" mt={1}>
              Discount rate applies to your purchase and grows proportionally to
              the amount of music hours you buy.
            </Box>
            <Box mt={4}>
              <Grid container spacing={2}>
                <Grid item md={6} sm={12}>
                  <Box display="flex" flexDirection="column">
                    <Box className={classes.cardBoxTitle}>Amount you pay</Box>
                    <Box className={classes.cardBoxValue} mt={1}>
                      <span>5</span> USDT
                    </Box>
                    <Box
                      height={'1px'}
                      width={1}
                      bgcolor="rgba(0, 0, 0, 0.1)"
                      my="18px"
                    />
                    <Box className={classes.cardBoxTitle}>
                      Amount of hours you get
                    </Box>
                    <Box className={classes.cardBoxValue} mt={1}>
                      <span>20</span> hours
                    </Box>
                    <Box
                      height={'1px'}
                      width={1}
                      bgcolor="rgba(0, 0, 0, 0.1)"
                      my="18px"
                    />
                    <Box className={classes.cardBoxTitle}>discount rate</Box>
                    <Box className={classes.cardBoxValue} mt={1}>
                      <span>2</span> %
                    </Box>
                  </Box>
                </Grid>
                <Grid item md={6} sm={12}>
                  {rewardConfig && <PrintChart config={rewardConfig} />}
                </Grid>
              </Grid>
            </Box>
            <Box display="flex" justifyContent="center">
              <PrimaryButton size="medium">Get subscription</PrimaryButton>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={4}
          >
            <Box className={classes.title}>Transactions</Box>
            <Box className={classes.secondButtonBox}>
              <Box fontSize={14} fontWeight={600} color={Color.MusicDAODark}>
                Show All
              </Box>
              <ShortArrowIcon />
            </Box>
          </Box>
          <Box mt={2.5}>
            <CustomTable
              headers={TableHeaders}
              rows={tableData}
              placeholderText="No transaction"
              theme="transaction"
            />
          </Box>
        </Box>
      </div>
    </Box>
  );
}

const ShortArrowIcon = () => {
  return (
    <svg
      width="14"
      height="11"
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.40262 10.9386C8.59347 10.9386 8.76423 10.8658 8.9149 10.7201L13.6384 6.00419C13.7941 5.85854 13.8719 5.68025 13.8719 5.46931C13.8719 5.26339 13.7941 5.0851 13.6384 4.93443L8.9375 0.241071C8.85212 0.155692 8.76549 0.0941685 8.6776 0.0565011C8.5897 0.0188337 8.49805 0 8.40262 0C8.20173 0 8.03348 0.0652902 7.89788 0.195871C7.76228 0.326451 7.69448 0.492188 7.69448 0.69308C7.69448 0.793527 7.71205 0.887695 7.74721 0.975586C7.78237 1.06348 7.83259 1.14007 7.89788 1.20536L9.50251 2.83259L11.7139 4.8545L10.0374 4.75363L1.22321 4.75363C1.01228 4.75363 0.839007 4.82017 0.703404 4.95326C0.567801 5.08636 0.5 5.25837 0.5 5.46931C0.5 5.68527 0.567801 5.85979 0.703404 5.99289C0.839007 6.12598 1.01228 6.19252 1.22321 6.19252L10.0374 6.19252L11.7203 6.09264L9.50251 8.11356L7.89788 9.74079C7.83259 9.80608 7.78237 9.88267 7.74721 9.97056C7.71205 10.0585 7.69448 10.1526 7.69448 10.2531C7.69448 10.4489 7.76228 10.6122 7.89788 10.7427C8.03348 10.8733 8.20173 10.9386 8.40262 10.9386Z"
        fill="#181818"
      />
    </svg>
  );
};
