import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import Moment from 'react-moment';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import { useTypedSelector } from 'store/reducers/Reducer';
import TradePodTokenModal from 'components/MusicDao/modals/TradePodTokenModal';
import TransactionProgressModal from '../../../../modals/TransactionProgressModal';

import Box from 'shared/ui-kit/Box';
import { Color, Gradient, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Avatar from 'shared/ui-kit/Avatar';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import { formatNumber } from 'shared/functions/commonFunctions';
import { useTokenConversion } from 'shared/contexts/TokenConversionContext';
import {
  musicDaoGetPodInvestmentTransactions,
  musicDaoClaimPodTokens
} from 'shared/services/API';
import { BlockchainNets } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { toDecimals } from 'shared/functions/web3';
import { useAuth } from 'shared/contexts/AuthContext';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';
import { roundFloat } from 'shared/helpers/number';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers';

import { investmentStyles } from './index.styles';

const INVESTTABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: 'Account',
    headerAlign: 'center'
  },
  {
    headerName: 'Quantity',
    headerAlign: 'center'
  },
  {
    headerName: 'Investment',
    headerAlign: 'center'
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
    headerName: 'Status',
    headerAlign: 'center'
  }
];

const Investments = ({ pod, podInfo, handleRefresh }) => {
  const classes = investmentStyles();
  const { convertTokenToUSD } = useTokenConversion();
  const userSelector = useTypedSelector((state) => state.user);
  const { isSignedin } = useAuth();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [investData, setInvestData] = useState<any[]>([]);

  const [mode, setMode] = useState<string>('invest');
  const [openBuySellModal, setOpenBuySellModal] = useState<boolean>(false);

  const [fundingEnded, setFundingEnded] = useState<boolean>(false);
  const [fundingEndTime, setFundingEndTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const { showAlertMessage } = useAlertMessage();

  const { account, library, chainId } = useWeb3React();

  const [paidAmount, setPaidAmount] = useState<number>(0);

  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [openTranactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const podNetwork =
    BlockchainNets.find((net) => net.value === pod.blockchainNetwork) ||
    BlockchainNets[0];

  const isFundingTargetReached = React.useMemo(
    () => pod && pod.RaisedFunds >= pod.FundingTarget,
    [pod]
  );

  const isClaimed = React.useMemo(
    () => pod?.ClaimedStatus && pod.ClaimedStatus[userSelector.id],
    [pod, userSelector]
  );

  const { maxPrioFee } = useMaxPrioFee();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    musicDaoGetPodInvestmentTransactions(pod.Id).then((resp) => {
      if (resp?.success) {
        let amount = 0;
        setInvestData(resp.data);
        resp.data.forEach((item) => {
          if (item.From.toLowerCase() === userSelector.address.toLowerCase())
            amount += +item.Amount;
        });
        setPaidAmount(amount);
      }
    });
  };

  // funding time inverval
  useEffect(() => {
    if (pod.FundingDate) {
      const timerId = setInterval(() => {
        const now = new Date();

        let delta = Math.floor(pod.FundingDate - now.getTime() / 1000);
        if (delta < 0) {
          setFundingEnded(true);
          setFundingEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          });
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setFundingEnded(false);
          setFundingEndTime({
            days,
            hours,
            minutes,
            seconds
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [pod.FundingDate]);

  const onRedeemBack = useCallback(() => {
    (async () => {
      setOpenTransactionModal(true);
      const targetChain = BlockchainNets.find(
        (net) => net.value === pod.blockchainNetwork
      );
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0x89);
        if (!isHere) {
          showAlertMessage(
            'Got failed while switching over to target netowrk',
            { variant: 'error' }
          );
          return;
        }
      }

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);

      const response = await web3APIHandler.PodWithdrawManager.returnPodTokens(
        web3,
        account!,
        {
          podAddress: pod.PodAddress
        },
        setHash
      );

      if (response.success) {
        handleRefresh();
        setTransactionSuccess(true);
      } else {
        showAlertMessage('Failed to Redeem Tokens', { variant: 'error' });
        setTransactionSuccess(false);
        handleRefresh();
      }
    })();
  }, [pod]);

  const onClaimPodTokens = useCallback(() => {
    (async () => {
      setOpenTransactionModal(true);

      const targetChain = BlockchainNets.find(
        (net) => net.value === pod.blockchainNetwork
      );
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0x89);
        if (!isHere) {
          showAlertMessage(
            'Got failed while switching over to target netowrk',
            { variant: 'error' }
          );
          return;
        }
      }

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);

      const response = await web3APIHandler.PodManager.claimPodTokens(
        web3,
        account!,
        {
          podAddress: pod.PodAddress
        },
        setHash,
        maxPrioFee
      );

      if (response.success) {
        setTransactionSuccess(true);

        const decimals = await web3APIHandler.Erc20['COPYRIGHT'].decimals(
          web3,
          podInfo.copyrightToken
        );
        const balance = await web3APIHandler.Erc20['COPYRIGHT'].balanceOf(
          web3,
          podInfo.copyrightToken,
          {
            account
          }
        );
        const amount = Number(toDecimals(balance, decimals));

        await musicDaoClaimPodTokens({
          podId: pod.Id,
          amount
        });

        handleRefresh();
      } else {
        setTransactionSuccess(false);

        showAlertMessage('Failed to Claim Media Fractions', {
          variant: 'error'
        });
        handleRefresh();
      }
    })();
  }, [pod]);

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    investData.forEach((item) => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box display="flex" alignItems="center">
            <Avatar
              size={34}
              rounded
              bordered
              image={
                processImage(item.fromUser?.imageUrl) || getDefaultAvatar()
              }
            />
            <Box ml={1}>{item.fromUser?.name}</Box>
          </Box>
        ),
        cellAlign: 'center',
        odd: item.From === account
      });
      row.push({
        cell: (
          <Box>
            {roundFloat(+item.Amount / +podInfo.fundingTokenPrice, 4) ?? 0}
          </Box>
        ),
        cellAlign: 'center',
        odd: item.From === account
      });
      row.push({
        cell: (
          <Box>
            {formatNumber(
              convertTokenToUSD(item.FundingToken, item.Amount),
              'USD',
              2
            )}
          </Box>
        ),
        cellAlign: 'center',
        odd: item.From === account
      });
      row.push({
        cell: (
          <Box color="#65CB63" className={classes.addressBox}>
            {isTablet
              ? `${item.From.substring(0, 6)}...${item.From.substring(
                  item.From.length - 4,
                  item.From.length
                )}`
              : item.From}
          </Box>
        ),
        cellAlign: 'center',
        odd: item.From === account
      });
      row.push({
        cell: (
          <Box style={{ minWidth: theme.spacing(20) }}>
            <Moment format="ddd, DD MMM-h:mm A">{item.Date * 1000}</Moment>
          </Box>
        ),
        cellAlign: 'center',
        odd: item.From === account
      });
      row.push({
        cell: (
          <Box className={classes.flexBox}>
            <Box className={classes.circle}></Box>
            Confirmed
          </Box>
        ),
        cellAlign: 'center',
        odd: item.From === account
      });
      row.push({
        cell: (
          <Box>
            {item.Id && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${podNetwork.scan.url}/tx/${item.Id}`}
              >
                <img
                  className={classes.externalLink}
                  src={require('assets/icons/newScreen_black.svg')}
                  alt="link"
                />
              </a>
            )}
          </Box>
        ),
        cellAlign: 'center',
        odd: item.From === account
      });
      tableData.push(row);
    });
    return tableData;
  };

  return (
    <>
      {podInfo && (
        <Box>
          <Box
            className={classes.flexBox}
            justifyContent="space-between"
            px={1}
            mb={'27px'}
          >
            <Box className={classes.title}>Investment</Box>
            {podInfo.status !== 'Funding Failed' &&
              !isFundingTargetReached &&
              isSignedin && (
                <Box
                  style={{
                    position: 'relative'
                  }}
                >
                  <PrimaryButton
                    size="small"
                    onClick={() => {
                      setMode('invest');
                      setOpenBuySellModal(true);
                    }}
                    style={{
                      background: Gradient.Green1,
                      padding: '11px 48px',
                      borderRadius: '46px',

                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '18px',
                      border: 'none',
                      height: 'auto',
                      textTransform: 'uppercase'
                    }}
                    isRounded
                  >
                    Invest
                  </PrimaryButton>
                </Box>
              )}
          </Box>
          <Box>
            <Box className={classes.whiteBox} mx={1}>
              <Grid container>
                <Grid
                  item
                  xs={6}
                  sm={3}
                  md={3}
                  className={classes.whiteBoxPriceItem}
                >
                  <Box className={classes.header2}>Token price</Box>
                  <Box className={classes.header3} mt={1}>
                    {formatNumber(
                      convertTokenToUSD(
                        pod.FundingToken ?? 'MUSIC',
                        podInfo.fundingTokenPrice ?? 0
                      ),
                      'USD',
                      6
                    ) || 'N/A'}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sm={3}
                  md={3}
                  className={classes.whiteBoxFundsItem}
                >
                  <Box className={classes.header2}>Funds raised </Box>
                  <Box className={classes.header3} mt={1}>
                    {formatNumber(
                      convertTokenToUSD(
                        pod.FundingToken ?? 'MUSIC',
                        pod.RaisedFunds ?? 0
                      ),
                      'USD',
                      4
                    ) || 'N/A'}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  className={classes.whiteBoxPaddingItem}
                >
                  <Box className={classes.barContainer} mb={'12px'}>
                    <Box
                      style={{
                        width: `${
                          (pod.RaisedFunds / podInfo.fundingTarget) * 100
                        }%`
                      }}
                    />
                  </Box>
                  <Box
                    className={classes.flexBox}
                    justifyContent="space-between"
                  >
                    <Box
                      className={classes.header3}
                      style={{ fontWeight: 400 }}
                    >
                      Supply already sold
                    </Box>
                    <Box
                      className={classes.flexBox}
                      style={isMobile ? { alignItems: 'flex-start' } : {}}
                    >
                      <Box
                        className={classes.header3}
                        style={{ fontWeight: 400 }}
                      >
                        {pod.RaisedFunds
                          ? roundFloat(
                              pod.RaisedFunds / podInfo.fundingTokenPrice,
                              4
                            )
                          : 0}
                        /
                      </Box>
                      <Box className={classes.header3}>
                        {roundFloat(
                          podInfo.fundingTarget / podInfo.fundingTokenPrice,
                          4
                        ) || 'N/A'}{' '}
                        {isMobile && <br />}
                        {pod.TokenSymbol || 'Tokens'}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box
                className={classes.greenBox}
                justifyContent={
                  pod.RaisedFunds <= 0 ? 'space-around' : 'space-between'
                }
              >
                <Box
                  flex={1}
                  className={classes.flexBox}
                  justifyContent="space-between"
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    width={1}
                  >
                    <Box
                      className={classes.header2}
                      style={{ textAlign: 'center' }}
                    >
                      Amount of Media Fractions purchased
                    </Box>
                    <Box className={classes.header3} mt={1}>
                      {formatNumber(
                        (paidAmount || 0) / podInfo.fundingTokenPrice,
                        pod.TokenSymbol,
                        4
                      ) || 'N/A'}
                    </Box>
                  </Box>
                  <Box className={classes.divider} />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    width={1}
                  >
                    <Box className={classes.header2}>Amount paid</Box>
                    <Box className={classes.header3} mt={1}>
                      {formatNumber(paidAmount || 0, pod.FundingToken, 4) ||
                        'N/A'}
                    </Box>
                  </Box>
                </Box>
              </Box>
              {fundingEnded &&
                isFundingTargetReached &&
                isClaimed &&
                paidAmount > 0 && (
                  <Box
                    className={classes.flexBox}
                    justifyContent="flex-end"
                    mt={2}
                  >
                    <SecondaryButton
                      size="medium"
                      onClick={onClaimPodTokens}
                      style={{
                        background: Color.MusicDAOGreen,
                        color: 'white',
                        border: 'none'
                      }}
                      isRounded
                    >
                      CLAIM YOUR MEDIA FRACTIONS
                    </SecondaryButton>
                  </Box>
                )}
              {fundingEnded && !isFundingTargetReached && paidAmount !== 0 && (
                <Box
                  className={classes.flexBox}
                  justifyContent="flex-end"
                  mt={2}
                >
                  <SecondaryButton
                    size="medium"
                    onClick={onRedeemBack}
                    style={{
                      background: '#FF8E3C',
                      color: 'white',
                      border: 'none'
                    }}
                    isRounded
                  >
                    RETURN BACK THE FUNDS
                  </SecondaryButton>
                </Box>
              )}
              <Box className={classes.timeBox} mt={2}>
                <Box className={classes.header2}>Time to finish funding</Box>
                <Box className={classes.timeValueBox}>
                  <Box className={classes.timeGreenBox}>
                    {fundingEndTime.days} d
                  </Box>
                  <Box className={classes.timeGreenBox} ml={1} color="#65CB63">
                    {fundingEndTime.hours} h
                  </Box>
                  <Box className={classes.timeGreenBox} ml={1} color="#65CB63">
                    {fundingEndTime.minutes} min
                  </Box>
                  <Box className={classes.timeGreenBox} ml={1} color="#65CB63">
                    {fundingEndTime.seconds} s
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box mt={2} px={1}>
              <CustomTable
                headers={[
                  ...INVESTTABLEHEADER,
                  { headerName: podNetwork.scan.name, headerAlign: 'center' }
                ]}
                rows={getTableData()}
                theme="transaction"
              />
            </Box>
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
          <TradePodTokenModal
            open={openBuySellModal}
            mode={mode}
            setMode={setMode}
            pod={pod}
            handleClose={() => setOpenBuySellModal(false)}
            handleRefresh={() => {
              loadData();
              handleRefresh();
            }}
          />
        </Box>
      )}
    </>
  );
};

export default Investments;
