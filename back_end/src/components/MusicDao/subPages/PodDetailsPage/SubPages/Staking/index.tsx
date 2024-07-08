import React, { useState, useEffect } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';

import PrintChart from 'shared/ui-kit/Chart/Chart';
import {
  StyledMenuItem,
  StyledSelect
} from 'shared/ui-kit/Styled-components/StyledComponents';
import Box from 'shared/ui-kit/Box';
import { Gradient, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import TradePodTokenModal from 'components/MusicDao/modals/TradePodTokenModal';
import {
  formatNumber,
  generateMonthLabelsFromDate
} from 'shared/functions/commonFunctions';
import {
  musicDaoGetStaking,
  musicDaogGetPodPriceHistory
} from 'shared/services/API';
import StakingPodCard from 'components/MusicDao/components/Cards/StakingPodCard';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import PodStakingModal from 'components/MusicDao/modals/PodStakingModal';

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: 'bar',
          label: '',
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: '#F9E373',
          borderColor: '#F9E373',
          pointBackgroundColor: '#F9E373',
          hoverBackgroundColor: '#F9E373',
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          borderWidth: 3,
          cubicInterpolationMode: 'monotone',
          lineTension: 0.1
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
          top: 50,
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
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(
      1,
      `${config.data.datasets[index].backgroundColor}33`
    );
    gradient.addColorStop(
      0.5,
      `${config.data.datasets[index].backgroundColor}b0`
    );
    config.data.datasets[index].backgroundColor = gradient;
  }

  return config;
};

const useStyles = makeStyles((theme) => ({
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  shadowBox: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    background: Gradient.Green1,
    boxShadow: `0px 2px 14px rgba(0, 0, 0, 0.08)`,
    margin: theme.spacing(1),
    '& *': {
      color: 'white !important'
    }
  },
  topHeaderLabel: {
    background: `linear-gradient(270.47deg, #D66DB2 -3.25%, #BB34D1 93.45%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  whiteBox: {
    borderRadius: theme.spacing(2),
    background: 'white',
    padding: `${theme.spacing(3)}px ${theme.spacing(4)}px`
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',

    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  header1: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '18px',
    color: '#081831'
  },
  header2: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '120%',
    color: '#707582',
    textShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)'
  },
  header3: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '22px',
    lineHeight: '120%',
    color: '#081831',
    textShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)'
  },
  header3green: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '22px',
    lineHeight: '120%',
    background: `linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)'
  },
  flexBoxHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`
  },
  greenBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    borderRadius: '12px'
  },
  graphBox: {
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 34px',
    border: `1px solid #E0E4F3`,
    borderRadius: '12px',
    margin: theme.spacing(1),
    position: 'relative',
    background: 'white'
  },
  valueBox: {
    position: 'absolute',
    left: '60px',
    top: '70px',
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    boxShadow: `2px 2px 12px rgba(0, 0, 0, 0.1)`,
    background: 'white'
  },
  graphHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  select: {
    '& > div': {
      paddingBottom: '11px',
      minWidth: '120px'
    }
  },
  colorBox: {
    width: theme.spacing(0.5),
    height: theme.spacing(4.5),
    borderRadius: '2px'
  },
  circle: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#65CB63',
    marginRight: '8px'
  },
  externalLink: {
    verticalAlign: 'middle'
  },

  tableContainer: {
    '& > div': {
      borderRadius: '16px',
      boxShadow: 'none'
    },

    '& tr': {
      '& th:first-child': {
        borderTopLeftRadius: '16px'
      },

      '& th:last-child': {
        borderTopRightRadius: '16px'
      }
    },

    '& tr:last-child': {
      '& td:first-child': {
        borderBottomLeftRadius: '16px'
      },

      '& td:last-child': {
        borderBottomRightRadius: '16px'
      }
    }
  },

  barContainer: {
    background: 'rgba(84, 101, 143, 0.3)',
    height: 3,
    borderRadius: '20px',
    width: '100%',
    '& > div': {
      background:
        'linear-gradient(90deg, #A0D800 39.81%, #0DCC9E 75.56%, rgba(255, 255, 255, 0) 98.84%)',
      height: 3,
      borderRadius: '20px'
    }
  },

  divider: {
    height: 1,
    opacity: 0.1,
    borderBottom: '1px dashed #181818',
    background: 'transparent',
    width: '100%',
    margin: '20px 0'
  }
}));

const mockStakings = [
  {
    position: 'Staking Position',
    amount: 1244456,
    date: new Date().getTime() + 1000,
    rewardsAccumulated: 245
  },
  {
    position: 'Staking Position',
    amount: 1244456,
    date: new Date().getTime() + 1000,
    rewardsAccumulated: 245
  },
  {
    position: 'Staking Position',
    amount: 1244456,
    date: new Date().getTime() + 1000,
    rewardsAccumulated: 245
  }
];

const TimRangeList: any[] = ['6 Months'];

const Staking = ({ pod, podInfo, handleRefresh }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();

  const [selectedTimeRange, setSelectedTimeRange] = useState<any>(
    TimRangeList[0]
  );
  const [priceChartConfig, setPriceChartConfig] = useState<any>();
  const [lastPrice, setLastPrice] = useState<number>(0);
  const [prevPrice, setPrevPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [stakings, setStakings] = useState<any>([]);

  const [mode, setMode] = useState<string>('invest');
  const [openStakingModal, setOpenStakingModal] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // load price history
    musicDaogGetPodPriceHistory(pod.PodAddress, 180).then((resp) => {
      const points = resp.data;
      let prices: number[] = [];
      let dates: number[] = [];
      if (points) {
        prices = points.map((obj) => obj.price);
        dates = points.map((obj) => obj.date);
      }

      const labels: string[] = generateMonthLabelsFromDate(dates);
      const newRewardConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
      newRewardConfig.configurer = configurer;
      newRewardConfig.config.data.labels = labels;
      newRewardConfig.config.data.datasets[0].data = prices;
      newRewardConfig.config.data.datasets[0].backgroundColor = '#0FCEA6';
      newRewardConfig.config.data.datasets[0].borderColor = '#0FCEA6';
      newRewardConfig.config.data.datasets[0].pointBackgroundColor = '#0FCEA6';
      newRewardConfig.config.data.datasets[0].hoverBackgroundColor = '#0FCEA6';
      newRewardConfig.config.data.datasets[0].type = 'line';
      newRewardConfig.config.options.scales.xAxes[0].offset = false;
      newRewardConfig.config.options.scales.yAxes[0].ticks.display = false;
      setPriceChartConfig(newRewardConfig);

      // set price change
      let newLastPrice = 0;
      let newPrevPrice = 0;
      let newPriceChange = 0;
      if (prices.length > 0) newLastPrice = prices[prices.length - 1];
      if (prices.length > 1) newPrevPrice = prices[prices.length - 2];
      if (newPrevPrice)
        newPriceChange = (newLastPrice - newPrevPrice) / newPrevPrice;
      setLastPrice(Number(newLastPrice.toFixed(4)));
      setPrevPrice(Number(newPrevPrice.toFixed(4)));
      setPriceChange(Number(newPriceChange.toFixed(2)));
    });

    // load staking positions
    const response = await musicDaoGetStaking(pod.Id);
    if (response?.success) {
      setStakings(response.data);
    }
  };

  const tokenStakings = React.useMemo(
    () => stakings.filter((stake) => stake.type === 'TOKEN'),
    [stakings]
  );
  const nftStakings = React.useMemo(
    () => stakings.filter((stake) => stake.type === 'NFT'),
    [stakings]
  );

  return (
    <Box mt={3}>
      <Box
        className={classes.flexBox}
        justifyContent="space-between"
        px={1}
        mb={3}
      >
        <Box className={classes.title}>Staking</Box>
        <PrimaryButton
          size="small"
          onClick={() => {
            setMode('invest');
            setOpenStakingModal(true);
          }}
          style={{
            background: Gradient.Green1,
            padding: '11px 48px',
            borderRadius: '46px',

            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '18px',
            border: 'none',
            height: 'auto'
          }}
          isRounded
        >
          Stake Now
        </PrimaryButton>
      </Box>

      <Grid container>
        <Grid
          item
          xs={12}
          sm={4}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Box
            className={classes.graphBox}
            flex={1}
            justifyContent="space-between"
          >
            <Box>
              <Box className={classes.header2}>Total staked</Box>
              <Box className={classes.header3green} mt={1}>
                ${(pod.totalStaked ?? 0).toLocaleString()}
              </Box>
            </Box>

            <Box className={classes.divider} />

            <Box>
              <Box className={classes.header2}>Total Rewards Accumulated</Box>
              <Box className={classes.header3} mt={1}>
                ${(pod.totalRewards ?? 0).toLocaleString()}
              </Box>
            </Box>
          </Box>

          <Box className={classes.graphBox}>
            <Box>
              <Box className={classes.header2}>Average Apr</Box>
              <Box className={classes.header3green} mt={1}>
                ${((pod.APR ?? 0) * 100).toFixed(0)}%
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box className={classes.graphBox} height="400px">
            <Box className={classes.graphHeader}>
              <Box className={classes.header1}>Price History</Box>
              <FormControl variant="outlined">
                <StyledSelect
                  className={classes.select}
                  value={selectedTimeRange}
                  onChange={(v) => {}}
                >
                  {TimRangeList.map((item, index) => (
                    <StyledMenuItem key={index} value={item}>
                      {item}
                    </StyledMenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Box>
            <Box style={{ height: '100%' }}>
              {priceChartConfig && <PrintChart config={priceChartConfig} />}
            </Box>
            <Box className={classes.valueBox}>
              <Box className={classes.header1}>
                {formatNumber(lastPrice, 'USD', 2)}
              </Box>
              <Box
                className={classes.header2}
                color={lastPrice >= prevPrice ? '#0FCEA6' : '#F43E5F'}
              >
                {lastPrice > prevPrice ? '+' : ''}
                {lastPrice - prevPrice} ({priceChange > 0 ? '+' : ''}
                {priceChange * 100}%)
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box
        className={classes.flexBox}
        justifyContent="space-between"
        px={1}
        mb={3}
        mt={6}
      >
        <Box className={classes.title}>Media Fractions</Box>
        <SecondaryButton
          size="small"
          onClick={() => {}}
          style={{
            background: 'transparent',
            padding: isMobile ? '10px 20px' : '11px 16px 11px 48px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '46px',

            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '18px',
            color: '#2D3047',
            border: '1px solid #65CB63',
            height: 'auto'
          }}
          isRounded
        >
          <Box mr={isMobile ? '16px' : '8px'}>Show All</Box> <Arrow />
        </SecondaryButton>
      </Box>
      <MasonryGrid
        gutter={'21px'}
        data={tokenStakings.filter((itm, i) => i < 3)}
        renderItem={(item, index) => (
          <StakingPodCard
            key={`fraction-${index}`}
            staking={item}
            pod={pod}
            podInfo={podInfo}
            handleRefresh={() => {
              handleRefresh();
              loadData();
            }}
          />
        )}
        columnsCountBreakPoints={{ 300: 1, 765: 2, 900: 3 }}
      />

      <Box
        className={classes.flexBox}
        justifyContent="space-between"
        px={1}
        mb={3}
        mt={6}
      >
        <Box className={classes.title}>NFT</Box>
        <SecondaryButton
          size="small"
          onClick={() => {}}
          style={{
            background: 'transparent',
            padding: isMobile ? '10px 20px' : '11px 16px 11px 48px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '46px',

            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '18px',
            color: '#2D3047',
            border: '1px solid #65CB63',
            height: 'auto'
          }}
          isRounded
        >
          <Box mr={isMobile ? '16px' : '8px'}>Show All</Box> <Arrow />
        </SecondaryButton>
      </Box>
      <MasonryGrid
        gutter={'21px'}
        data={nftStakings.filter((itm, i) => i < 3)}
        renderItem={(item, index) => (
          <StakingPodCard
            key={`nft-${index}`}
            staking={item}
            pod={pod}
            podInfo={podInfo}
            handleRefresh={() => {
              handleRefresh();
              loadData();
            }}
          />
        )}
        columnsCountBreakPoints={{ 300: 1, 765: 2, 900: 3 }}
      />

      {openStakingModal && (
        <PodStakingModal
          open={openStakingModal}
          onClose={() => setOpenStakingModal(false)}
          handleRefresh={() => {
            handleRefresh();
            loadData();
          }}
          pod={pod}
          podInfo={podInfo}
          stakings={stakings}
        />
      )}
    </Box>
  );
};

const RedCross = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
  >
    <path
      d="M16.9993 0.637207C12.6595 0.637207 8.49719 2.36128 5.42855 5.42953C2.35991 8.49777 0.63623 12.6605 0.63623 17.0003C0.63623 21.3401 2.36031 25.5024 5.42855 28.571C8.49679 31.6397 12.6595 33.3634 16.9993 33.3634C21.3391 33.3634 25.5014 31.6393 28.5701 28.571C31.6387 25.5028 33.3624 21.3401 33.3624 17.0003C33.3624 12.6605 31.6383 8.49817 28.5701 5.42953C25.5018 2.36089 21.3391 0.637207 16.9993 0.637207ZM11.1972 9.56269C11.6388 9.56269 12.062 9.74128 12.3714 10.0577L16.9992 14.6869L21.627 10.0577C21.9237 9.75253 22.3273 9.57536 22.752 9.56269C23.427 9.543 24.0443 9.93957 24.3073 10.5611C24.5703 11.1827 24.4254 11.9027 23.9417 12.3723L19.3125 17.0001L23.9417 21.6279C24.2539 21.9345 24.4325 22.3522 24.4339 22.7895C24.4367 23.2268 24.2651 23.6473 23.9558 23.9567C23.6464 24.2661 23.2259 24.4376 22.7886 24.4362C22.3512 24.4334 21.9336 24.2562 21.627 23.9426L16.9992 19.3148L12.3714 23.9426C12.0648 24.2562 11.6472 24.4334 11.2098 24.4362C10.7725 24.4376 10.352 24.2661 10.0426 23.9567C9.73325 23.6474 9.56171 23.2269 9.56452 22.7895C9.56592 22.3522 9.74452 21.9345 10.0567 21.6279L14.686 17.0001L10.0567 12.3723C9.58 11.9083 9.43092 11.2009 9.68123 10.5836C9.93154 9.96625 10.5306 9.56265 11.1972 9.56265L11.1972 9.56269Z"
      fill="#F43E5F"
    />
  </svg>
);

const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="12"
    viewBox="0 0 14 12"
    fill="none"
  >
    <path
      d="M7.90262 11.5441C8.09347 11.5441 8.26423 11.4713 8.4149 11.3256L13.1384 6.60965C13.2941 6.46401 13.3719 6.28571 13.3719 6.07478C13.3719 5.86886 13.2941 5.69057 13.1384 5.5399L8.4375 0.84654C8.35212 0.761161 8.26549 0.699637 8.1776 0.66197C8.0897 0.624302 7.99805 0.605469 7.90262 0.605469C7.70173 0.605469 7.53348 0.670759 7.39788 0.801339C7.26228 0.93192 7.19448 1.09766 7.19448 1.29855C7.19448 1.399 7.21205 1.49316 7.24721 1.58105C7.28237 1.66895 7.33259 1.74554 7.39788 1.81083L9.00251 3.43806L11.2139 5.45996L9.53739 5.3591L0.723214 5.3591C0.512277 5.3591 0.339007 5.42564 0.203404 5.55873C0.0678013 5.69182 0 5.86384 0 6.07478C0 6.29074 0.0678013 6.46526 0.203404 6.59835C0.339007 6.73145 0.512277 6.79799 0.723214 6.79799L9.53739 6.79799L11.2203 6.69811L9.00251 8.71903L7.39788 10.3463C7.33259 10.4116 7.28237 10.4881 7.24721 10.576C7.21205 10.6639 7.19448 10.7581 7.19448 10.8585C7.19448 11.0544 7.26228 11.2176 7.39788 11.3482C7.53348 11.4788 7.70173 11.5441 7.90262 11.5441Z"
      fill="#2D3047"
    />
  </svg>
);

export default Staking;
