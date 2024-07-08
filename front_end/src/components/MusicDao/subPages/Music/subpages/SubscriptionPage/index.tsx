import React, { useEffect, useState, useCallback, useMemo } from 'react';

import Grid from '@material-ui/core/Grid';

import Box from 'shared/ui-kit/Box';
import { musicSubPageStyles } from '../index.styles';
import { BlockchainNets } from 'shared/constants/constants';
import { subscriptionPageStyles } from './index.styles';
import clsx from 'clsx';
import PrintChart from 'shared/ui-kit/Chart/Chart';
import { PrimaryButton } from 'shared/ui-kit';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import Avatar from 'shared/ui-kit/Avatar';
import TokenInput from '../../components/TokenInput';
import ChainSelector from '../../components/ChainSelector';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { switchNetwork } from 'shared/functions/metamask';
import { toDecimals, toNDecimals } from 'shared/functions/web3';
import TransactionProgressModal from '../../../../modals/TransactionProgressModal';
import {
  musicDaoGetSubscription,
  musicDaoSubscribe,
  musicDaoSubscriptionClaimReward
} from 'shared/services/API';
import Moment from 'react-moment';
import TokenSelector from '../../components/TokenSelector';
import CustomSwitch from 'shared/ui-kit/CustomSwitch';
import ConfirmSubscriptionModal from '../../modals/ConfirmSubscriptionModal';

const chartConfig = {
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
      hover: {
        intersect: false
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
            },

            scaleLabel: {
              display: true,
              labelString: 'Music Hours'
            }
          }
        ],
        yAxes: [
          {
            display: true,
            offset: true,
            position: 'left',
            gridLines: {
              color: '#ffffff00',
              drawBorder: false
            },
            ticks: {
              display: true,
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Discount %'
            }
          }
        ]
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          //This removes the tooltip title
          title: function (tooltipItems, data) {
            return '';
          },
          label: function (tooltipItem, data) {
            return `${tooltipItem.yLabel} TRAX Reward`;
          }
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: 'nearest',
        caretSize: 10,
        backgroundColor: '#65CB63',
        bodyFontSize: 14,
        bodyFontColor: '#fff',
        bodyFontStyle: 'bold'
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
    gradient.addColorStop(0, 'rgba(101, 203, 99, 0.2)');
    gradient.addColorStop(0.78, 'rgba(17, 224, 162, 0.2)');
    gradient.addColorStop(1, 'rgba(149, 255, 217, 0.2)');

    config.data.datasets[0].backgroundColor = gradient;
  }

  return config;
};

const tableHeader: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: 'left',
    headerName: 'Asset'
  },
  {
    headerAlign: 'center',
    headerName: 'Amount'
  },
  {
    headerAlign: 'center',
    headerName: 'Total Value'
  },
  {
    headerAlign: 'center',
    headerName: 'Time'
  },
  {
    headerAlign: 'center',
    headerName: 'Polygon Scan'
  }
];

const tokenSymbol = 'hours';
const minimumAmount = 3;

export default function SubscriptionPage() {
  const parentClasses = musicSubPageStyles();
  const classes = subscriptionPageStyles();
  const [network, setNetwork] = useState<string>(BlockchainNets[1].name);
  const [token, setToken] = useState<string>('USDT');
  const [rewardConfig, setRewardConfig] = useState<any>();
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>(
    []
  );
  const [isAuto, setIsAuto] = useState<boolean>(true);

  const [subscription, setSubscription] = useState<any>();

  const [amount, setAmount] = useState<number>(0);

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [openTranactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

  useEffect(() => {
    getChartData();
    loadData();
  }, []);

  const CalculateStatsLabel = ({ title, value, unit }) => (
    <Box mb={4}>
      <Box className={clsx(classes.greenTypo, classes.uppercase)} mb={1}>
        {title}
      </Box>
      <Box className={classes.smallTitle}>
        {value}
        <span className={classes.subTitle3}>{unit}</span>
      </Box>
      <Box className={classes.bottomBorder} />
    </Box>
  );

  const getChartData = useCallback(async () => {
    let rewardConfig: any = chartConfig;

    rewardConfig.configurer = configurer;

    let hours: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9],
      values: any[] = [1, 2, 4, 7, 10, 12, 32, 40, 50];

    rewardConfig.config.data.labels = hours;
    rewardConfig.config.data.datasets[0].data = values;
    rewardConfig.config.data.datasets[0].backgroundColor = '#65CB63';
    rewardConfig.config.data.datasets[0].borderColor = '#54658F';
    rewardConfig.config.data.datasets[0].pointBackgroundColor = '#65CB63';
    rewardConfig.config.data.datasets[0].pointBorderColor = '#65CB63';
    rewardConfig.config.data.datasets[0].pointHoverBorderColor = '#65CB63';
    rewardConfig.config.data.datasets[0].hoverBackgroundColor = '#65CB63';

    setRewardConfig(rewardConfig);
  }, []);

  const loadData = useCallback(async () => {
    const response = await musicDaoGetSubscription();
    if (response.success) {
      setSubscription(response.data);
      setTableData(
        response.data.history.map((item) => [
          {
            cellAlign: 'center',
            cell: (
              <Box display="flex" alignItems="center" justifyContent="left">
                <Avatar
                  image={require('assets/tokenImages/COMP.webp')}
                  size={34}
                />
                <Box display="flex" flexDirection="column" ml={3}>
                  <Box fontSize={14} fontWeight={500} color="#65CB63">
                    TRAX
                  </Box>
                </Box>
              </Box>
            )
          },
          {
            cellAlign: 'center',
            cell: (
              <Box fontSize={14} fontWeight={500} color="#707582">
                {item.reward.toFixed(4)} TRAX
              </Box>
            )
          },
          {
            cellAlign: 'center',
            cell: (
              <Box fontSize={14} fontWeight={500} color="#707582">
                $74.03k
              </Box>
            )
          },
          {
            cellAlign: 'center',
            cell: (
              <Box fontSize={14} fontWeight={500} color="#707582">
                <Moment fromNow>{item.time}</Moment>
              </Box>
            )
          },
          {
            cellAlign: 'center',
            cell: (
              <Box display="flex" justifyContent="center">
                <Avatar
                  image={require('assets/tokenImages/POLYGON.webp')}
                  size={24}
                  onClick={() => {
                    window.open(
                      `${BlockchainNets[1].scan.url}/tx/${item.hash}`,
                      '_blank'
                    );
                  }}
                />
              </Box>
            )
          }
        ])
      );
    }
  }, []);

  const validate = useMemo(() => {
    if (amount < minimumAmount) {
      return false;
    } else {
      return true;
    }
  }, [amount]);

  const estimatedHours = useMemo(() => amount * 4, [amount]);
  const estimatedReward = useMemo(() => amount * 40, [amount]);

  const handleGetSubscription = async () => {
    setOpenConfirmModal(true);
    return;

    if (!validate) {
      showAlertMessage('Amount should be greater than $3.', {
        variant: 'error'
      });
      return;
    }

    setOpenTransactionModal(true);

    const targetChain = BlockchainNets.find((net) => net.name === network);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0x89);
      if (!isHere) {
        showAlertMessage('Got failed while switching over to target netowrk', {
          variant: 'error'
        });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);

    const decimals = await web3APIHandler.Erc20[tokenSymbol].decimals(web3);
    const traxDecimals = await web3APIHandler.Erc20['TRAX'].decimals(web3);

    const approve = await web3APIHandler.Erc20[tokenSymbol].approve(
      web3,
      account,
      web3Config.CONTRACT_ADDRESSES.Subscription,
      toNDecimals(amount, decimals)
    );

    if (!approve) {
      showAlertMessage('Failed to approve the amount', { variant: 'error' });
      setTransactionSuccess(false);

      return;
    }
    const response = await web3APIHandler.Subscription.subscribe(
      web3,
      account,
      { amount: toNDecimals(amount, decimals) },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);

      if (response.data.tokenId) {
        await musicDaoSubscribe({
          amount: +amount,
          hours: +response.data.hoursOfSubscription,
          reward: +toDecimals(response.data.traxReward, traxDecimals),
          hash: response.data.hash,
          tokenId: response.data.tokenId
        });
        loadData();
      } else {
        showAlertMessage('Failed to get token id. Please try again.', {
          variant: 'error'
        });
      }
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to subscribe. Please try again.', {
        variant: 'error'
      });
    }
  };
  const handleAddHours = () => {};
  const handleClaimToken = async () => {
    setOpenTransactionModal(true);

    const targetChain = BlockchainNets.find((net) => net.name === network);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0x89);
      if (!isHere) {
        showAlertMessage('Got failed while switching over to target netowrk', {
          variant: 'error'
        });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    const traxDecimals = await web3APIHandler.Erc20['TRAX'].decimals(web3);

    const response = await web3APIHandler.SubscriptionReward.claimAccruedReward(
      web3,
      account,
      { tokenId: subscription.tokenId },
      setHash
    );

    if (response.success) {
      setTransactionSuccess(true);

      await musicDaoSubscriptionClaimReward({
        reward: +toDecimals(response.data.reward, traxDecimals),
        hash: response.data.hash
      });
      loadData();
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to subscribe. Please try again.', {
        variant: 'error'
      });
    }
  };

  return (
    <Box className={parentClasses.pageHeader}>
      <Box className={parentClasses.content}>
        {!subscription ? (
          <Box className={classes.card}>
            <Box className={classes.title}>
              Pick Your Music Subscription Plan
            </Box>
            <Box className={classes.subTitle1} mt={1} mb={4}>
              You can pick your subscription plan by adjusting USDT value to
              match hours of music you want in return.
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box mb={2}>Chain</Box>
                    <ChainSelector
                      network={network}
                      setNetwork={setNetwork}
                      BlockchainNets={BlockchainNets}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box mb={2}>Payment Token</Box>
                    <TokenSelector token={token} setToken={setToken} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Box>Amount of listening hours</Box>
                  <Box className={classes.greenTypo}>Minimum amout is 10h</Box>
                </Box>
                <TokenInput
                  symbol={tokenSymbol}
                  amount={amount}
                  setAmount={setAmount}
                />
              </Grid>
            </Grid>

            <Box className={classes.greenCard} mt={4} mb={4}>
              <Box className={parentClasses.content}>
                <Box className={classes.title}>Calculate Discount</Box>
                <Box className={classes.subTitle2} mb={4}>
                  Discount applies to your purchase and grows proportionally to
                  the amount of music hours you buy.
                </Box>
                <Grid container spacing={4}>
                  <Grid item xs={6} md={6}>
                    <CalculateStatsLabel
                      title="Amount you pay"
                      value={amount}
                      unit="USDT"
                    />
                    <CalculateStatsLabel
                      title="Amount of hours you get"
                      value={estimatedHours}
                      unit="hours"
                    />
                    <CalculateStatsLabel
                      title="total discount"
                      value={estimatedReward}
                      unit="%"
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <PrintChart config={rewardConfig} />
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                <CustomSwitch
                  checked={isAuto}
                  theme="music dao"
                  onChange={() => setIsAuto((prev) => !prev)}
                />
                <Box className={classes.subTitle2} ml={2} maxWidth={200}>
                  Auto renew subscription each month.
                </Box>
              </Box>
              <PrimaryButton
                size="medium"
                className={clsx(
                  classes.button,
                  classes.uppercase,
                  classes.buttonLarge
                )}
                onClick={handleGetSubscription}
              >
                Get Subscription
              </PrimaryButton>
            </Box>
          </Box>
        ) : (
          <>
            <Box className={classes.largeTitle}>Your Subscription</Box>
            <Box className={classes.card} mt={3}>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Box className={classes.smallTitle}>
                    Your subscription - {subscription.totalPaid} USDT
                  </Box>
                  <Box className={classes.greenTypo}>
                    You have {Math.floor(subscription.hours / 3600)} hours of
                    music left
                  </Box>
                  <Box className={classes.subTitle1}>
                    You can buy listening hours for USDT platform instantly
                    without going through staking. Start <br />
                    enjoying music without investing big amounts.
                  </Box>
                </Box>
                <PrimaryButton
                  size="medium"
                  className={clsx(classes.button, classes.buttonSmall)}
                  onClick={handleAddHours}
                >
                  Add Hours
                </PrimaryButton>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Box className={classes.smallTitle}>
                  Total listening hours consumed:
                </Box>
                <Box className={classes.greenTypo}>
                  22455 hours (22 days 10 hours)
                </Box>
              </Box>
            </Box>
            <Box className={classes.title} mt={4}>
              Your reward
            </Box>
            <Box display="flex" mt={2}>
              <Box>
                <Box className={classes.title}>
                  24<span className={classes.subTitle3}>TRAX</span>
                </Box>
                <Box className={classes.greenTypo}>Total Vested</Box>
              </Box>
              <Box ml={7}>
                <Box className={classes.title}>
                  8,5732<span className={classes.subTitle3}>TRAX</span>
                </Box>
                <Box className={classes.greenTypo}>Total Vested</Box>
              </Box>
            </Box>

            <Box className={classes.card} mt={3}>
              <Box display="flex" justifyContent="space-between">
                <Box display="flex">
                  <Avatar
                    image={require('assets/tokenImages/COMP.webp')}
                    size={34}
                  />
                  <Box ml={4}>
                    <Box className={classes.smallTitle}>Claimable discount</Box>
                    <Box className={classes.title}>
                      456<span className={classes.subTitle3}>TRAX</span>
                    </Box>
                  </Box>
                </Box>
                <PrimaryButton
                  size="medium"
                  className={clsx(classes.button, classes.buttonSmall)}
                  onClick={handleClaimToken}
                >
                  Claim TRAX
                </PrimaryButton>
              </Box>
            </Box>

            <Box className={classes.title} mt={4} mb={3}>
              Claimed Rewards
            </Box>

            <CustomTable
              headers={tableHeader}
              rows={tableData}
              placeholderText="No data"
              theme="rewards"
              radius={20}
            />
          </>
        )}
      </Box>
      <TransactionProgressModal
        open={openTranactionModal}
        onClose={() => {
          setHash('');
          setTransactionSuccess(null);
          setOpenTransactionModal(false);
        }}
        txSuccess={transactionSuccess}
        hash={hash}
      />
      {openConfirmModal && (
        <ConfirmSubscriptionModal
          open={openConfirmModal}
          handleClose={() => setOpenConfirmModal(false)}
        />
      )}
    </Box>
  );
}
