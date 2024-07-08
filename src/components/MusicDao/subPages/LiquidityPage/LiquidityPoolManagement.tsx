import React from 'react';
import classnames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import MenuItem from '@material-ui/core/MenuItem';

import Box from 'shared/ui-kit/Box';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import { useStyles } from './index.styles';
import { Text } from 'components/MusicDao/components/ui-kit';
import { FontSize, Color, StyledDivider, SecondaryButton } from 'shared/ui-kit';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  GrowIcon
} from 'components/MusicDao/components/Icons/SvgIcons';
import { ReactComponent as ArrowLeft } from 'assets/icons/arrow-left.svg';
import PrintChart from 'shared/ui-kit/Chart/Chart';
import { ArrowLeftIcon, BackIcon } from '../GovernancePage/styles';
import { useHistory } from 'react-router-dom';
import LiquidityPositionCard from 'components/MusicDao/components/LiquidityPositionCard';

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: 'bar',
          data: [] as any[],
          fill: true,
          backgroundColor: 'transparent',
          lineTension: 0.2,
          barThickness: 6,
          hoverBackgroundColor: '#65CB63',
          borderRadius: 31
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
          top: 80,
          bottom: 0
        }
      },

      scales: {
        xAxes: [
          {
            offset: true,
            display: true,
            ticks: {
              beginAtZero: true,
              fontColor: '#404658',
              fontSize: 10
            },
            scaleLabel: {
              display: true,
              labelString: 'Date',
              fontColor: '#404658',
              fontSize: 10,

              position: 'left'
            },
            gridLines: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Music',
              fontColor: '#404658',
              fontSize: 10
            },
            gridLines: {
              color: '#E6E6E6'
            },
            ticks: {
              beginAtZero: true,
              fontColor: '#404658',
              fontSize: 10
            },
            position: 'right'
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
      }
    }
  },
  configurer: (config: any, ref: CanvasRenderingContext2D): object => {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
    gradient.addColorStop(0, '#33D076');
    gradient.addColorStop(0.6, '#33D076');
    gradient.addColorStop(1, 'rgba(160, 216, 1, 0.3)');
    config.data.datasets[0].backgroundColor = gradient;

    return config;
  }
};
const HourLabels: any[] = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23'
];
const DayLabels: any[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30'
];
const LiquidityIntervals = ['Daily', 'Hourly'];
const TransactionTypes = ['All', 'Adds', 'Removes'];

export default function LiquidityPoolManagement() {
  const classes = useStyles();
  const commonClasses = musicDaoPageStyles();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.only('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'));

  const history = useHistory();

  const [liquidityType, setLiquidityType] = React.useState<string>(
    LiquidityIntervals[0]
  );
  const [transactionType, setTransactionType] = React.useState<string>(
    TransactionTypes[0]
  );

  const [liquidityConfig, setLiquidityConfig] = React.useState<any>();
  const [poolStateIndex, setPoolStateIndex] = React.useState<any>(0);

  React.useEffect(() => {
    const newLiquidityConfig = { ...FreeHoursChartConfig };
    newLiquidityConfig.config.data.labels = DayLabels;
    newLiquidityConfig.config.options.scales.xAxes[0].scaleLabel.labelString =
      'Days';
    newLiquidityConfig.config.data.datasets[0].data = [
      10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120,
      230, 10, 40, 65, 80, 120, 230, 10, 40, 65, 45, 23, 11
    ];
    setLiquidityConfig(newLiquidityConfig);
  }, []);

  const handleChangeLiquidity = (type: string) => () => {
    setLiquidityType(type);
    const newLiquidityConfig = { ...FreeHoursChartConfig };
    if (type === 'Daily') {
      newLiquidityConfig.config.data.labels = DayLabels;
      newLiquidityConfig.config.options.scales.xAxes[0].scaleLabel.labelString =
        'Days';
      newLiquidityConfig.config.data.datasets[0].data = [
        10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120,
        230, 10, 40, 65, 80, 120, 230, 10, 40, 65, 45, 23, 11
      ];
    } else {
      newLiquidityConfig.config.data.labels = HourLabels;
      newLiquidityConfig.config.options.scales.xAxes[0].scaleLabel.labelString =
        'Hours';
      newLiquidityConfig.config.data.datasets[0].data = [
        10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120, 230, 10, 40, 65, 80, 120,
        230, 10, 40, 65, 80, 120, 230, 10, 40, 65
      ];
    }
    setLiquidityConfig(newLiquidityConfig);
  };

  const handleChangeTransaction = (type: string) => () => {
    setTransactionType(type);
  };

  const changePoolStateIndex = (index) => {
    const newIndex = index + poolStateIndex;
    if (newIndex >= 0 && newIndex < 3) {
      setPoolStateIndex(newIndex);
    }
  };

  const cardCount = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <Box className={classes.container}>
      <img
        src={require('assets/musicDAOImages/background.webp')}
        className={classnames(classes.gradient, 'pod-detail')}
      />
      <Box className={classnames(classes.content, 'pool-management')}>
        <Box
          display="flex"
          flexDirection="row"
          className={commonClasses.backButton}
          onClick={() => history.goBack()}
        >
          <BackIcon />
          <Text ml={1} color={Color.White} bold>
            BACK
          </Text>
        </Box>
        <Box display="flex" flexDirection="column" mt={4}>
          <Text size={FontSize.H3} color={Color.White} bold>
            Liquidity Pool Management
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            className={commonClasses.card}
            mt={4}
            px={4}
            py={4.5}
            mb={3}
          >
            <Box
              className={classes.poolRewards}
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              gridColumnGap={20}
              gridRowGap={20}
            >
              <Box
                className={classes.poolRewardsSelect}
                display="flex"
                flexDirection="row"
                alignItems="center"
              >
                <Text size={FontSize.XXL} bold mr={2}>
                  Rewards
                </Text>
                <Select
                  value={'2020-05-17'}
                  className={commonClasses.outlineSelect}
                >
                  <MenuItem value={'2020-05-17'}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      17 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={'2020-05-18'}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      18 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={'2020-05-19'}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      19 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={'2020-05-20'}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      20 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={'2020-05-21'}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      21 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={'2020-05-22'}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      22 May 2020
                    </Text>
                  </MenuItem>
                  <MenuItem value={'2020-05-23'}>
                    <Text color={Color.MusicDAOLightBlue} bold>
                      23 May 2020
                    </Text>
                  </MenuItem>
                </Select>
              </Box>
              <Box
                className={classes.poolRewardsButtons}
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
              >
                <Box bgcolor="#F0F5F8" borderRadius={77} p={0.5}>
                  {LiquidityIntervals.map((item, index) => (
                    <button
                      key={`liquidity-button-${index}`}
                      className={`${commonClasses.groupButton} ${
                        item === liquidityType &&
                        commonClasses.selectedGroupButton
                      }`}
                      onClick={handleChangeLiquidity(item)}
                    >
                      {item}
                    </button>
                  ))}
                </Box>
              </Box>
            </Box>
            <StyledDivider
              className={classes.divider}
              type="solid"
              margin={2}
            />
            <Box display="flex" flexDirection="row" alignItems="center">
              <Text size={FontSize.XXL} mr={2}>
                126,487
              </Text>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor={Color.MusicDAOGreen}
                borderRadius={40}
                py={1}
                px={2}
              >
                <GrowIcon />
                <Text ml={1} size={FontSize.S} bold color={Color.White}>
                  +421.27%
                </Text>
              </Box>
            </Box>
            <Box flex={1}>
              {liquidityConfig && (
                <PrintChart config={liquidityConfig} canvasHeight={400} />
              )}
            </Box>
          </Box>
          {isMobile && (
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              mb={1}
            >
              <ArrowLeft
                className={classes.arrowIcons}
                onClick={() => changePoolStateIndex(-1)}
              />
              <ArrowLeft
                className={classes.arrowIcons}
                onClick={() => changePoolStateIndex(1)}
              />
            </Box>
          )}
          <Grid container spacing={2}>
            {(!isMobile || poolStateIndex === 0) && (
              <Grid item xs={12} sm={4}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  className={commonClasses.card}
                  px={3}
                  py={9}
                  position="relative"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="row"
                    bgcolor="rgba(244, 62, 95, 0.09)"
                    borderRadius={15}
                    px={1}
                    py={0.5}
                    ml={1}
                    position="absolute"
                    top={24}
                    right={24}
                  >
                    <ArrowDownIcon />
                    <Text size={FontSize.L} color={Color.Red} ml={0.5} bold>
                      -3%
                    </Text>
                  </Box>
                  <Text
                    mb={1}
                    size={FontSize.XL}
                    color={Color.MusicDAOLightBlue}
                    bold
                    opacity={0.8}
                  >
                    TOTAL LIQUIDITY
                  </Text>
                  <Text mb={1} size={FontSize.H3} bold>
                    0.5732
                  </Text>
                  <Text
                    mb={1}
                    size={FontSize.XL}
                    color={Color.MusicDAOLightBlue}
                    bold
                    opacity={0.8}
                  >
                    MUSIC
                  </Text>
                </Box>
              </Grid>
            )}
            {(!isMobile || poolStateIndex === 1) && (
              <Grid item xs={12} sm={4}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  className={commonClasses.card}
                  px={3}
                  py={9}
                  position="relative"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="row"
                    bgcolor="rgba(0, 209, 59, 0.09)"
                    borderRadius={15}
                    px={1}
                    py={0.5}
                    ml={1}
                    position="absolute"
                    top={24}
                    right={24}
                  >
                    <ArrowUpIcon />
                    <Text
                      size={FontSize.L}
                      color={Color.MusicDAOTightGreen}
                      ml={0.5}
                      bold
                    >
                      -3%
                    </Text>
                  </Box>
                  <Text
                    mb={1}
                    size={FontSize.XL}
                    color={Color.MusicDAOLightBlue}
                    bold
                    opacity={0.8}
                  >
                    TOTAL REWARD
                  </Text>
                  <Text mb={1} size={FontSize.H3} bold>
                    7,923
                  </Text>
                  <Text
                    mb={1}
                    size={FontSize.XL}
                    color={Color.MusicDAOLightBlue}
                    bold
                    opacity={0.8}
                  >
                    MUSIC
                  </Text>
                </Box>
              </Grid>
            )}
            {(!isMobile || poolStateIndex === 2) && (
              <Grid item xs={12} sm={4}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  className={commonClasses.card}
                  px={3}
                  py={9}
                  position="relative"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="row"
                    bgcolor="rgba(244, 62, 95, 0.09)"
                    borderRadius={15}
                    px={1}
                    py={0.5}
                    ml={1}
                    position="absolute"
                    top={24}
                    right={24}
                  >
                    <ArrowDownIcon />
                    <Text size={FontSize.L} color={Color.Red} ml={0.5} bold>
                      -3%
                    </Text>
                  </Box>
                  <Text
                    mb={1}
                    size={FontSize.XL}
                    color={Color.MusicDAOLightBlue}
                    bold
                    opacity={0.8}
                  >
                    MINING REWARDS
                  </Text>
                  <Text mb={1} size={FontSize.H3} bold>
                    8,5732
                  </Text>
                  <Text
                    mb={1}
                    size={FontSize.XL}
                    color={Color.MusicDAOLightBlue}
                    bold
                    opacity={0.8}
                  >
                    MUSIC
                  </Text>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
        <StyledDivider className={classes.divider} type="solid" margin={9} />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Text size={FontSize.XXL} bold>
            Adds
          </Text>
          <SecondaryButton
            className={classnames(commonClasses.showAll, classes.showAllButton)}
            size="medium"
            radius={29}
          >
            Show All
            <Box
              position="absolute"
              flexDirection="row"
              top={0}
              right={0}
              pr={2}
            >
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <Box>
          <Grid container spacing={2}>
            {[0, 1, 2].slice(0, cardCount).map((index) => (
              <Grid key={`active-history-${index}`} item xs={12} sm={6} md={4}>
                <LiquidityPositionCard
                  data={{ type: 'Add', status: index % 2 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          mt={6}
        >
          <Text size={FontSize.XXL} bold>
            Removes
          </Text>
          <SecondaryButton
            className={classnames(commonClasses.showAll, classes.showAllButton)}
            size="medium"
            radius={29}
          >
            Show All
            <Box
              position="absolute"
              flexDirection="row"
              top={0}
              right={0}
              pr={2}
            >
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <Box>
          <Grid container spacing={2}>
            {[0, 1, 2].slice(0, cardCount).map((index) => (
              <Grid key={`active-history-${index}`} item xs={12} sm={6} md={4}>
                <LiquidityPositionCard data={{ type: 'Remove' }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
