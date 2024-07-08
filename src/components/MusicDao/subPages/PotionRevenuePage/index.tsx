import React from 'react';

import Box from 'shared/ui-kit/Box';
import { Color, FontSize } from 'shared/ui-kit';
import { potionRevenuePageStyle } from './index.styles';

import { BackIcon } from 'components/MusicDao/components/Icons/SvgIcons';
import { Text } from 'components/MusicDao/components/ui-kit';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import RevenueCard from 'components/MusicDao/components/Cards/RevenueCard';
import PrintChart from 'shared/ui-kit/Chart/Chart';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import SongCard from 'components/MusicDao/components/Cards/SongCard';
import { Pagination } from '@material-ui/lab';

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
          top: 0,
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
              fontColor: 'white'
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
              fontColor: 'white',

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

const GRAPHOPTIONS = ['Potions', 'Revenue', 'Monetisation rate'];
const DATEOPTIONS = ['1D', '7D', '1M', 'YTD'];
const DATELABELS = ['Hour', 'Day', 'Date', 'Month'];

const SAMPLEDATA = {
  name: 'Bubble Dispersion',
  stake: '22244',
  rewards: ' 1.45',
  rate: '0.05',
  revenue: '234'
};

export default function PotionRevenuePage() {
  const classes = potionRevenuePageStyle();
  const history = useHistory();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [graphOption, setGraphOption] = React.useState<string>(GRAPHOPTIONS[0]);
  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const [currentDateOption, setCurrentDateOption] = React.useState<string>(
    DATEOPTIONS[0]
  );

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

  const renderTopStaking = () => {
    return (
      <>
        <RevenueCard
          isStaking={activeTab === 0}
          type={0}
          value={activeTab === 0 ? '244420.5732' : '2923/42 245'}
          description={activeTab === 0 ? 'TRAX Staked' : 'Amount Monetised'}
          tag={activeTab === 0 ? 'TRAX' : 'TPR'}
        />
        <Box mx={2} width={1}>
          <RevenueCard
            isStaking={activeTab === 0}
            type={1}
            value={activeTab === 0 ? '7,923' : '244 420.57'}
            description={
              activeTab === 0 ? 'Potions Awarded' : 'Total generated revenue'
            }
            tag={activeTab === 0 ? 'TPR' : 'USDT'}
          />
        </Box>
        <RevenueCard
          isStaking={activeTab === 0}
          type={2}
          value={activeTab === 0 ? '244420.5732' : '23.54'}
          description={
            activeTab === 0 ? 'Staking rewards' : 'monetisation rate '
          }
          tag={activeTab === 0 ? 'TRAX' : 'USDT/s per Potion'}
        />
      </>
    );
  };

  return (
    <Box className={classes.container}>
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
        <BackIcon color={Color.MusicDAODark} />
        <Box ml={1} color={Color.MusicDAODark}>
          BACK
        </Box>
      </Box>
      <Box className={classes.body}>
        <Box className={classes.headerTitle}>Manage Revenue</Box>
        <Box display="flex" justifyContent="center">
          <Box className={classes.tabBarBox} mt={3}>
            <Box
              className={`${classes.tabBarItem} ${
                activeTab === 0 ? classes.tabBarItemActive : ''
              }`}
              onClick={() => setActiveTab(0)}
            >
              TRAX Staking
            </Box>
            <Box
              className={`${classes.tabBarItem} ${
                activeTab === 1 ? classes.tabBarItemActive : ''
              }`}
              onClick={() => setActiveTab(1)}
            >
              Potions Monetisation
            </Box>
          </Box>
        </Box>
        <Box className={classes.stakingBox} width={1} mt={5} px={25}>
          {renderTopStaking()}
        </Box>
        <Box
          mt={-20}
          pt={25}
          px={25}
          pb={5}
          style={{
            background: '#ffffff40',
            zIndex: 1
          }}
        >
          <Box className={classes.graphBox} mt={4}>
            <Box className={classes.controlParentBox}>
              <Box className={classes.header1} style={{ color: 'white' }}>
                Potions given over time
              </Box>
              <Box className={classes.controlBox}>
                <Box className={classes.liquidityBox}>
                  {GRAPHOPTIONS.map((item, index) => (
                    <button
                      key={`option-button-${index}`}
                      className={`${classes.groupButton} ${
                        item === graphOption && classes.selectedGroupButton
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
            <Box
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-end"
              width={1}
              pr={1}
              mt={2}
            >
              <Box
                display="flex"
                alignItems="center"
                style={{ background: '#3B4674', borderRadius: '4px' }}
              >
                {DATEOPTIONS.map((item, index) => (
                  <Box
                    key={index}
                    ml={index > 0 ? 1 : 0}
                    className={`${classes.dateButton} ${
                      currentDateOption === DATEOPTIONS[index]
                        ? classes.dateButtonSelected
                        : ''
                    }`}
                    onClick={() => setCurrentDateOption(DATEOPTIONS[index])}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-end"
              width={1}
              pr={1}
              mt={1}
            >
              <Text size={FontSize.S} style={{ color: 'white' }}>
                POTIONS
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
                style={{ marginBottom: 4, color: 'white' }}
              >
                {DATELABELS[DATEOPTIONS.indexOf(currentDateOption)]}
              </Text>
              <Box height="250px" width={1}>
                {rewardConfig && <PrintChart config={rewardConfig} />}
              </Box>
            </Box>
          </Box>
          <Box
            className={classes.header1}
            mt={6}
            display="flex"
            width={1}
            mb={2}
          >
            {activeTab === 0 ? 'Tracks you stake' : 'Monetised tracks'}
          </Box>
          <MasonryGrid
            gutter={'24px'}
            data={[
              SAMPLEDATA,
              SAMPLEDATA,
              SAMPLEDATA,
              SAMPLEDATA,
              SAMPLEDATA,
              SAMPLEDATA
            ]}
            renderItem={(item, index) => (
              <SongCard data={item} type={activeTab} />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
          />
          <Box className={classes.pagination}>
            <Pagination count={10} onChange={() => {}} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const COLUMNS_COUNT_BREAK_POINTS_SIX = {
  400: 1,
  650: 2,
  1100: 3,
  1440: 4
};
